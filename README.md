# Local Intelligence Finder (FINDER SAAS)

> Modern, AI-powered local business, educational institute, hospital, shop, service, and job intelligence discovery platform for Maharashtra districts.

---

## 🌟 Key Features

- **Local Intelligence Directory**: Filter by district/city, domain category, website availability, verification status, business type, and verification score.
- **Dynamic Real-Time Statistics**: Dynamic counters for total establishments, educational institutes, website verified entities, and fully verified businesses.
- **Detailed Business Dossier Modal**: Comprehensive inspection with tabs for Overview & Profile, Courses & Offerings, Contact & Location, Source Provenance, and Website DNS & SSL Audit.
- **Autonomous City Discovery Pipeline**: Real-time 6-stage extraction engine discovering local businesses across OpenStreetMap, web registries, and directories with phone number enrichment.
- **Educational Institutes Hub (`/institutes`)**: Dedicated portal tracking courses (AI, Data Science, Python, Java Developer, MPSC, etc.), accreditation, and reach.
- **Web Opportunity Radar (`/websites`)**: Lead generation portal highlighting high-intent establishments operating without official websites.
- **Local Careers & Tasks (`/jobs`)**: Local vacancies linked directly to discovered hospitals, institutes, and companies alongside background crawler monitoring.
- **Geospatial Map Canvas (`/map`)**: Interactive Leaflet map with location clustering and preview cards.
- **SaaS Analytics Dashboard (`/analytics`)**: Market metrics, category distributions, city breakdowns, and verification ratios with date filters.
- **Export Engine (`/export`)**: Universal export into CSV, Excel, JSON, and printable PDF with custom column selection.
- **Admin Control Panel (`/admin`)**: Governance for entity verification, review queue, API key management, and system logs.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (Custom Dark SaaS Design System)
- **Icons**: Lucide React
- **Maps**: Leaflet & React-Leaflet
- **Data Engine**: High-performance in-memory store with multi-provider discovery pipeline

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
src/
├── app/                  # Next.js App Router pages & API routes
│   ├── admin/            # SaaS Admin Panel
│   ├── analytics/        # Performance & Analytics Dashboard
│   ├── api/              # RESTful API endpoints
│   ├── businesses/       # Main Directory UI
│   ├── institutes/       # Dedicated Institutes Portal
│   ├── jobs/             # Local Jobs & Crawler Tasks
│   ├── map/              # Geospatial Map View
│   ├── websites/         # No Website Opportunity Radar
│   └── export/           # Universal Data Export
├── components/           # Reusable UI components
├── lib/
│   ├── data/             # Taxonomies & showcase datasets
│   ├── discovery/        # Autonomous discovery engine & providers
│   └── storage/          # In-memory store & persistence
└── types/                # TypeScript type definitions
```
