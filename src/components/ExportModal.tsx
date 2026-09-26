'use client';

import React, { useState } from 'react';
import {
  Download,
  X,
  FileSpreadsheet,
  FileText,
  FileJson,
  CheckCircle2,
  CheckSquare,
  Square,
  Sparkles,
} from 'lucide-react';
import { BusinessRecord } from '@/types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  filteredBusinesses?: BusinessRecord[];
  totalDirectoryCount?: number;
  currentCity?: string;
  currentCategory?: string;
}

const EXPORT_COLUMNS = [
  { id: 'business_name', label: 'Business Name', defaultChecked: true },
  { id: 'business_category', label: 'Domain Category', defaultChecked: true },
  { id: 'business_subcategory', label: 'Subcategory', defaultChecked: true },
  { id: 'city', label: 'City / District', defaultChecked: true },
  { id: 'address', label: 'Address', defaultChecked: true },
  { id: 'phone', label: 'Phone Numbers', defaultChecked: true },
  { id: 'email', label: 'Email Addresses', defaultChecked: true },
  { id: 'website', label: 'Website URL', defaultChecked: true },
  { id: 'website_status', label: 'Website Status', defaultChecked: true },
  { id: 'verification_score', label: 'Verification Score (%)', defaultChecked: true },
  { id: 'verification_status', label: 'Verification Status', defaultChecked: true },
  { id: 'source', label: 'Data Source', defaultChecked: true },
];

