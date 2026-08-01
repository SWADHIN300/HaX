import { useState } from 'react';
import type { FormEvent } from 'react';
import type { AlertFormData, Domain } from '../types';

interface AlertFormProps {
  initialData?: AlertFormData;
  onSave: (data: AlertFormData) => void;
  onCancel: () => void;
}

const allDomains: Domain[] = ['Web3', 'AI' , 'Fintech', 'Student', 'General'];
const countries = [
  'United States',
  'India',
  'United Kingdom',
  'Germany',
  'Singapore',
  'Canada',
  'Brazil',
  'Japan',
  'Australia',
  'France',
];

export default function AlertForm({
  initialData,
  onSave,
  onCancel,
}: AlertFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [domains, setDomains] = useState<Domain[]>(initialData?.domains || []);
  const [locationPref, setLocationPref] = useState<'anywhere' | 'online' | 'specific'>(
    initialData?.locationPreference || 'specific'
  );
  const [country, setCountry] = useState(initialData?.specificCountry || 'India');
  const [showOtherRegions, setShowOtherRegions] = useState(!!initialData && initialData.specificCountry !== 'India');
  const [minPrize, setMinPrize] = useState(initialData?.minPrize || 0);
  const [dateStart, setDateStart] = useState(initialData?.dateRange?.start || '');
  const [dateEnd, setDateEnd] = useState(initialData?.dateRange?.end || '');

  const toggleDomain = (d: Domain) => {
    setDomains((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
    );
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      name: name.trim(),
      domains,
      locationPreference: locationPref,
      specificCountry: locationPref === 'specific' ? country : undefined,
      minPrize,
      dateRange:
        dateStart && dateEnd ? { start: dateStart, end: dateEnd } : undefined,
    });
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
          Alert Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., High-value AI Hackathons"
          className="w-full px-4 py-3 rounded-lg bg-base border border-base-border text-sm text-text-primary placeholder:text-text-muted focus:border-accent-amber/50 transition-colors"
          required
        />
      </div>

      {/* Domains */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
          Domains
        </label>
        <div className="flex flex-wrap gap-2">
          {allDomains.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => toggleDomain(d)}
              className={`chip ${domains.includes(d) ? 'chip-active !border-accent-amber/30 bg-accent-amber/5' : ''}`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Location Preference */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
          Location
        </label>
        <button
          type="button"
          onClick={() => {
            setLocationPref('specific');
            setCountry('India');
          }}
          className={`chip w-full justify-start !rounded-lg ${
            locationPref === 'specific' && country === 'India'
              ? 'chip-active !border-accent-amber/30 bg-accent-amber/5'
              : ''
          }`}
        >
          <span className="mr-2" aria-hidden="true">🇮🇳</span>
          India
        </button>

        <button
          type="button"
          onClick={() => setShowOtherRegions((open) => !open)}
          className="mt-2 text-xs font-medium text-text-secondary hover:text-text-primary transition-colors"
        >
          {showOtherRegions ? 'Hide other regions' : 'Add other regions'}
        </button>

        {showOtherRegions && (
          <div className="mt-3 space-y-2">
            <div className="flex gap-2">
              {(['anywhere', 'online'] as const).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setLocationPref(opt)}
                  className={`chip flex-1 ${
                    locationPref === opt ? 'chip-active !border-accent-amber/30 bg-accent-amber/5' : ''
                  }`}
                >
                  {opt === 'anywhere' ? 'Global' : 'Online'}
                </button>
              ))}
            </div>
            <select
              value={locationPref === 'specific' && country !== 'India' ? country : ''}
              onChange={(e) => {
                setLocationPref('specific');
                setCountry(e.target.value || 'India');
              }}
              className="w-full px-4 py-3 rounded-lg bg-base border border-base-border text-sm text-text-primary focus:border-accent-amber/50 transition-colors appearance-none cursor-pointer"
            >
              <option value="">Choose another country</option>
              {countries
                .filter((c) => c !== 'India')
                .map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
            </select>
          </div>
        )}
      </div>
      {/* Min Prize Slider */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
          Minimum Prize Pool
        </label>
        <div className="relative">
          <input
            type="range"
            min={0}
            max={100000}
            step={1000}
            value={minPrize}
            onChange={(e) => setMinPrize(Number(e.target.value))}
            className="w-full h-1.5 bg-base-border rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent-amber [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md"
          />
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-text-muted">$0</span>
            <span className="text-xs font-semibold text-accent-amber">
              {minPrize >= 1000
                ? `$${(minPrize / 1000).toFixed(0)}k`
                : `$${minPrize}`}
            </span>
            <span className="text-[10px] text-text-muted">$100k+</span>
          </div>
        </div>
      </div>

      {/* Date Range */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
          Date Range (optional)
        </label>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="date"
            value={dateStart}
            onChange={(e) => setDateStart(e.target.value)}
            className="px-3 py-2.5 rounded-lg bg-base border border-base-border text-sm text-text-primary focus:border-accent-amber/50 transition-colors"
          />
          <input
            type="date"
            value={dateEnd}
            onChange={(e) => setDateEnd(e.target.value)}
            className="px-3 py-2.5 rounded-lg bg-base border border-base-border text-sm text-text-primary focus:border-accent-amber/50 transition-colors"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-ghost flex-1 text-sm">
          Cancel
        </button>
        <button type="submit" className="btn-gradient flex-1 text-sm">
          Save Alert
        </button>
      </div>
    </form>
  );
}
