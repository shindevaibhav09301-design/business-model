'use client';

import React, { useEffect, useState } from 'react';
import { BusinessRecord } from '@/types';
import { MapPin, ExternalLink, Phone, Globe, ShieldCheck } from 'lucide-react';

interface MapComponentProps {
  businesses: BusinessRecord[];
  onSelectBusiness: (biz: BusinessRecord) => void;
}

export default function MapComponent({ businesses, onSelectBusiness }: MapComponentProps) {
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    // Dynamically load Leaflet in client environment
    if (typeof window === 'undefined') return;

    let mapInstance: any = null;

    const initMap = async () => {
      const L = (await import('leaflet')).default;

      const mapContainer = document.getElementById('leaflet-map-root');
      if (!mapContainer) return;

      // Default center around Pune / Western India
      const validBusinesses = businesses.filter((b) => b.latitude && b.longitude);
      const defaultLat = validBusinesses.length > 0 ? validBusinesses[0].latitude! : 18.5204;
      const defaultLng = validBusinesses.length > 0 ? validBusinesses[0].longitude! : 73.8567;

      mapInstance = L.map('leaflet-map-root', {
        center: [defaultLat, defaultLng],
        zoom: 12,
        scrollWheelZoom: true,
      });

      // Dark theme map tiles from CartoDB Dark Matter
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a> & OpenStreetMap',
        maxZoom: 19,
      }).addTo(mapInstance);

      // Add pins for all businesses
      validBusinesses.forEach((biz) => {
        const markerColor =
          biz.business_category === 'Education'
            ? '#4f46e5' // indigo
            : biz.business_category === 'Healthcare'
            ? '#059669' // emerald
            : biz.business_category === 'Food'
            ? '#ea580c' // orange
            : biz.business_category === 'Retail'
            ? '#0891b2' // cyan
            : '#7c3aed'; // violet

        const customIcon = L.divIcon({
          className: 'custom-map-pin',
          html: `
            <div style="
              background-color: ${markerColor};
              width: 24px;
              height: 24px;
              border-radius: 50%;
              border: 2px solid #ffffff;
              box-shadow: 0 4px 10px rgba(0,0,0,0.5);
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: bold;
              font-size: 11px;
            ">
              ${biz.business_name.charAt(0)}
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        const marker = L.marker([biz.latitude!, biz.longitude!], { icon: customIcon }).addTo(mapInstance);

        const popupContent = `
          <div style="font-family: sans-serif; min-width: 180px; padding: 4px;">
            <div style="font-size: 10px; color: #818cf8; font-weight: bold; text-transform: uppercase;">
              ${biz.business_category} &bull; ${biz.business_subcategory}
            </div>
            <div style="font-size: 13px; font-weight: bold; color: #ffffff; margin-top: 2px;">
              ${biz.business_name}
            </div>
            <div style="font-size: 11px; color: #94a3b8; margin-top: 4px;">
              📍 ${biz.address}
            </div>
            <div style="margin-top: 8px; font-size: 10px; color: #34d399; font-weight: bold;">
              Confidence: ${biz.data_confidence}% (${biz.verification_status})
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);
        marker.on('click', () => {
          onSelectBusiness(biz);
        });
      });

      setMapLoaded(true);
    };

    initMap();

    return () => {
      if (mapInstance) {
        mapInstance.remove();
      }
    };
  }, [businesses]);

  return (
    <div className="relative w-full h-[650px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
      <div id="leaflet-map-root" className="w-full h-full" />
      {!mapLoaded && (
        <div className="absolute inset-0 bg-slate-950/80 flex items-center justify-center text-sm text-slate-400">
          Loading geospatial intelligence map...
        </div>
      )}
    </div>
  );
}
