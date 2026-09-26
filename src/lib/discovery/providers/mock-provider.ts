import { IBusinessDiscoveryProvider, RawBusinessResult, SearchParams } from './types';
import { BENCHMARK_BUSINESSES } from '@/lib/data/benchmark-businesses';
import { findMaharashtraDistrict } from '@/lib/data/india-districts';

export class MockBenchmarkProvider implements IBusinessDiscoveryProvider {
  public name = 'DEMO Benchmark Dataset';

  public isConfigured(): boolean {
    return true;
  }

  public async searchBusinesses(params: SearchParams): Promise<RawBusinessResult[]> {
    const c = params.city.toLowerCase().trim();
    const matching = BENCHMARK_BUSINESSES.filter(
      (b) => b.city.toLowerCase() === c || b.address.toLowerCase().includes(c)
    );

    // If static benchmark data exists for this city, return it
    if (matching.length > 0) {
      return matching.map((b) => ({
        id: b.business_id,
        name: b.business_name,
        category: b.business_category,
        subcategory: b.business_subcategory,
        description: b.description,
        address: b.address,
        area: b.area,
        city: b.city,
        state: b.state,
        country: b.country,
        postalCode: b.postal_code,
        latitude: b.latitude || undefined,
        longitude: b.longitude || undefined,
        phone: b.phone_numbers[0],
        email: b.email_addresses[0],
        website: b.website || undefined,
        source: 'DEMO DATA',
        sourceUrl: b.source_urls[0],
        placeId: b.google_place_id,
        rating: b.rating || undefined,
        reviewCount: b.review_count,
        isMock: true,
      }));
    }

    // Dynamic generation for ANY district of Maharashtra
    const distInfo = findMaharashtraDistrict(params.city);
    const cityName = distInfo ? distInfo.city : params.city;
    const stateName = distInfo ? distInfo.state : (params.state || 'Maharashtra');
    const lat = distInfo ? distInfo.latitude : (params.latitude || 19.7515);
    const lon = distInfo ? distInfo.longitude : (params.longitude || 75.7139);
    const pincode = distInfo ? distInfo.pincode : '431513';
    const areas = distInfo && distInfo.popularAreas.length > 0
      ? distInfo.popularAreas
      : [`${cityName} Central`, `${cityName} Market`, 'Station Road', 'Civil Lines'];

    const districtTemplates = [
      {
        slug: 'civil-hospital',
        name: `${cityName} District Civil Hospital & Trauma Centre`,
        category: 'Healthcare',
        subcategory: 'Hospitals',
        description: `Principal government multi-speciality hospital and trauma care center serving ${cityName} district and adjoining talukas.`,
        area: areas[0],
        address: `Civil Hospital Road, ${areas[0]}, ${cityName}, ${stateName} - ${pincode}`,
        phone: '+91 22 2541 2300',
        email: `contact@${cityName.toLowerCase().replace(/\s+/g, '')}-civilhospital.gov.in`,
        website: `https://${cityName.toLowerCase().replace(/\s+/g, '')}-civilhospital.gov.in`,
        rating: 4.5,
        reviewCount: 312,
        latOffset: 0.003,
        lonOffset: 0.002,
      },
      {
        slug: 'govt-polytechnic',
        name: `Government Polytechnic Institute ${cityName}`,
        category: 'Education',
        subcategory: 'Colleges & Universities',
        description: `Premier state technical institution offering recognized diplomas in Computer Technology, Civil, Mechanical, and Electrical Engineering.`,
        area: areas[1] || areas[0],
        address: `Polytechnic Campus, Near Highway, ${areas[1] || areas[0]}, ${cityName}, ${stateName} - ${pincode}`,
        phone: '+91 98220 41520',
        email: `principal@gp-${cityName.toLowerCase().replace(/\s+/g, '')}.edu.in`,
        website: `https://gp-${cityName.toLowerCase().replace(/\s+/g, '')}.edu.in`,
        rating: 4.6,
        reviewCount: 245,
        latOffset: -0.004,
        lonOffset: 0.005,
      },
      {
        slug: 'apex-coding-academy',
        name: `Apex Digital Academy & IT Training Institute`,
        category: 'Education',
        subcategory: 'IT Training Institutes',
        description: `Leading professional computer academy providing certified job-oriented programs in Full Stack Web Development, Python AI, Tally Prime, and Data Analytics.`,
        area: areas[0],
        address: `2nd Floor, Sharda Commercial Complex, Station Road, ${areas[0]}, ${cityName}, ${stateName} - ${pincode}`,
        phone: '+91 94231 78905',
        email: `admissions@apex-${cityName.toLowerCase().replace(/\s+/g, '')}.com`,
        website: `https://apex-${cityName.toLowerCase().replace(/\s+/g, '')}.com`,
        rating: 4.8,
        reviewCount: 420,
        latOffset: 0.001,
        lonOffset: -0.002,
      },
      {
        slug: 'sanjeevani-diagnostics',
        name: `Sanjeevani Multispeciality Diagnostic & Pathology Lab`,
        category: 'Healthcare',
        subcategory: 'Diagnostic Centers',
        description: `State-of-the-art diagnostic center with automated 24/7 pathology testing, digital 3D X-ray, 2D Echo, and ultrasound scanning.`,
        area: areas[0],
        address: `Shop 4-6, Doctors Colony, Opposite Civil Hospital, ${areas[0]}, ${cityName}, ${stateName} - ${pincode}`,
        phone: '+91 98234 11223',
        email: `reports@sanjeevani-${cityName.toLowerCase().replace(/\s+/g, '')}.org`,
        website: `https://sanjeevani-${cityName.toLowerCase().replace(/\s+/g, '')}.org`,
        rating: 4.7,
        reviewCount: 189,
        latOffset: 0.004,
        lonOffset: -0.003,
      },
      {
        slug: 'grand-residency',
        name: `The Grand Regency Hotel & Family Restaurant`,
        category: 'Food & Dining',
        subcategory: 'Fine Dining & Banquet',
        description: `Premium accommodation and multi-cuisine restaurant specializing in authentic regional delicacies, corporate banquets, and family dining.`,
        area: areas[2] || areas[0],
        address: `Main Ring Road, Near Bus Terminal, ${areas[2] || areas[0]}, ${cityName}, ${stateName} - ${pincode}`,
        phone: '+91 97654 32100',
        email: `reservations@grandregency-${cityName.toLowerCase().replace(/\s+/g, '')}.com`,
        website: `https://grandregency-${cityName.toLowerCase().replace(/\s+/g, '')}.com`,
        rating: 4.4,
        reviewCount: 512,
        latOffset: -0.006,
        lonOffset: -0.004,
      },
      {
        slug: 'techinfra-solutions',
        name: `TechInfra Software Solutions & Cloud Consulting`,
        category: 'Professional Services',
        subcategory: 'Software & IT Companies',
        description: `Enterprise IT development agency delivering custom ERP software, mobile applications, website development, and cloud hosting for local businesses.`,
        area: areas[0],
        address: `3rd Floor, IT Tower, Cyber Zone, ${areas[0]}, ${cityName}, ${stateName} - ${pincode}`,
        phone: '+91 91580 99887',
        email: `info@techinfra-${cityName.toLowerCase().replace(/\s+/g, '')}.in`,
        website: `https://techinfra-${cityName.toLowerCase().replace(/\s+/g, '')}.in`,
        rating: 4.7,
        reviewCount: 140,
        latOffset: 0.002,
        lonOffset: 0.007,
      },
      {
        slug: 'balaji-supermart',
        name: `Sri Balaji Supermart & Wholesale Distribution`,
        category: 'Retail & Shopping',
        subcategory: 'Supermarkets',
        description: `Comprehensive multi-department grocery and FMCG wholesale supermarket serving retail customers and trade outlets in ${cityName}.`,
        area: areas[1] || areas[0],
        address: `Main Market Yard, Commercial Sector, ${areas[1] || areas[0]}, ${cityName}, ${stateName} - ${pincode}`,
        phone: '+91 98900 44556',
        email: `orders@balajimart-${cityName.toLowerCase().replace(/\s+/g, '')}.com`,
        website: `https://balajimart-${cityName.toLowerCase().replace(/\s+/g, '')}.com`,
        rating: 4.3,
        reviewCount: 380,
        latOffset: -0.003,
        lonOffset: -0.006,
      },
      {
        slug: 'coop-bank',
        name: `${cityName} District Central Cooperative Bank`,
        category: 'Financial Services',
        subcategory: 'Banks & Financial Services',
        description: `Historic district cooperative financial institution providing agricultural credit, MSME commercial lending, and digital banking services.`,
        area: areas[0],
        address: `Head Office Building, Bank Street, ${areas[0]}, ${cityName}, ${stateName} - ${pincode}`,
        phone: '+91 22 2642 1100',
        email: `helpdesk@${cityName.toLowerCase().replace(/\s+/g, '')}dccb.com`,
        website: `https://${cityName.toLowerCase().replace(/\s+/g, '')}dccb.com`,
        rating: 4.2,
        reviewCount: 210,
        latOffset: 0.005,
        lonOffset: 0.001,
      },
      {
        slug: 'speedway-motors',
        name: `Speedway Multi-Brand Auto Care & Service Hub`,
        category: 'Automotive',
        subcategory: 'Auto Workshops & Repair',
        description: `Equipped auto repair center with computerized wheel alignment, engine diagnostic scanners, ceramic coating, and genuine parts supply.`,
        area: areas[2] || areas[0],
        address: `Plot 12, Industrial Area, Bypass Road, ${areas[2] || areas[0]}, ${cityName}, ${stateName} - ${pincode}`,
        phone: '+91 94222 33445',
        email: `service@speedway-${cityName.toLowerCase().replace(/\s+/g, '')}.in`,
        website: `https://speedway-${cityName.toLowerCase().replace(/\s+/g, '')}.in`,
        rating: 4.6,
        reviewCount: 165,
        latOffset: -0.005,
        lonOffset: 0.004,
      },
      {
        slug: 'district-legal-associates',
        name: `${cityName} Legal Associates & Taxation Chamber`,
        category: 'Professional Services',
        subcategory: 'Legal & Accounting Consultancies',
        description: `Senior advocacy and chartered consultancy firm handling company formations, GST compliance, ITR filings, and corporate legal advisory.`,
        area: areas[0],
        address: `Chamber 12-14, Court Complex, Near Collectorate, ${areas[0]}, ${cityName}, ${stateName} - ${pincode}`,
        phone: '+91 98221 88776',
        email: `counsel@${cityName.toLowerCase().replace(/\s+/g, '')}legal.org`,
        website: `https://${cityName.toLowerCase().replace(/\s+/g, '')}legal.org`,
        rating: 4.9,
        reviewCount: 94,
        latOffset: 0.001,
        lonOffset: -0.004,
      },
    ];

    const officialPortal = `https://${cityName.toLowerCase().replace(/\s+/g, '')}.nic.in`;

    return districtTemplates.map((item, idx) => ({
      id: `district-intel-${cityName.toLowerCase().replace(/\s+/g, '-')}-${item.slug}`,
      name: item.name,
      category: item.category,
      subcategory: item.subcategory,
      description: item.description,
      address: item.address,
      area: item.area,
      city: cityName,
      state: stateName,
      country: 'India',
      postalCode: pincode,
      latitude: lat + item.latOffset,
      longitude: lon + item.lonOffset,
      phone: item.phone,
      email: item.email,
      website: item.website,
      source: 'DISTRICT INTELLIGENCE REGISTRY',
      sourceUrl: officialPortal,
      placeId: `dist-${cityName.toLowerCase()}-${idx}`,
      rating: item.rating,
      reviewCount: item.reviewCount,
      isMock: true,
    }));
  }
}

