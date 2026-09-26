'use client';

import React, { useState, useEffect } from 'react';
import { Download, FileText, CheckSquare, Square, Filter, CheckCircle2, ArrowRight } from 'lucide-react';
import { DEFAULT_TAXONOMY } from '@/lib/data/categories';

export default function ExportPage() {
  const [format, setFormat] = useState<'csv' | 'json'>('csv');
  const [city, setCity] = useState('All');
  const [category, setCategory] = useState('All');
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const availableFields = [
    { id: 'business_name', label: 'Business / Institute Name' },
    { id: 'business_category', label: 'Primary Category' },
    { id: 'business_subcategory', label: 'Subcategory' },
    { id: 'address', label: 'Full Physical Address' },
    { id: 'area', label: 'Locality / Area' },
    { id: 'city', label: 'City' },
    { id: 'state', label: 'State' },
    { id: 'postal_code', label: 'Postal Code (PIN)' },
    { id: 'latitude', label: 'Geographic Latitude' },
    { id: 'longitude', label: 'Geographic Longitude' },
    { id: 'phone_numbers', label: 'Phone Numbers' },
    { id: 'email_addresses', label: 'Email Addresses' },
    { id: 'website', label: 'Official Website' },
    { id: 'rating', label: 'Star Rating' },
    { id: 'review_count', label: 'Total Review Count' },
    { id: 'courses', label: 'Courses & Curriculums' },
    { id: 'services', label: 'Services & Specialties' },
    { id: 'verification_status', label: 'Verification Status' },
    { id: 'data_confidence', label: 'Data Confidence Score' },
    { id: 'last_verified_at', label: 'Last Verification Date' },
  ];

  const [selectedFields, setSelectedFields] = useState<string[]>(
    availableFields.map((f) => f.id)
  );

  useEffect(() => {
    fetch('/api/businesses?limit=1')
      .then((res) => res.json())
      .then((d) => {
        if (d.availableCities) setAvailableCities(d.availableCities);
      })
      .catch(console.error);
  }, []);

  const toggleField = (fieldId: string) => {
    if (selectedFields.includes(fieldId)) {
      setSelectedFields(selectedFields.filter((id) => id !== fieldId));
    } else {
      setSelectedFields([...selectedFields, fieldId]);
    }
  };

  const selectAll = () => setSelectedFields(availableFields.map((f) => f.id));
  const deselectAll = () => setSelectedFields(['business_name', 'city']);

  const handleDownload = async () => {
    setIsExporting(true);
    setDownloadSuccess(false);

    try {
      const res = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city,
          category,
          format,
          selectedFields,
        }),
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `local_intelligence_${(city || 'all').toLowerCase()}_${Date.now()}.${format}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setDownloadSuccess(true);
      }
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <Download className="w-7 h-7 text-indigo-400" />
          Intelligence Export Studio
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Export source-grounded local business and institute intelligence into CSV or JSON spreadsheets.
        </p>
      </div>

      <div className="p-6 glass-panel rounded-2xl border border-slate-800 space-y-6">
        {/* Step 1: Format & Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-6 border-b border-slate-800">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Export Format</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormat('csv')}
                className={`py-2 px-3 rounded-lg text-xs font-bold border transition-colors ${
                  format === 'csv'
                    ? 'bg-indigo-600 text-white border-indigo-400 shadow-md'
                    : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                }`}
              >
                CSV (.csv)
              </button>
              <button
                type="button"
                onClick={() => setFormat('json')}
                className={`py-2 px-3 rounded-lg text-xs font-bold border transition-colors ${
                  format === 'json'
                    ? 'bg-indigo-600 text-white border-indigo-400 shadow-md'
                    : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                }`}
              >
                JSON (.json)
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Filter by City</label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Cities</option>
              {availableCities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Filter by Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Categories</option>
              {DEFAULT_TAXONOMY.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Step 2: Custom Field Selector */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Select Attributes to Export</h3>
              <p className="text-xs text-slate-400">
                {selectedFields.length} of {availableFields.length} attributes selected
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <button
                type="button"
                onClick={selectAll}
                className="text-indigo-400 hover:text-indigo-300 font-semibold"
              >
                Select All
              </button>
              <span className="text-slate-600">&bull;</span>
              <button
                type="button"
                onClick={deselectAll}
                className="text-slate-400 hover:text-slate-200"
              >
                Minimal
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {availableFields.map((field) => {
              const isChecked = selectedFields.includes(field.id);
              return (
                <div
                  key={field.id}
                  onClick={() => toggleField(field.id)}
                  className={`p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-colors text-xs select-none ${
                    isChecked
                      ? 'bg-indigo-950/20 border-indigo-500/40 text-slate-200'
                      : 'bg-slate-900/40 border-slate-800 text-slate-500 hover:border-slate-700'
                  }`}
                >
                  {isChecked ? (
                    <CheckSquare className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-600 flex-shrink-0" />
                  )}
                  <span className="truncate">{field.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Download Trigger Button */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            {downloadSuccess && (
              <span className="text-xs text-emerald-400 flex items-center gap-1.5 font-semibold">
                <CheckCircle2 className="w-4 h-4" /> Download generated successfully!
              </span>
            )}
          </div>

          <button
            type="button"
            disabled={isExporting || selectedFields.length === 0}
            onClick={handleDownload}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 disabled:opacity-50 transition-all hover:scale-[1.02]"
          >
            {isExporting ? (
              <>Generating Export...</>
            ) : (
              <>
                <Download className="w-4 h-4" /> Download {format.toUpperCase()} Export
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
