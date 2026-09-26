import { IBusinessDiscoveryProvider, RawBusinessResult, SearchParams } from './types';

export class OpenStreetMapProvider implements IBusinessDiscoveryProvider {
  public name = 'OpenStreetMap Overpass';

  public isConfigured(): boolean {
    return true; // Overpass API is publicly accessible
  }

  public async searchBusinesses(params: SearchParams): Promise<RawBusinessResult[]> {
    const { city, state, subcategory, category, latitude, longitude } = params;

    const amenityFilters = this.getAmenityFilters(category, subcategory);

    // Using nwr (nodes, ways, relations) with out center ensures large hospital complexes,
    // hotels, university campuses, and department stores mapped as areas are fully captured.
    const query = latitude && longitude
      ? `
        [out:json][timeout:4];
        (
          ${amenityFilters.map((f) => `nwr${f}(around:20000, ${latitude}, ${longitude});`).join('\n')}
        );
        out center 25;
      `
      : `
        [out:json][timeout:4];
        area["name"="${city}"]->.searchArea;
        (
          ${amenityFilters.map((f) => `nwr${f}(area.searchArea);`).join('\n')}
        );
        out center 25;
      `;

    const endpoints = [
      'https://overpass-api.de/api/interpreter',
      'https://overpass.kumi.systems/api/interpreter',
    ];

    for (const endpoint of endpoints) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3500);