export default function ExportModal({
  isOpen,
  onClose,
  filteredBusinesses = [],
  totalDirectoryCount = 80,
  currentCity = 'All',
  currentCategory = 'All',
}: ExportModalProps) {
  const [format, setFormat] = useState<'csv' | 'excel' | 'json' | 'pdf'>('csv');
  const [scope, setScope] = useState<'filtered' | 'all'>('filtered');
  const [selectedColumns, setSelectedColumns] = useState<string[]>(
    EXPORT_COLUMNS.map((c) => c.id)
  );
  const [isExporting, setIsExporting] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const toggleColumn = (colId: string) => {
    setSelectedColumns((prev) =>
      prev.includes(colId) ? prev.filter((id) => id !== colId) : [...prev, colId]
    );
  };

  const selectAll = () => setSelectedColumns(EXPORT_COLUMNS.map((c) => c.id));
  const deselectAll = () => setSelectedColumns(['business_name', 'city']);

  const handleExport = async () => {
    setIsExporting(true);
    setDownloadSuccess(false);

    try {
      let dataToExport = filteredBusinesses;

      // If "all" selected or filtered businesses is empty, fetch full dataset
      if (scope === 'all' || dataToExport.length === 0) {
        const res = await fetch('/api/businesses?limit=1000');
        if (res.ok) {
          const json = await res.json();
          dataToExport = json.businesses || [];
        }
      }

      const rows = dataToExport.map((b) => {
        const item: Record<string, string | number> = {};
        if (selectedColumns.includes('business_name')) item['Business Name'] = b.business_name;
        if (selectedColumns.includes('business_category')) item['Category'] = b.business_category;
        if (selectedColumns.includes('business_subcategory')) item['Subcategory'] = b.business_subcategory;
        if (selectedColumns.includes('city')) item['City'] = b.city;
        if (selectedColumns.includes('address')) item['Address'] = b.address;
        if (selectedColumns.includes('phone')) item['Phone'] = b.phone_numbers.join(', ');
        if (selectedColumns.includes('email')) item['Email'] = b.email_addresses.join(', ');
        if (selectedColumns.includes('website')) item['Website'] = b.website || 'N/A';
        if (selectedColumns.includes('website_status')) item['Website Status'] = b.website_status;
        if (selectedColumns.includes('verification_score')) item['Verification Score'] = `${b.data_confidence}%`;
        if (selectedColumns.includes('verification_status')) item['Verification Status'] = b.verification_status;
        if (selectedColumns.includes('source')) item['Source'] = b.source_names?.join(', ') || 'Local Intelligence';
        return item;
      });

      const filename = `local-intelligence-${scope === 'all' ? 'all' : (currentCity || 'filtered').toLowerCase()}-${new Date().toISOString().split('T')[0]}`;

      if (format === 'json') {
        const blob = new Blob([JSON.stringify(rows, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.json`;
        a.click();
        URL.revokeObjectURL(url);
      } else if (format === 'csv' || format === 'excel') {
        if (rows.length === 0) {
          alert('No records available to export.');
          setIsExporting(false);
          return;
        }
        const headers = Object.keys(rows[0]);
        const csvContent = [
          headers.join(','),
          ...rows.map((row) =>
            headers
              .map((h) => {
                const val = String(row[h] ?? '').replace(/"/g, '""');
                return `"${val}"`;
              })
              .join(',')
          ),
        ].join('\n');

        const mime = format === 'excel' ? 'application/vnd.ms-excel' : 'text/csv;charset=utf-8;';
        const ext = format === 'excel' ? 'csv' : 'csv'; // clean universal CSV compatible with Excel
        const blob = new Blob([csvContent], { type: mime });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.${ext}`;
        a.click();
        URL.revokeObjectURL(url);
      } else if (format === 'pdf') {
        // Trigger browser printable view formatted for PDF export
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          const headers = rows.length > 0 ? Object.keys(rows[0]) : [];
          printWindow.document.write(`
            <html>
              <head>
                <title>Local Intelligence Export</title>
                <style>
                  body { font-family: sans-serif; padding: 20px; color: #1e293b; }
                  h1 { font-size: 18px; margin-bottom: 4px; }
                  p { font-size: 12px; color: #64748b; margin-bottom: 16px; }
                  table { width: 100%; border-collapse: collapse; font-size: 11px; }
                  th, td { border: 1px solid #cbd5e1; padding: 6px 8px; text-align: left; }
                  th { background: #f1f5f9; font-weight: bold; }
                </style>
              </head>
              <body>
                <h1>Local Intelligence Finder — Verified Directory Export</h1>
                <p>Generated on ${new Date().toLocaleDateString()} | Total Records: ${rows.length}</p>
                <table>
                  <thead>
                    <tr>${headers.map((h) => `<th>${h}</th>`).join('')}</tr>
                  </thead>
                  <tbody>
                    ${rows
                      .map(
                        (r) =>
                          `<tr>${headers.map((h) => `<td>${r[h] ?? ''}</td>`).join('')}</tr>`
                      )
                      .join('')}
                  </tbody>
                </table>
              </body>
            </html>
          `);
          printWindow.document.close();
          printWindow.print();
        }
      }

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800/80 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/25">
              <Download className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Export Intelligence Data</h2>
              <p className="text-xs text-slate-400">
                Download verified directory records in your preferred format.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Format Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Export Format</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'csv', label: 'CSV', icon: FileSpreadsheet },
                { id: 'excel', label: 'Excel (XLS)', icon: FileSpreadsheet },
                { id: 'json', label: 'JSON', icon: FileJson },
                { id: 'pdf', label: 'PDF', icon: FileText },
              ].map((f) => {
                const Icon = f.icon;
                const isSelected = format === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFormat(f.id as any)}
                    className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-md shadow-indigo-600/20'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{f.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Scope Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Records Scope</label>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  scope === 'filtered'
                    ? 'bg-purple-950/20 border-purple-500/50 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <input
                  type="radio"
                  name="scope"
                  value="filtered"
                  checked={scope === 'filtered'}
                  onChange={() => setScope('filtered')}
                  className="mt-0.5 text-purple-600 focus:ring-0"
                />
                <div>
                  <span className="text-xs font-bold block text-slate-200">
                    Current Filtered Results
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {filteredBusinesses.length} records matching active filters
                  </span>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  scope === 'all'
                    ? 'bg-purple-950/20 border-purple-500/50 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <input
                  type="radio"
                  name="scope"
                  value="all"
                  checked={scope === 'all'}
                  onChange={() => setScope('all')}
                  className="mt-0.5 text-purple-600 focus:ring-0"
                />
                <div>
                  <span className="text-xs font-bold block text-slate-200">
                    All in Directory
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Entire Maharashtra repository ({totalDirectoryCount}+ records)
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Columns Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-300">
                Include Data Columns ({selectedColumns.length}/{EXPORT_COLUMNS.length})
              </label>
              <div className="flex gap-2 text-[11px]">
                <button
                  type="button"
                  onClick={selectAll}
                  className="text-indigo-400 hover:text-indigo-300"
                >
                  Select All
                </button>
                <span className="text-slate-600">•</span>
                <button
                  type="button"
                  onClick={deselectAll}
                  className="text-slate-400 hover:text-slate-300"
                >
                  Reset
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800 max-h-44 overflow-y-auto">
              {EXPORT_COLUMNS.map((col) => {
                const isChecked = selectedColumns.includes(col.id);
                return (
                  <button
                    key={col.id}
                    type="button"
                    onClick={() => toggleColumn(col.id)}
                    className="flex items-center gap-2 text-left text-xs py-1 px-1.5 rounded hover:bg-slate-900 transition-colors"
                  >
                    {isChecked ? (
                      <CheckSquare className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                    ) : (
                      <Square className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
                    )}
                    <span className={isChecked ? 'text-slate-200' : 'text-slate-500'}>
                      {col.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {downloadSuccess && (
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>Export file generated and downloaded successfully!</span>
            </div>
          )}

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isExporting || selectedColumns.length === 0}
              onClick={handleExport}
              className="px-5 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-indigo-600/25 transition-all hover:scale-[1.02] flex items-center gap-2 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {isExporting ? 'Generating File...' : `Download ${format.toUpperCase()}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
