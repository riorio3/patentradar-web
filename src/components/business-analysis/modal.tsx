'use client';

import { useState } from 'react';
import { BusinessAnalysis, Patent } from '@/types';

const TABS = [
  { key: 'ideas', label: 'Ideas', icon: '💡' },
  { key: 'markets', label: 'Markets', icon: '📊' },
  { key: 'competition', label: 'Competition', icon: '👥' },
  { key: 'roadmap', label: 'Roadmap', icon: '🗺️' },
  { key: 'costs', label: 'Costs', icon: '💰' },
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

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/80" onClick={onClose}>
      <div
        className="bg-gray-900 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col border border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
          <h2 className="font-bold text-lg">Business Analysis</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">✕</button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-4 py-3 overflow-x-auto border-b border-gray-800">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                tab === t.key ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <span>{t.icon}</span>
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
                <div key={i} className="p-4 bg-gray-800 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{idea.name}</h3>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                      idea.potentialScale.toLowerCase() === 'large' ? 'bg-green-900/40 text-green-400' :
                      idea.potentialScale.toLowerCase() === 'medium' ? 'bg-orange-900/40 text-orange-400' :
                      'bg-blue-900/40 text-blue-400'
                    }`}>{idea.potentialScale}</span>
                  </div>
                  <p className="text-sm text-gray-400">{idea.description}</p>
                </div>
              ))}
            </>
          )}

          {tab === 'markets' && (
            <>
              <SectionHeader title="Target Markets" subtitle="Industries and customer segments" />
              {analysis.targetMarkets.map((m, i) => (
                <div key={i} className="flex items-center gap-3 p-4 bg-gray-800 rounded-xl">
                  <span className="text-blue-400">🎯</span>
                  <span>{m}</span>
                </div>
              ))}
              <h3 className="font-semibold mt-4">Revenue Models</h3>
              {analysis.revenueModels.map((m, i) => (
                <div key={i} className="flex items-center gap-3 p-4 bg-green-900/10 border border-green-900/20 rounded-xl">
                  <span className="text-green-400">💰</span>
                  <span>{m}</span>
                </div>
              ))}
            </>
          )}

          {tab === 'competition' && (
            <>
              <SectionHeader title="Competition Analysis" subtitle="Existing players and your advantages" />
              {analysis.competition.map((c, i) => (
                <div key={i} className="p-4 bg-gray-800 rounded-xl space-y-2">
                  <h3 className="font-semibold">{c.name}</h3>
                  <p className="text-sm text-gray-400">{c.description}</p>
                  <div className="flex items-start gap-2 text-green-400 text-sm">
                    <span>✓</span>
                    <div>
                      <span className="font-semibold">Your Advantage: </span>
                      <span className="text-green-300">{c.gap}</span>
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
                <div key={step.step} className="flex gap-4 p-4 bg-gray-800 rounded-xl">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                    {step.step}
                  </div>
                  <div>
                    <h3 className="font-semibold">{step.title}</h3>
                    <p className="text-sm text-gray-400 mt-1">{step.description}</p>
                  </div>
                </div>
              ))}
            </>
          )}

          {tab === 'costs' && (
            <>
              <SectionHeader title="Cost Estimates" subtitle="Budget ranges for commercialization" />
              <CostRow icon="🔨" label="Prototyping" value={analysis.costEstimates.prototyping} />
              <CostRow icon="🏭" label="Manufacturing" value={analysis.costEstimates.manufacturing} />
              <CostRow icon="📣" label="Marketing" value={analysis.costEstimates.marketing} />
              <div className="flex items-center justify-between p-4 bg-blue-900/20 border border-blue-800/30 rounded-xl">
                <span className="font-semibold">Estimated Total</span>
                <span className="text-xl font-bold text-blue-400">{analysis.costEstimates.total}</span>
              </div>
              <div className="p-4 bg-yellow-900/10 border border-yellow-800/20 rounded-xl">
                <p className="font-semibold flex items-center gap-2 mb-1">⭐ Startup NASA Program</p>
                <p className="text-sm text-gray-400 mb-2">Eligible startups can license this technology for FREE for up to 3 years, significantly reducing initial costs.</p>
                <a href="https://technology.nasa.gov/license" target="_blank" rel="noopener noreferrer" className="text-sm text-blue-400 hover:underline">Learn More →</a>
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
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="text-sm text-gray-500">{subtitle}</p>
    </div>
  );
}

function CostRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-800 rounded-xl">
      <span className="flex items-center gap-2">
        <span>{icon}</span>
        <span>{label}</span>
      </span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
