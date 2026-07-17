'use client';

import { useState } from 'react';
import { usePatentStore } from '@/lib/stores/patents';
import { KeyIcon, EyeIcon, EyeOffIcon, StarIcon } from '@/components/icons';

export default function SettingsPage() {
  const store = usePatentStore();
  const [keyInput, setKeyInput] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const hasKey = !!store.apiKey;

  const maskedKey = store.apiKey.length > 12
    ? store.apiKey.slice(0, 8) + '...' + store.apiKey.slice(-4)
    : '•'.repeat(store.apiKey.length);

  const saveKey = () => {
    const trimmed = keyInput.trim();
    if (trimmed) {
      store.setApiKey(trimmed);
      setKeyInput('');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-5">
      <h1 className="text-lg font-bold tracking-tight">Settings</h1>

      {/* API Key */}
      <section className="bg-[var(--surface)] rounded-xl border border-[var(--border)] p-5">
        <h2 className="font-semibold text-sm mb-1 flex items-center gap-2">
          <span className={hasKey ? 'text-emerald-400' : 'text-blue-400'}><KeyIcon size={16} /></span>
          Claude API Key
        </h2>
        <p className="text-[11px] text-[var(--muted)] mb-4">
          {hasKey ? 'Your API key is stored locally in your browser.' : 'Required for AI business analysis and problem solving.'}
        </p>

        {hasKey ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <code className="flex-1 text-sm bg-[var(--background)] px-3 py-2.5 rounded-lg font-mono text-[var(--muted)] border border-[var(--border)]">
                {showKey ? store.apiKey : maskedKey}
              </code>
              <button onClick={() => setShowKey(!showKey)} className="px-3 py-2.5 bg-[var(--background)] border border-[var(--border)] rounded-lg text-sm hover:border-[var(--border-hover)] transition-colors">
                {showKey ? <EyeOffIcon size={15} /> : <EyeIcon size={15} />}
              </button>
            </div>
            <button
              onClick={() => { store.clearApiKey(); setShowKey(false); }}
              className="text-xs text-red-400 hover:text-red-300 transition-colors"
            >
              Remove API Key
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <input
              type="password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && saveKey()}
              placeholder="sk-ant-api03-..."
              className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-base sm:text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all duration-200 placeholder:text-[var(--muted)]/50"
            />
            <button
              onClick={saveKey}
              disabled={!keyInput.trim()}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 rounded-xl text-sm font-medium transition-colors"
            >
              Save API Key
            </button>
          </div>
        )}
      </section>

      {/* Get API Key */}
      <section className="bg-[var(--surface)] rounded-xl border border-[var(--border)] p-5">
        <h2 className="font-semibold text-sm mb-1">Don&apos;t have an API key?</h2>
        <a
          href="https://console.anthropic.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between mt-3 p-3.5 bg-[var(--background)] border border-[var(--border)] rounded-xl hover:border-[var(--border-hover)] transition-all duration-200"
        >
          <div>
            <p className="font-medium text-sm">Get Claude API Key</p>
            <p className="text-[11px] text-[var(--muted)]">Sign up at console.anthropic.com</p>
          </div>
          <span className="text-[var(--muted)]">{'↗'}</span>
        </a>
      </section>

      {/* About */}
      <section className="bg-[var(--surface)] rounded-xl border border-[var(--border)] p-5 space-y-3">
        <h2 className="font-semibold text-sm">About</h2>
        <div className="flex items-center justify-between text-sm">
          <span className="text-[var(--muted)]">Data Source</span>
          <span className="font-medium">NASA T2 Portal</span>
        </div>
        <a href="https://technology.nasa.gov/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between text-sm hover:text-blue-400 transition-colors">
          <span>NASA Technology Transfer</span>
          <span className="text-[var(--muted)]">{'↗'}</span>
        </a>
        <a href="https://technology.nasa.gov/license" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between text-sm hover:text-blue-400 transition-colors">
          <span>Licensing Information</span>
          <span className="text-[var(--muted)]">{'↗'}</span>
        </a>
      </section>

      {/* Startup NASA */}
      <section className="bg-yellow-600/5 rounded-xl border border-yellow-500/10 p-5">
        <p className="font-semibold text-sm flex items-center gap-2 mb-2"><StarIcon size={15} className="text-yellow-400" /> Startup NASA Program</p>
        <p className="text-sm text-[var(--muted)] mb-3">Startups can license NASA patents for FREE for up to 3 years. A great opportunity for early-stage companies.</p>
        <a href="https://technology.nasa.gov/license" target="_blank" rel="noopener noreferrer" className="text-sm text-blue-400 hover:underline font-medium">Learn More &rarr;</a>
      </section>

      {/* Clear Data */}
      <section className="bg-[var(--surface)] rounded-xl border border-[var(--border)] p-5 space-y-3">
        <h2 className="font-semibold text-sm">Data Management</h2>
        <button
          onClick={() => store.clearAllData()}
          disabled={store.savedPatents.length === 0 && store.problemHistory.length === 0 && store.analysisHistory.length === 0}
          className="text-xs text-red-400 hover:text-red-300 disabled:opacity-40 transition-colors"
        >
          Clear All App Data
        </button>
      </section>

      {/* App Info */}
      <section className="bg-[var(--surface)] rounded-xl border border-[var(--border)] p-5 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-[var(--muted)]">Version</span>
          <span className="font-mono text-xs">1.0.0</span>
        </div>
        <button onClick={() => setShowPrivacy(!showPrivacy)} className="text-sm hover:text-blue-400 flex items-center justify-between w-full transition-colors">
          <span>Privacy Policy</span>
          <span className="text-[var(--muted)] text-xs">{showPrivacy ? '▼' : '›'}</span>
        </button>
        {showPrivacy && (
          <div className="text-xs text-[var(--muted)] space-y-3 pt-3 border-t border-[var(--border)]">
            <p className="text-[var(--muted)]/60">Last Updated: January 14, 2025</p>
            <p>PatentRadar helps users discover and analyze NASA patents available for licensing.</p>
            <div>
              <p className="font-semibold text-[var(--foreground)]/80 mb-1">What We Collect</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Claude API Key: stored locally in your browser</li>
                <li>Saved Patents: stored locally on your device</li>
                <li>Problem History: stored locally</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-[var(--foreground)]/80 mb-1">What We Don&apos;t Collect</p>
              <ul className="list-disc list-inside space-y-1">
                <li>We do not collect personal information</li>
                <li>We do not track your location</li>
                <li>We do not use analytics or tracking</li>
                <li>We do not sell any data</li>
              </ul>
            </div>
            <p>Patent data is fetched from NASA&apos;s public Technology Transfer Portal. If you enable AI features, your queries are sent to Anthropic&apos;s Claude API using your own API key.</p>
            <p className="text-[var(--muted)]/60">PatentRadar is not affiliated with, endorsed by, or sponsored by NASA.</p>
          </div>
        )}
      </section>
    </div>
  );
}
