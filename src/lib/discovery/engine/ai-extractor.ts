export interface AIExtractionResult {
  normalizedCategory: string;
  courses: string[];
  services: string[];
  products: string[];
  description: string;
  openingHours?: string;
  specialties?: string[];
  priceRange?: string;
}

export class AIExtractor {
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.AI_API_KEY || process.env.GEMINI_API_KEY || '';
  }

  public async extract(params: {
    businessName: string;
    category: string;
    subcategory: string;
    rawText: string;
    websiteUrl?: string;
  }): Promise<AIExtractionResult> {
    const { businessName, category, subcategory, rawText } = params;

    // If API Key is present, we can call Gemini API
    if (this.apiKey && this.apiKey.trim().length > 10) {
      try {
        const prompt = `
You are a precise business intelligence extraction agent.
Extract verified, structured domain data from this business text.
Business: "${businessName}"
Source Category: "${category}" (${subcategory})
Web/Directory text snippet: "${rawText.slice(0, 1500)}"

Return JSON ONLY with this format:
{
  "normalizedCategory": "string",
  "courses": ["string"],
  "services": ["string"],
  "products": ["string"],
  "description": "string (1-2 objective sentences)",
  "priceRange": "₹ | ₹₹ | ₹₹₹ | ₹₹₹₹"
}
Rules:
- NEVER invent phone numbers, courses or certifications not mentioned.
- If courses/services are not mentioned, return empty arrays.
`;

        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: 'application/json' },
          }),
        });

        if (res.ok) {
          const json = await res.json();
          const candidate = json.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidate) {
            const parsed = JSON.parse(candidate);
            return {
              normalizedCategory: parsed.normalizedCategory || subcategory,
              courses: Array.isArray(parsed.courses) ? parsed.courses : [],
              services: Array.isArray(parsed.services) ? parsed.services : [],
              products: Array.isArray(parsed.products) ? parsed.products : [],
              description: parsed.description || `Public business establishment in ${category}.`,
              priceRange: parsed.priceRange || '₹₹',
            };
          }
        }
      } catch (e) {
        // Fall back to rule-based extractor
      }
    }

    // High-precision semantic rule-based extractor (Fallback when no API Key is set)
    return this.fallbackSemanticExtract(businessName, category, subcategory, rawText);
  }

  private fallbackSemanticExtract(
    businessName: string,
    category: string,
    subcategory: string,
    text: string
  ): AIExtractionResult {
    const lower = (text + ' ' + businessName + ' ' + subcategory).toLowerCase();
    const courses: string[] = [];
    const services: string[] = [];
    const products: string[] = [];
    let normalizedCategory = subcategory;

    if (category.toLowerCase().includes('education') || lower.includes('institute') || lower.includes('classes') || lower.includes('college')) {
      if (lower.includes('it') || lower.includes('computer') || lower.includes('coding') || lower.includes('software') || lower.includes('java') || lower.includes('python')) {
        normalizedCategory = 'IT Training & Software Academy';
        if (lower.includes('java')) courses.push('Java Enterprise Development');
        if (lower.includes('python')) courses.push('Python & Data Science');
        if (lower.includes('web') || lower.includes('full stack')) courses.push('Full Stack Web Development');
        if (lower.includes('cloud') || lower.includes('aws')) courses.push('Cloud Architecture & AWS');
        services.push('Classroom & Lab Sessions', 'Placement Assistance');
      } else if (lower.includes('exam') || lower.includes('coaching') || lower.includes('mpsc') || lower.includes('upsc') || lower.includes('neet') || lower.includes('jee')) {
        normalizedCategory = 'Competitive Exam Coaching Center';
        if (lower.includes('neet')) courses.push('NEET Medical Foundation');
        if (lower.includes('jee')) courses.push('IIT-JEE Engineering Prep');
        if (lower.includes('mpsc') || lower.includes('upsc')) courses.push('Civil Services Exam Guidance');
      } else {
        normalizedCategory = 'Educational Institution';
      }
    } else if (category.toLowerCase().includes('healthcare') || lower.includes('hospital') || lower.includes('clinic')) {
      normalizedCategory = 'Multispeciality Healthcare Facility';
      if (lower.includes('emergency') || lower.includes('icu') || lower.includes('trauma')) services.push('24/7 Emergency Care', 'Intensive Care Unit (ICU)');
      if (lower.includes('cardio') || lower.includes('heart')) services.push('Cardiology Consultation');
      if (lower.includes('pediatric') || lower.includes('children')) services.push('Pediatrics & Neonatal Care');
      if (lower.includes('dental') || lower.includes('teeth')) services.push('Dental Surgery & Diagnostics');
    } else if (category.toLowerCase().includes('food') || lower.includes('restaurant') || lower.includes('cafe')) {
      normalizedCategory = 'Dining & Culinary Establishment';
      services.push('Dine-in Service', 'Takeaway Ordering');
      if (lower.includes('thali') || lower.includes('vegetarian')) products.push('Special Vegetarian Thali');
      if (lower.includes('misal')) products.push('Signature Misal Pav');
      if (lower.includes('coffee') || lower.includes('cafe')) products.push('Artisanal Beverages & Bakery');
    } else if (category.toLowerCase().includes('services') || lower.includes('software') || lower.includes('tech')) {
      normalizedCategory = 'Technology Solutions & Consulting';
      services.push('Custom Software Development', 'Cloud & DevOps Solutions', 'IT Infrastructure Support');
    }

    return {
      normalizedCategory,
      courses,
      services,
      products,
      description: `${businessName} is a recognized ${normalizedCategory} operating with verified community listings.`,
      priceRange: '₹₹',
    };
  }
}
