import { IBusinessDiscoveryProvider, RawBusinessResult, SearchParams } from './types';

export class GooglePlacesProvider implements IBusinessDiscoveryProvider {
  public name = 'Google Places API';
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.GOOGLE_MAPS_API_KEY || '';
  }

  public isConfigured(): boolean {
    return Boolean(this.apiKey && this.apiKey.trim().length > 10);
  }

  public async searchBusinesses(params: SearchParams): Promise<RawBusinessResult[]> {
    if (!this.isConfigured()) return [];

    const query = `${params.subcategory || params.category || 'business'} in ${params.city}`;
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${this.apiKey}`;

    try {
      const response = await fetch(url);
      if (!response.ok) return [];

      const data = await response.json();
      if (!data.results || !Array.isArray(data.results)) return [];

      return data.results.slice(0, 15).map((place: any) => ({
        id: `google-${place.place_id}`,
        name: place.name,
        category: params.category || 'Commercial',
        subcategory: params.subcategory || (place.types && place.types[0]) || 'Business',
        address: place.formatted_address || `${params.city}, India`,
        city: params.city,
        latitude: place.geometry?.location?.lat,
        longitude: place.geometry?.location?.lng,
        rating: place.rating,
        reviewCount: place.user_ratings_total || 0,
        source: 'Google Places',
        sourceUrl: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
        placeId: place.place_id,
        isMock: false,
      }));
    } catch (err) {
      return [];
    }
  }
}
