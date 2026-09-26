import { BusinessRecord, FieldProvenance } from '@/types';
import { appStore } from '@/lib/storage/store';

export interface EnrichmentResult {
  phone_numbers: string[];
  email_addresses: string[];
  address: string;
  road?: string;
  area?: string;
  postal_code?: string;
  website?: string;
  sourceUrl?: string;
  confidenceBoost: number;
}

export class ContactEnricher {
  /**
   * Cleans an address string to prevent repeated words (e.g. "Parbhani, Parbhani, Parbhani")
   */
  public static cleanAddressString(rawAddress: string, city: string, state: string): string {
    if (!rawAddress) return `${city}, ${state || 'India'}`;

    // Split by comma
    const rawTokens = rawAddress.split(',').map((t) => t.trim()).filter(Boolean);
    const seen = new Set<string>();
    const deduped: string[] = [];

    for (const token of rawTokens) {
      const lower = token.toLowerCase();
      // Only allow unique tokens (unless it's a specific street number)
      if (!seen.has(lower)) {
        seen.add(lower);
        deduped.push(token);
      }
    }

    // Ensure city is included
    if (!seen.has(city.toLowerCase())) {
      deduped.push(city);
      seen.add(city.toLowerCase());
    }

    // Ensure state is included if known
    if (state && !seen.has(state.toLowerCase())) {
      deduped.push(state);
      seen.add(state.toLowerCase());
    }

    return deduped.join(', ');
  }

  /**
   * Reverse-geocodes GPS coordinates using OpenStreetMap Nominatim
   * to discover exact street/road, locality, and postal code.
   */
  public static async reverseGeocode(
    lat: number,
    lon: number,
    city: string,
    state: string
  ): Promise<{ road?: string; area?: string; postal_code?: string; cleanAddress?: string } | null> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`;
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'LocalIntelligenceFinder/1.0 (Public Research Directory)',
          Accept: 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) return null;

      const data = await res.json();
      if (!data || !data.address) return null;

      const a = data.address;
      const road = a.road || a.pedestrian || a.street || a.neighbourhood || '';
      const suburb = a.suburb || a.residential || a.subdistrict || a.quarter || '';
      const postcode = a.postcode || '';
      const resolvedCity = a.city || a.town || a.village || city;
      const resolvedState = a.state || state;

      // Construct a clean, human-readable address with no repetitions
      const addressParts = [
        road,
        suburb,
        resolvedCity,
        postcode ? `PIN: ${postcode}` : '',
        resolvedState,
        'India',
      ].filter(Boolean);

      const cleanAddress = this.cleanAddressString(addressParts.join(', '), resolvedCity, resolvedState);

      return {
        road: road || undefined,
        area: suburb || road || city,
        postal_code: postcode || undefined,
        cleanAddress,
      };
    } catch {
      return null;
    }
  }

  /**
   * Searches public directories and search engines to find contact phone numbers,
   * official web portals, and street landmarks for an establishment.
   */
  public static async searchWebContacts(
    businessName: string,
    city: string,
    category?: string
  ): Promise<{ phones: string[]; emails: string[]; website?: string; sourceUrl?: string }> {
    const phones: string[] = [];
    const emails: string[] = [];
    let website: string | undefined = undefined;
    let sourceUrl: string | undefined = undefined;

    try {
      const query = encodeURIComponent(`"${businessName}" "${city}" contact phone`);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4500);

      const res = await fetch(`https://html.duckduckgo.com/html/?q=${query}`, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Accept: 'text/html,application/xhtml+xml',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const html = await res.text();

        // 1. Extract Indian Phone Numbers (Mobile 10-digit or STD Landline e.g. 02452-225818)
        const phoneRegex = /(?:\+91[\s-]?)?(?:0\d{2,4}[\s-]?)?[2-9]\d{5,7}|(?:\+91[\s-]?)?[6-9]\d{9}/g;
        const matches = html.match(phoneRegex) || [];

        for (const raw of matches) {
          const digits = raw.replace(/\D/g, '');
          // Exclude typical dates, years, lat/lon fragments
          if (
            digits.length >= 8 &&
            digits.length <= 13 &&
            !digits.startsWith('202') &&
            !digits.startsWith('192') &&
            !digits.startsWith('4314')
          ) {
            // Format phone nicely
            let formatted = raw.trim();
            if (!phones.includes(formatted)) {
              phones.push(formatted);
            }
          }
        }

        // 2. Extract Emails
        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
        const emailMatches = html.match(emailRegex) || [];
        for (const em of emailMatches) {
          const lower = em.toLowerCase();
          if (
            !lower.includes('duckduckgo') &&
            !lower.includes('example.com') &&
            !lower.includes('sentry.io') &&
            !lower.includes('schema.org') &&
            !emails.includes(lower)
          ) {
            emails.push(lower);
          }
        }

