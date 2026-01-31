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
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <h1 className="text-xl font-bold">Settings</h1>

      {/* API Key */}
      <section className="bg-gray-900 rounded-xl border border-gray-800 p-5">
        <h2 className="font-semibold mb-1 flex items-center gap-2">
          <span className={hasKey ? 'text-green-400' : 'text-blue-400'}><KeyIcon size={18} /></span>
          Claude API Key
        </h2>
        <p className="text-xs text-gray-500 mb-4">
          {hasKey ? 'Your API key is stored locally in your browser.' : 'Required for AI business analysis and problem solving.'}
        </p>

        {hasKey ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <code className="flex-1 text-sm bg-gray-800 px-3 py-2 rounded-lg font-mono text-gray-300">
                {showKey ? store.apiKey : maskedKey}
              </code>
              <button onClick={() => setShowKey(!showKey)} className="px-3 py-2 bg-gray-800 rounded-lg text-sm hover:bg-gray-700">
                {showKey ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
              </button>
            </div>
            <button
              onClick={() => { store.clearApiKey(); setShowKey(false); }}
              className="text-sm text-red-400 hover:text-red-300"
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
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={saveKey}
              disabled={!keyInput.trim()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 rounded-lg text-sm font-medium"
            >
              Save API Key
            </button>
          </div>
        )}
      </section>

      {/* Get API Key */}
      <section className="bg-gray-900 rounded-xl border border-gray-800 p-5">
        <h2 className="font-semibold mb-1">Don&apos;t have an API key?</h2>
        <a
          href="https://console.anthropic.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between mt-3 p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <div>
            <p className="font-medium text-sm">Get Claude API Key</p>
            <p className="text-xs text-gray-400">Sign up at console.anthropic.com</p>
          </div>
          <span className="text-gray-400">&nearr;</span>
        </a>
      </section>

      {/* About */}
      <section className="bg-gray-900 rounded-xl border border-gray-800 p-5 space-y-3">
        <h2 className="font-semibold">About</h2>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Data Source</span>
          <span>NASA T2 Portal</span>
        </div>
        <a href="https://technology.nasa.gov/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between text-sm hover:text-blue-400">
          <span>NASA Technology Transfer</span>
          <span className="text-gray-500">&nearr;</span>
        </a>
        <a href="https://technology.nasa.gov/license" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between text-sm hover:text-blue-400">
          <span>Licensing Information</span>
          <span className="text-gray-500">&nearr;</span>
        </a>
      </section>

      {/* Startup NASA */}
      <section className="bg-yellow-900/10 rounded-xl border border-yellow-800/20 p-5">
        <p className="font-semibold flex items-center gap-2 mb-2"><StarIcon size={16} className="text-yellow-400" /> Startup NASA Program</p>
        <p className="text-sm text-gray-400 mb-3">Startups can license NASA patents for FREE for up to 3 years. This is a great opportunity for early-stage companies.</p>
        <a href="https://technology.nasa.gov/license" target="_blank" rel="noopener noreferrer" className="text-sm text-blue-400 hover:underline">Learn More &rarr;</a>
      </section>

      {/* Clear Data */}
      <section className="bg-gray-900 rounded-xl border border-gray-800 p-5 space-y-3">
        <h2 className="font-semibold">Data Management</h2>
        <button
          onClick={() => store.savedPatents.length && store.clearAllData()}
          disabled={store.savedPatents.length === 0 && store.problemHistory.length === 0 && store.analysisHistory.length === 0}
          className="text-sm text-red-400 hover:text-red-300 disabled:opacity-40"
        >
          Clear All App Data
        </button>
      </section>

      {/* App Info */}
      <section className="bg-gray-900 rounded-xl border border-gray-800 p-5 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Version</span>
          <span>1.0.0</span>
        </div>
        <button onClick={() => setShowPrivacy(!showPrivacy)} className="text-sm hover:text-blue-400 flex items-center justify-between w-full">
          <span>Privacy Policy</span>
          <span className="text-gray-500">{showPrivacy ? '▼' : '›'}</span>
        </button>
        {showPrivacy && (
          <div className="text-xs text-gray-400 space-y-3 pt-2 border-t border-gray-800">
            <p className="text-gray-500">Last Updated: January 14, 2025</p>
            <p>PatentRadar helps users discover and analyze NASA patents available for licensing.</p>
            <div>
              <p className="font-semibold text-gray-300 mb-1">What We Collect</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Claude API Key: stored locally in your browser</li>
                <li>Saved Patents: stored locally on your device</li>
                <li>Problem History: stored locally</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-gray-300 mb-1">What We Don&apos;t Collect</p>
              <ul className="list-disc list-inside space-y-1">
                <li>We do not collect personal information</li>
                <li>We do not track your location</li>
                <li>We do not use analytics or tracking</li>
                <li>We do not sell any data</li>
              </ul>
            </div>
            <p>Patent data is fetched from NASA&apos;s public Technology Transfer Portal. If you enable AI features, your queries are sent to Anthropic&apos;s Claude API using your own API key.</p>
            <p className="text-gray-500">PatentRadar is not affiliated with, endorsed by, or sponsored by NASA.</p>
          </div>
        )}
      </section>
    </div>
  );
}
