import { BusinessRecord, DuplicateMergeCandidate } from '@/types';

export interface DuplicateCheckResult {
  isDuplicate: boolean;
  score: number; // 0 to 100
  matchedWith?: BusinessRecord;
  reasons: string[];
}

export class EntityResolver {
  /**
   * Compare candidate against an array of existing business records
   */
  public static evaluate(
    candidate: Partial<BusinessRecord>,
    existingBusinesses: BusinessRecord[]
  ): DuplicateCheckResult {
    let highestScore = 0;
    let bestMatch: BusinessRecord | undefined = undefined;
    let bestReasons: string[] = [];

    for (const existing of existingBusinesses) {
      const { score, reasons } = this.calculateSimilarity(candidate, existing);
      if (score > highestScore) {
        highestScore = score;
        bestMatch = existing;
        bestReasons = reasons;
      }
    }

    return {
      isDuplicate: highestScore >= 85,
      score: highestScore,
      matchedWith: bestMatch,
      reasons: bestReasons,
    };
  }

  /**
   * Multi-factor similarity scoring (Name 40%, Phone 25%, Domain 20%, Geo 15%)
   */
  public static calculateSimilarity(
    a: Partial<BusinessRecord>,
    b: BusinessRecord
  ): { score: number; reasons: string[] } {
    const reasons: string[] = [];
    let weightedScore = 0;

    // 1. Phone match (exact match gives very strong weight)
    const phonesA = a.phone_numbers || [];
    const phonesB = b.phone_numbers || [];
    const cleanPhonesA = phonesA.map((p) => p.replace(/\D/g, '').slice(-10));
    const cleanPhonesB = phonesB.map((p) => p.replace(/\D/g, '').slice(-10));

    const commonPhone = cleanPhonesA.some((p) => p.length >= 10 && cleanPhonesB.includes(p));
    if (commonPhone) {
      weightedScore += 30;
      reasons.push('Exact 10-digit phone number match');
    }

    // 2. Official Website Domain Match
    if (a.website && b.website) {
      try {
        const domA = new URL(a.website.startsWith('http') ? a.website : `https://${a.website}`).hostname.replace(/^www\./, '').toLowerCase();
        const domB = new URL(b.website.startsWith('http') ? b.website : `https://${b.website}`).hostname.replace(/^www\./, '').toLowerCase();
        if (domA === domB) {
          weightedScore += 25;
          reasons.push(`Identical domain: ${domA}`);
        }
      } catch (e) {
        // Ignore domain parsing failure
      }
    }

    // 3. Name Similarity (Token Set & Levenshtein)
    const nameA = (a.business_name || '').toLowerCase().trim();
    const nameB = (b.business_name || '').toLowerCase().trim();

    if (nameA === nameB) {
      weightedScore += 35;
      reasons.push('Identical business name');
    } else {
      const nameSim = this.stringSimilarity(nameA, nameB);
      if (nameSim >= 0.8) {
        weightedScore += Math.round(nameSim * 35);
        reasons.push(`High name similarity (${Math.round(nameSim * 100)}%)`);
      } else if (nameSim >= 0.6) {
        weightedScore += Math.round(nameSim * 20);
        reasons.push(`Moderate name similarity (${Math.round(nameSim * 100)}%)`);
      }
    }

    // 4. Geographic Proximity (< 250 meters)
    if (a.latitude && a.longitude && b.latitude && b.longitude) {
      const distanceMeters = this.haversineDistance(a.latitude, a.longitude, b.latitude, b.longitude);
      if (distanceMeters < 150) {
        weightedScore += 15;
        reasons.push(`Co-located geographic coordinates (${Math.round(distanceMeters)}m)`);
      } else if (distanceMeters < 500) {
        weightedScore += 8;
        reasons.push(`Immediate neighborhood proximity (${Math.round(distanceMeters)}m)`);
      }
    }

    return {
      score: Math.min(weightedScore, 100),
      reasons,
    };
  }

  private static stringSimilarity(str1: string, str2: string): number {
    const s1 = str1.replace(/[^a-z0-9]/g, '');
    const s2 = str2.replace(/[^a-z0-9]/g, '');
    if (s1 === s2) return 1.0;
    if (s1.length < 2 || s2.length < 2) return 0.0;

    const longer = s1.length > s2.length ? s1 : s2;
    const shorter = s1.length > s2.length ? s2 : s1;

    // Check token inclusion
    if (longer.includes(shorter)) {
      return shorter.length / longer.length;
    }

    // Levenshtein distance calculation
    const costs: number[] = [];
    for (let i = 0; i <= s1.length; i++) {
      let lastValue = i;
      for (let j = 0; j <= s2.length; j++) {
        if (i === 0) {
          costs[j] = j;
        } else if (j > 0) {
          let newValue = costs[j - 1];
          if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
          }
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
      if (i > 0) costs[s2.length] = lastValue;
    }

    return (longer.length - costs[s2.length]) / longer.length;
  }

  private static haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Earth radius in metres
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }
}