        const response = await fetch(endpoint, {
          method: 'POST',
          body: `data=${encodeURIComponent(query)}`,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'LocalIntelligenceFinder/1.0 (Public Research Directory)',
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          continue;
        }

        const data = await response.json();
        if (!data || !Array.isArray(data.elements)) {
          continue;
        }

      const results: RawBusinessResult[] = [];

      for (const element of data.elements) {
        const tags = element.tags || {};
        const name = tags.name || tags['name:en'];
        if (!name) continue;

        const street = tags['addr:street'] || tags['addr:road'] || '';
        const suburb = tags['addr:suburb'] || tags['addr:district'] || tags['addr:city'] || '';
        const postalCode = tags['addr:postcode'] || tags.postal_code || '';
        const stateStr = state ? `, ${state}` : '';
        const fullAddress = [tags['addr:housenumber'], street, suburb, city].filter(Boolean).join(', ') || `${city}${stateStr}, India`;

        const phone = tags.phone || tags['contact:phone'] || tags['contact:mobile'] || tags.mobile;
        const email = tags.email || tags['contact:email'];
        const website = tags.website || tags['contact:website'] || tags.url;
        const openingHours = tags.opening_hours;

        const socialProfiles: Record<string, string> = {};
        if (tags['contact:facebook'] || tags.facebook) socialProfiles.facebook = tags['contact:facebook'] || tags.facebook;
        if (tags['contact:instagram'] || tags.instagram) socialProfiles.instagram = tags['contact:instagram'] || tags.instagram;
        if (tags['contact:twitter'] || tags.twitter) socialProfiles.twitter = tags['contact:twitter'] || tags.twitter;
        if (tags['contact:linkedin'] || tags.linkedin) socialProfiles.linkedin = tags['contact:linkedin'] || tags.linkedin;

        // Extract offerings / specialties
        const services: string[] = [];
        if (tags['healthcare:speciality']) {
          services.push(...tags['healthcare:speciality'].split(';').map((s: string) => s.trim()));
        }
        if (tags.cuisine) {
          services.push(...tags.cuisine.split(';').map((s: string) => `${s.trim()} Cuisine`));
        }
        if (tags.operator) {
          services.push(`Operator: ${tags.operator}`);
        }

        // Determine friendly subcategory
        const detectedSubcategory = subcategory ||
          (tags.tourism ? (tags.tourism === 'hotel' ? 'Hotel' : tags.tourism.charAt(0).toUpperCase() + tags.tourism.slice(1)) : null) ||
          (tags.amenity ? tags.amenity.charAt(0).toUpperCase() + tags.amenity.slice(1) : null) ||
          (tags.shop ? `${tags.shop.charAt(0).toUpperCase() + tags.shop.slice(1)} Store` : null) ||
          (tags.office ? `${tags.office.toUpperCase()} Office` : null) ||
          'Commercial Establishment';

        results.push({
          id: `osm-${element.type || 'node'}-${element.id}`,
          name: name.trim(),
          category: category || this.inferCategory(tags),
          subcategory: detectedSubcategory,
          description: tags.description || `${name.trim()} is an active ${detectedSubcategory.toLowerCase()} in ${city}, mapped on OpenStreetMap.`,
          address: fullAddress,
          area: suburb || city,
          city: city,
          state: state,
          country: 'India',
          postalCode: postalCode || undefined,
          latitude: element.lat || element.center?.lat,
          longitude: element.lon || element.center?.lon,
          phone: phone ? phone.trim() : undefined,
          email: email ? email.trim() : undefined,
          website: website ? website.trim() : undefined,
          openingHours: openingHours || undefined,
          socialProfiles: Object.keys(socialProfiles).length > 0 ? socialProfiles : undefined,
          services: services.length > 0 ? services : undefined,
          source: 'OpenStreetMap',
          sourceUrl: `https://www.openstreetmap.org/${element.type || 'node'}/${element.id}`,
          placeId: `osm-${element.type || 'node'}-${element.id}`,
          rating: tags.stars ? parseFloat(tags.stars) : undefined,
          isMock: false,
        });
      }

        if (results.length > 0) {
          return results;
        }
      } catch (err) {
        // Continue to fallback mirror endpoint
        continue;
      }
    }

    return [];
  }

  private inferCategory(tags: Record<string, string>): string {
    if (tags.tourism) return 'Hotels & Hospitality';
    if (tags.healthcare || tags.amenity === 'hospital' || tags.amenity === 'clinic' || tags.amenity === 'pharmacy') return 'Healthcare';
    if (tags.shop) return 'Shops';
    if (tags.amenity === 'restaurant' || tags.amenity === 'cafe' || tags.amenity === 'fast_food') return 'Food & Dining';
    if (tags.amenity === 'training' || (tags.name && tags.name.toLowerCase().includes('class'))) return 'Classes';
    if (tags.amenity === 'school' || tags.amenity === 'college' || tags.amenity === 'university') return 'Institutions';
    if (tags.office) return 'Professional Services';
    return 'Other';
  }

  private getAmenityFilters(category?: string, subcategory?: string): string[] {
    const c = (category || '').toLowerCase();
    const s = (subcategory || '').toLowerCase();

    // Classes & Coaching
    if (c.includes('class') || s.includes('class') || s.includes('coaching') || s.includes('tuition')) {
      return ['["amenity"="training"]', '["amenity"="school"]', '["office"="educational_institution"]'];
    }

    // Institutions / Colleges / Universities / Schools
    if (c.includes('institution') || s.includes('college') || s.includes('university') || s.includes('institute') || s.includes('school')) {
      return ['["amenity"="college"]', '["amenity"="university"]', '["amenity"="school"]', '["office"="educational_institution"]'];
    }

    // Shops / Stores / Supermarkets
    if (c.includes('shop') || s.includes('shop') || s.includes('store') || s.includes('market') || s.includes('grocery') || c.includes('retail')) {
      return ['["shop"]', '["amenity"="marketplace"]'];
    }

    // Healthcare & Hospitals
    if (c.includes('healthcare') || s.includes('hospital') || s.includes('clinic') || s.includes('pharmacy') || s.includes('doctor') || s.includes('diagnostic')) {
      return ['["amenity"="hospital"]', '["amenity"="clinic"]', '["amenity"="pharmacy"]', '["amenity"="doctors"]', '["healthcare"]'];
    }

    // Hotels, Lodging, Hospitality & Tourism
    if (c.includes('hotel') || s.includes('hotel') || s.includes('lodge') || s.includes('resort') || s.includes('guest') || s.includes('hostel') || c.includes('tourism')) {
      return ['["tourism"="hotel"]', '["tourism"="guest_house"]', '["tourism"="hostel"]', '["tourism"="motel"]', '["tourism"="resort"]', '["amenity"="hotel"]'];
    }

    // Food & Dining / Restaurants / Cafes
    if (c.includes('food') || s.includes('restaurant') || s.includes('cafe') || s.includes('bakery') || s.includes('dining')) {
      return ['["amenity"="restaurant"]', '["amenity"="cafe"]', '["amenity"="fast_food"]', '["shop"="bakery"]'];
    }

    // Education
    if (c.includes('education')) {
      return ['["amenity"="college"]', '["amenity"="school"]', '["amenity"="university"]', '["amenity"="training"]', '["office"="educational_institution"]'];
    }

    // Professional Services / IT / Corporate Offices
    if (c.includes('services') || s.includes('software') || s.includes('company') || s.includes('office') || s.includes('agency')) {
      return ['["office"="it"]', '["office"="company"]', '["office"="consulting"]', '["office"]'];
    }

    // Automotive
    if (c.includes('automotive') || s.includes('car') || s.includes('bike') || s.includes('repair')) {
      return ['["shop"="car"]', '["shop"="car_repair"]', '["shop"="motorcycle"]', '["amenity"="fuel"]'];
    }

    // Default: query amenities, shops, hotels, and offices
    return ['["amenity"]', '["shop"]', '["tourism"="hotel"]', '["office"]'];
  }
}