        // 3. Extract Links
        const urlMatches = html.match(/uddg=([^&"'>]+)/g) || [];
        const candidateUrls = urlMatches
          .map((m) => decodeURIComponent(m.replace('uddg=', '')))
          .filter(
            (u) =>
              !u.includes('duckduckgo') &&
              !u.includes('bing.com') &&
              !u.includes('google.com') &&
              !u.includes('wikipedia') &&
              !u.includes('facebook.com') &&
              !u.includes('instagram.com')
          );

        if (candidateUrls.length > 0) {
          sourceUrl = candidateUrls[0];
          // Check if top URL looks like an official website rather than generic aggregator
          const isOfficial =
            !candidateUrls[0].includes('justdial') &&
            !candidateUrls[0].includes('cybo') &&
            !candidateUrls[0].includes('yappe') &&
            !candidateUrls[0].includes('indiamart') &&
            !candidateUrls[0].includes('bharatibiz');

          if (isOfficial) {
            website = candidateUrls[0];
          }
        }
      }
    } catch {
      // Graceful fallback
    }

    return {
      phones: phones.slice(0, 3),
      emails: emails.slice(0, 2),
      website,
      sourceUrl,
    };
  }

  /**
   * Main enrichment orchestrator for a single BusinessRecord.
   */
  public static async enrichBusiness(business: BusinessRecord): Promise<BusinessRecord> {
    let updatedAddress = business.address;
    let updatedArea = business.area;
    let updatedPostalCode = business.postal_code;
    let updatedPhones = [...business.phone_numbers];
    let updatedEmails = [...business.email_addresses];
    let updatedWebsite = business.website;
    const fieldProvenance: Record<string, FieldProvenance> = { ...(business.field_provenance || {}) };
    const now = new Date().toISOString().split('T')[0];

    // 1. Reverse Geocode Coordinates if available and address is incomplete
    const isGenericAddress =
      !updatedAddress ||
      updatedAddress === business.city ||
      updatedAddress.split(',').length <= 2 ||
      updatedAddress.includes(`${business.city}, ${business.city}`);

    if (
      business.latitude &&
      business.longitude &&
      (isGenericAddress || !updatedPostalCode || updatedPostalCode === 'Not Available')
    ) {
      const geoResult = await this.reverseGeocode(
        business.latitude,
        business.longitude,
        business.city,
        business.state
      );

      if (geoResult) {
        if (geoResult.cleanAddress) {
          updatedAddress = geoResult.cleanAddress;
          fieldProvenance.address = {
            value: updatedAddress,
            source: 'OpenStreetMap Reverse Geocoding (Nominatim)',
            sourceUrl: `https://www.openstreetmap.org/?mlat=${business.latitude}&mlon=${business.longitude}#map=17/${business.latitude}/${business.longitude}`,
            confidence: 96,
            verifiedAt: now,
          };
        }
        if (geoResult.area) updatedArea = geoResult.area;
        if (geoResult.postal_code) {
          updatedPostalCode = geoResult.postal_code;
          fieldProvenance.postal_code = {
            value: updatedPostalCode,
            source: 'Postal Index Directory (OpenStreetMap)',
            confidence: 95,
            verifiedAt: now,
          };
        }
      }
    } else {
      // Clean existing address string anyway to eliminate duplicates
      updatedAddress = this.cleanAddressString(updatedAddress, business.city, business.state);
    }

    // 2. Search Web & Public Directories if phone numbers or website are missing
    if (updatedPhones.length === 0 || !updatedWebsite) {
      const webContacts = await this.searchWebContacts(
        business.business_name,
        business.city,
        business.business_category
      );

      if (webContacts.phones.length > 0 && updatedPhones.length === 0) {
        updatedPhones = webContacts.phones;
        fieldProvenance.phone = {
          value: updatedPhones[0],
          source: webContacts.sourceUrl
            ? `Public Directory (${new URL(webContacts.sourceUrl).hostname})`
            : 'Public Business Index',
          sourceUrl: webContacts.sourceUrl,
          confidence: 88,
          verifiedAt: now,
        };
      }

      if (webContacts.emails.length > 0 && updatedEmails.length === 0) {
        updatedEmails = webContacts.emails;
        fieldProvenance.email = {
          value: updatedEmails[0],
          source: webContacts.sourceUrl
            ? `Public Directory (${new URL(webContacts.sourceUrl).hostname})`
            : 'Public Business Index',
          sourceUrl: webContacts.sourceUrl,
          confidence: 85,
          verifiedAt: now,
        };
      }

      if (webContacts.website && !updatedWebsite) {
        updatedWebsite = webContacts.website;
        fieldProvenance.website = {
          value: updatedWebsite,
          source: 'Public Web Discovery',
          sourceUrl: updatedWebsite,
          confidence: 85,
          verifiedAt: now,
        };
      }
    }

    // Recalculate confidence
    const hasPhone = updatedPhones.length > 0;
    const hasAddress = updatedAddress && updatedAddress.length > 10;
    const hasWeb = !!updatedWebsite;
    let boost = 0;
    if (hasPhone) boost += 15;
    if (hasAddress) boost += 10;
    if (hasWeb) boost += 15;

    const newConfidence = Math.min(Math.max(business.data_confidence, 80) + boost, 98);
    const newVerification = hasPhone && hasAddress ? 'Verified' : 'Partially Verified';

    const updated: BusinessRecord = {
      ...business,
      address: updatedAddress,
      area: updatedArea,
      postal_code: updatedPostalCode,
      phone_numbers: updatedPhones,
      email_addresses: updatedEmails,
      website: updatedWebsite,
      official_website: updatedWebsite || business.official_website,
      website_status: updatedWebsite ? 'Verified' : business.website_status,
      field_provenance: fieldProvenance,
      data_confidence: newConfidence,
      confidence_level: newConfidence >= 85 ? 'High' : 'Medium',
      verification_status: newVerification,
      last_verified_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    appStore.updateBusiness(business.business_id, updated);
    return updated;
  }
}
