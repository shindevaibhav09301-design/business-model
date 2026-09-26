import { BusinessRecord, ConfidenceLevel, FieldProvenance, VerificationStatus } from '@/types';

export class ConfidenceScorer {
  public static calculate(
    record: Partial<BusinessRecord>,
    provenanceMap: Record<string, FieldProvenance>
  ): {
    overallConfidence: number;
    confidenceLevel: ConfidenceLevel;
    verificationStatus: VerificationStatus;
  } {
    const keys = Object.keys(provenanceMap);
    if (keys.length === 0) {
      return {
        overallConfidence: 40,
        confidenceLevel: 'Low',
        verificationStatus: 'Unverified',
      };
    }

    // Weighted field importance:
    // phone (25%), address (25%), website (20%), name/category (15%), offerings/hours (15%)
    let totalScore = 0;
    let totalWeight = 0;

    const weights: Record<string, number> = {
      phone: 25,
      address: 25,
      website: 20,
      category: 15,
      courses: 15,
      services: 15,
      email: 10,
    };

    for (const [field, prov] of Object.entries(provenanceMap)) {
      const weight = weights[field] || 10;
      totalScore += (prov.confidence || 60) * weight;
      totalWeight += weight;
    }

    const overallConfidence = Math.min(Math.round(totalScore / (totalWeight || 1)), 99);

    let confidenceLevel: ConfidenceLevel = 'Low';
    if (overallConfidence >= 90) {
      confidenceLevel = 'High';
    } else if (overallConfidence >= 70) {
      confidenceLevel = 'Medium';
    }

    let verificationStatus: VerificationStatus = 'Unverified';
    if (overallConfidence >= 90 && (record.website || (record.phone_numbers && record.phone_numbers.length > 0))) {
      verificationStatus = 'Verified';
    } else if (overallConfidence >= 65) {
      verificationStatus = 'Partially Verified';
    }

    return {
      overallConfidence,
      confidenceLevel,
      verificationStatus,
    };
  }
}
