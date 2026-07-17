'use client';

import { useState, useEffect } from 'react';
import { BusinessAnalysis, Patent } from '@/types';
import { LightbulbIcon, ChartIcon, UsersIcon, MapIcon, DollarIcon, TargetIcon, HammerIcon, FactoryIcon, MegaphoneIcon, StarIcon } from '@/components/icons';

const TABS = [
  { key: 'ideas', label: 'Ideas', icon: <LightbulbIcon size={14} /> },
  { key: 'markets', label: 'Markets', icon: <ChartIcon size={14} /> },
  { key: 'competition', label: 'Competition', icon: <UsersIcon size={14} /> },
  { key: 'roadmap', label: 'Roadmap', icon: <MapIcon size={14} /> },
  { key: 'costs', label: 'Costs', icon: <DollarIcon size={14} /> },
];

export function BusinessAnalysisModal({
  analysis,
  patent,
  onClose,
}: {
  analysis: BusinessAnalysis;
  patent: Patent;
  onClose: () => void;
}) {
  const [tab, setTab] = useState('ideas');

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div role="dialog" aria-modal="true" aria-label="Business Analysis" className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-[var(--surface)] rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col border border-[var(--border)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
          <h2 className="font-bold text-base">Business Analysis</h2>
          <button onClick={onClose} aria-label="Close dialog" className="w-8 h-8 rounded-lg bg-[var(--background)] hover:bg-[var(--surface-hover)] flex items-center justify-center text-[var(--muted)] hover:text-[var(--foreground)] transition-colors text-sm">&#10005;</button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-4 py-3 overflow-x-auto border-b border-[var(--border)] scrollbar-none">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                tab === t.key
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'bg-[var(--background)] text-[var(--muted)] border border-[var(--border)] hover:border-[var(--border-hover)] hover:text-[var(--foreground)]'
              }`}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {tab === 'ideas' && (
            <>
              <SectionHeader title="Business Ideas" subtitle="Potential products and services based on this patent" />
              {analysis.businessIdeas.map((idea, i) => (
                <div key={i} className="p-4 bg-[var(--background)] rounded-xl border border-[var(--border)]">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-sm">{idea.name}</h3>
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                      idea.potentialScale.toLowerCase() === 'large' ? 'bg-emerald-600/15 text-emerald-400' :
                      idea.potentialScale.toLowerCase() === 'medium' ? 'bg-orange-600/15 text-orange-400' :
                      'bg-blue-600/15 text-blue-400'
                    }`}>{idea.potentialScale}</span>
                  </div>
                  <p className="text-sm text-[var(--muted)]">{idea.description}</p>
                </div>
              ))}
            </>
          )}

          {tab === 'markets' && (
            <>
              <SectionHeader title="Target Markets" subtitle="Industries and customer segments" />
              {analysis.targetMarkets.map((m, i) => (
                <div key={i} className="flex items-center gap-3 p-4 bg-[var(--background)] rounded-xl border border-[var(--border)]">
                  <span className="text-blue-400"><TargetIcon size={16} /></span>
                  <span className="text-sm">{m}</span>
                </div>
              ))}
              <p className="text-xs font-semibold text-[var(--muted)] uppercase tracking-widest mt-4">Revenue Models</p>
              {analysis.revenueModels.map((m, i) => (
                <div key={i} className="flex items-center gap-3 p-4 bg-emerald-600/5 border border-emerald-500/10 rounded-xl">
                  <span className="text-emerald-400"><DollarIcon size={16} /></span>
                  <span className="text-sm">{m}</span>
                </div>
              ))}
            </>
          )}

          {tab === 'competition' && (
            <>
              <SectionHeader title="Competition Analysis" subtitle="Existing players and your advantages" />
              {analysis.competition.map((c, i) => (
                <div key={i} className="p-4 bg-[var(--background)] rounded-xl border border-[var(--border)] space-y-2">
                  <h3 className="font-semibold text-sm">{c.name}</h3>
                  <p className="text-sm text-[var(--muted)]">{c.description}</p>
                  <div className="flex items-start gap-2 text-emerald-400 text-sm">
                    <span className="mt-0.5 shrink-0">&#10003;</span>
                    <div>
                      <span className="font-semibold">Your Advantage: </span>
                      <span className="text-emerald-300">{c.gap}</span>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          {tab === 'roadmap' && (
            <>
              <SectionHeader title="Implementation Roadmap" subtitle="Steps to bring this to market" />
              {analysis.roadmap.map((step) => (
                <div key={step.step} className="flex gap-4 p-4 bg-[var(--background)] rounded-xl border border-[var(--border)]">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold shrink-0 shadow-md shadow-blue-600/20">
                    {step.step}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{step.title}</h3>
                    <p className="text-sm text-[var(--muted)] mt-1">{step.description}</p>
                  </div>
                </div>
              ))}
            </>
          )}

          {tab === 'costs' && (
            <>
              <SectionHeader title="Cost Estimates" subtitle="Budget ranges for commercialization" />
              <CostRow icon={<HammerIcon size={16} />} label="Prototyping" value={analysis.costEstimates.prototyping} />
              <CostRow icon={<FactoryIcon size={16} />} label="Manufacturing" value={analysis.costEstimates.manufacturing} />
              <CostRow icon={<MegaphoneIcon size={16} />} label="Marketing" value={analysis.costEstimates.marketing} />
              <div className="flex items-center justify-between p-4 bg-blue-600/5 border border-blue-500/10 rounded-xl">
                <span className="font-semibold text-sm">Estimated Total</span>
                <span className="text-lg font-bold text-blue-400">{analysis.costEstimates.total}</span>
              </div>
              <div className="p-4 bg-yellow-600/5 border border-yellow-500/10 rounded-xl">
                <p className="font-semibold text-sm flex items-center gap-2 mb-1"><StarIcon size={14} className="text-yellow-400" /> Startup NASA Program</p>
                <p className="text-xs text-[var(--muted)] mb-2">Eligible startups can license this technology for FREE for up to 3 years, significantly reducing initial costs.</p>
                <a href="https://technology.nasa.gov/license" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline font-medium">Learn More &rarr;</a>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-2">
      <h3 className="text-base font-bold">{title}</h3>
      <p className="text-xs text-[var(--muted)]">{subtitle}</p>
    </div>
  );
}

function CostRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between p-4 bg-[var(--background)] rounded-xl border border-[var(--border)]">
      <span className="flex items-center gap-2 text-sm">
        {icon}
        <span>{label}</span>
      </span>
      <span className="font-medium text-sm">{value}</span>
    </div>
  );
}
