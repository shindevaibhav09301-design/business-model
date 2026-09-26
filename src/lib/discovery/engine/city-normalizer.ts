import { NormalizedCity } from '@/types';
import { BENCHMARK_CITIES } from '@/lib/data/seed-cities';
import { findMaharashtraDistrict } from '@/lib/data/india-districts';

export interface CityResolveResult {
  normalized: NormalizedCity;
  confidence: number;
  disambiguation?: string;
  isAmbiguous: boolean;
}

export class CityNormalizer {
  public static async resolve(input: string): Promise<CityResolveResult> {
    const raw = input.trim().toLowerCase();

    // 1. Direct Maharashtra District Registry Lookup (All 36 districts)
    const districtMatch = findMaharashtraDistrict(input);
    if (districtMatch) {
      return {
        normalized: districtMatch,
        confidence: 0.99,
        disambiguation: districtMatch.formatted,
        isAmbiguous: false,
      };
    }

    // 2. Direct benchmark dictionary match
    for (const city of BENCHMARK_CITIES) {
      if (
        city.city.toLowerCase() === raw ||
        city.aliases.some((a) => a.toLowerCase() === raw) ||
        raw.includes(city.city.toLowerCase()) ||
        city.formatted.toLowerCase().includes(raw)
      ) {
        return {
          normalized: city,
          confidence: 0.98,
          disambiguation: city.formatted,
          isAmbiguous: false,
        };
      }
    }

    // 3. Fallback to OpenStreetMap Nominatim Geocoder scoped to Maharashtra
    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        input + ', Maharashtra, India'
      )}&format=json&addressdetails=1&limit=3`;

      const res = await fetch(url, {
        headers: {
          'User-Agent': 'LocalIntelligenceFinder/1.0 (City Normalizer)',
        },
      });

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const top = data[0];
          const address = top.address || {};
          const cityName = address.city || address.town || address.village || address.state_district || address.county || top.name;
          const stateName = address.state || address.region || 'Maharashtra';
          const countryName = address.country || 'India';
          const countryCode = (address.country_code || 'in').toUpperCase();

          const formatted = `${cityName}, ${stateName}, ${countryName}`;
          const isAmbiguous = data.length > 1;

          return {
            normalized: {
              city: cityName,
              state: stateName,
              country: countryName,
              country_code: countryCode,
              latitude: parseFloat(top.lat),
              longitude: parseFloat(top.lon),
              aliases: [raw],
              formatted,
            },
            confidence: 0.92,
            disambiguation: isAmbiguous ? `Did you mean ${formatted}?` : undefined,
            isAmbiguous,
          };
        }
      }
    } catch (e) {
      // Ignore network geocode error and fallback
    }

    // 4. Fallback capitalized guess scoped to Maharashtra
    const capitalized = input.charAt(0).toUpperCase() + input.slice(1);
    return {
      normalized: {
        city: capitalized,
        state: 'Maharashtra',
        country: 'India',
        country_code: 'IN',
        latitude: 19.7515,
        longitude: 75.7139,
        aliases: [raw],
        formatted: `${capitalized}, Maharashtra, India`,
      },
      confidence: 0.65,
      isAmbiguous: false,
    };
  }
}
