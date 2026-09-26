import { CrawlOptions, CrawlResult, IWebsiteCrawler } from '../providers/types';

export class SafeWebsiteCrawler implements IWebsiteCrawler {
  public async crawl(url: string, options?: CrawlOptions): Promise<CrawlResult | null> {
    if (!url || !url.startsWith('http')) return null;

    const maxPages = options?.maxPages || 3;
    const timeoutMs = options?.timeoutMs || 6000;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      // Perform polite HEAD / GET on homepage
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'User-Agent': 'LocalIntelligenceFinder/1.0 (+https://localintelligence.app/bot; polite directory verification)',
          Accept: 'text/html,application/xhtml+xml',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        return null;
      }

      const html = await response.text();

      // Extract title
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      const title = titleMatch ? titleMatch[1].trim() : 'Official Web Portal';

      // Extract meta description
      const metaMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
      const metaDescription = metaMatch ? metaMatch[1].trim() : undefined;

      // Extract phone numbers (Indian formats +91, 10-digits, STD codes)
      const phoneRegex = /(?:\+91[\s-]?)?(?:0\d{2,4}[\s-]?)?[6-9]\d{9}|(?:\+91[\s-]?)?\d{2,4}[\s-]?\d{6,8}/g;
      const rawPhones = html.match(phoneRegex) || [];
      const phones = Array.from(new Set(rawPhones.map((p) => p.trim()).filter((p) => p.length >= 8 && p.length <= 16))).slice(0, 3);

      // Extract email addresses
      const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
      const rawEmails = html.match(emailRegex) || [];
      const emails = Array.from(
        new Set(
          rawEmails
            .map((e) => e.toLowerCase())
            .filter((e) => !e.endsWith('.png') && !e.endsWith('.jpg') && !e.includes('schema.org') && !e.includes('example.com'))
        )
      ).slice(0, 3);

      // Extract social profiles
      const socialLinks: Record<string, string> = {};
      const fbMatch = html.match(/href=["'](https?:\/\/(?:www\.)?facebook\.com\/[^"'\s]+)["']/i);
      if (fbMatch) socialLinks.facebook = fbMatch[1];
      const instaMatch = html.match(/href=["'](https?:\/\/(?:www\.)?instagram\.com\/[^"'\s]+)["']/i);
      if (instaMatch) socialLinks.instagram = instaMatch[1];
      const inMatch = html.match(/href=["'](https?:\/\/(?:www\.)?linkedin\.com\/(?:company|school)\/[^"'\s]+)["']/i);
      if (inMatch) socialLinks.linkedin = inMatch[1];
      const ytMatch = html.match(/href=["'](https?:\/\/(?:www\.)?youtube\.com\/[^"'\s]+)["']/i);
      if (ytMatch) socialLinks.youtube = ytMatch[1];

      // Page indicators
      const hasAbout = /href=["'][^"']*(?:about|who-we-are|profile)[^"']*["']/i.test(html);
      const hasContact = /href=["'][^"']*(?:contact|reach-us|location)[^"']*["']/i.test(html);
      const isMobileFriendly = /<meta[^>]*name=["']viewport["']/i.test(html);

      // Lightweight content hash (FNV-1a 32-bit hex)
      let hash = 2166136261;
      const strippedText = html.replace(/<[^>]+>/g, ' ').slice(0, 4000);
      for (let i = 0; i < strippedText.length; i++) {
        hash ^= strippedText.charCodeAt(i);
        hash = Math.imul(hash, 16777619);
      }
      const contentHash = (hash >>> 0).toString(16);

      return {
        url,
        pagesCrawled: 1,
        title,
        metaDescription,
        bodyTextSnippet: strippedText.slice(0, 600),
        phonesFound: phones,
        emailsFound: emails,
        socialLinks,
        coursesFound: [],
        servicesFound: [],
        hasAboutPage: hasAbout,
        hasContactPage: hasContact,
        contentHash,
        isMobileFriendly,
      };
    } catch (e) {
      return null;
    }
  }
}
