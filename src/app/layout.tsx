import type { Metadata } from 'next';
import './globals.css';
import AppShell from '@/components/layout/AppShell';

export const metadata: Metadata = {
  title: 'Local Intelligence Finder | AI-Powered Business Discovery & Intelligence',
  description: 'Enterprise AI SaaS for local business discovery, verification, lead management, and geospatial intelligence across districts.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className="min-h-screen bg-[#050816] text-slate-100 antialiased selection:bg-purple-600 selection:text-white">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
