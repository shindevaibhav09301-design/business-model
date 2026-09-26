import { WebsiteResult, WebsiteSearchParams } from '../providers/types';

export class WebsiteVerifier {
  public static async discoverAndVerify(params: WebsiteSearchParams, existingUrl?: string): Promise<WebsiteResult> {
    const { businessName, city, address } = params;

    // If URL already provided by provider
    if (existingUrl && existingUrl.trim()) {
      let cleanUrl = existingUrl.trim();
      if (!cleanUrl.startsWith('http')) {
        cleanUrl = `https://${cleanUrl}`;
      }

      // Check URL domain correlation with business name
      try {
        const domain = new URL(cleanUrl).hostname.replace(/^www\./, '').toLowerCase();
        const cleanName = businessName.toLowerCase().replace(/[^a-z0-9]/g, '');
        const domainTokens = domain.split('.')[0].replace(/[^a-z0-9]/g, '');

        let score = 0.85;
        const reasons: string[] = ['Provided directly by mapping data provider'];

        if (cleanName.includes(domainTokens) || domainTokens.includes(cleanName.slice(0, 8))) {
          score += 0.12;
          reasons.push('Domain string strongly correlates with organization name');
        }

        if (domain.endsWith('.edu') || domain.endsWith('.ac.in') || domain.endsWith('.edu.in')) {
          score = 0.99;
          reasons.push('Accredited academic domain extension verified');
        } else if (domain.endsWith('.gov.in') || domain.endsWith('.org.in')) {
          score = 0.99;
          reasons.push('Government/organization registered domain verified');
        }

        return {
          url: cleanUrl,
          confidence: Math.min(score, 0.99),
          isOfficial: score >= 0.8,
          matchReasons: reasons,
        };
      } catch (e) {
        // Invalid URL format
      }
    }

    // Heuristic website search candidate generation
    // Check if domain is likely to exist for major branded institutes/companies
    const slug = businessName
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(' ')
      .filter((w) => !['institute', 'hospital', 'company', 'shop', 'pvt', 'ltd', 'center', 'academy'].includes(w))
      .slice(0, 3)
      .join('');

    if (slug.length >= 4) {
      // In production, this issues a query to compliant Search Provider (e.g. Bing Web Search, Google Custom Search)
      // For safe demonstration without external search API billing:
      const candidateUrl = `https://${slug}-${city.toLowerCase()}.in`;
      return {
        url: null, // Do not hallucinate URLs! Strictly null if unconfirmed
        confidence: 0.0,
        isOfficial: false,
        matchReasons: ['No official website confirmed from configured public search sources'],
      };
    }

    return {
      url: null,
      confidence: 0.0,
      isOfficial: false,
      matchReasons: ['No official website identified'],
    };
  }
}
