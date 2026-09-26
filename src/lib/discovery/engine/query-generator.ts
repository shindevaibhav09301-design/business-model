import { CategoryTaxonomy } from '@/types';

export interface GeneratedQuery {
  category: string;
  subcategory: string;
  query: string;
  type: 'general' | 'near' | 'website' | 'contact';
}

export class QueryGenerator {
  public static generate(cityName: string, taxonomy: CategoryTaxonomy[], selectedCategoryIds?: string[]): GeneratedQuery[] {
    const queries: GeneratedQuery[] = [];
    const activeCategories = selectedCategoryIds && selectedCategoryIds.length > 0
      ? taxonomy.filter((c) => selectedCategoryIds.includes(c.id))
      : taxonomy;

    for (const cat of activeCategories) {
      // Pick top subcategories for polite discovery
      const topSubs = cat.subcategories.slice(0, 4);

      for (const sub of topSubs) {
        queries.push({
          category: cat.name,
          subcategory: sub,
          query: `${sub} in ${cityName}`,
          type: 'general',
        });

        queries.push({
          category: cat.name,
          subcategory: sub,
          query: `${sub} near ${cityName}`,
          type: 'near',
        });

        queries.push({
          category: cat.name,
          subcategory: sub,
          query: `"${sub}" "${cityName}" website`,
          type: 'website',
        });
      }
    }

    return queries;
  }
}
