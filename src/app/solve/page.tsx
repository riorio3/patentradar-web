'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { extractSearchTerms, findPatentsForProblem } from '@/lib/api/anthropic';
import { searchPatents } from '@/lib/api/nasa';
import { usePatentStore } from '@/lib/stores/patents';
import { Patent, ProblemSolution, PatentMatch } from '@/types';

const ALL_PROMPTS = [
  [
    'I need to cool electronics without fans',
    'How can I purify water without chemicals?',
    'Detect cracks in structures automatically',
  ],
  [
    'Lightweight materials for drones',
    'Reduce noise in aircraft engines',
    'Monitor air quality in buildings',
  ],
  [
    'Generate power from vibrations',
    'Protect equipment from radiation',
    'Improve battery efficiency',
  ],
  [
    'Filter microplastics from water',
    'Self-healing materials for vehicles',
    'Non-invasive health monitoring',
  ],
];

function MatchCard({ patent, match }: { patent: Patent; match: PatentMatch }) {
  const scoreColor = match.relevanceScore >= 80 ? 'bg-green-600' : match.relevanceScore >= 70 ? 'bg-blue-600' : 'bg-orange-600';
  return (
    <Link
      href={`/patent/${patent.caseNumber}`}
      className="block p-4 bg-gray-800 rounded-xl hover:bg-gray-750 transition-colors border border-gray-700"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="font-semibold text-sm line-clamp-2">{patent.title}</h3>
        <span className={`${scoreColor} text-white text-xs font-bold px-2 py-1 rounded-full shrink-0`}>
          {match.relevanceScore}%
        </span>
      </div>
      <p className="text-xs text-gray-400 line-clamp-2 mb-2">{match.explanation}</p>
      <div className="flex items-center gap-1.5 p-2 bg-yellow-900/10 rounded-lg text-xs">
        <span className="text-yellow-400">💡</span>
        <span className="line-clamp-1 text-gray-300">{match.applicationIdea}</span>
      </div>
      <div className="flex justify-end mt-2">
        <span className="text-xs text-gray-500">→</span>
      </div>
    </Link>
  );
}

export default function ProblemSolverPage() {
  const store = usePatentStore();
  const [input, setInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchPhase, setSearchPhase] = useState('');
  const [solution, setSolution] = useState<ProblemSolution | null>(null);
  const [matchedPatents, setMatchedPatents] = useState<Patent[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [promptIndex, setPromptIndex] = useState(0);

  useEffect(() => {
    const idx = Math.floor(Date.now() / 1800000) % ALL_PROMPTS.length;
    setPromptIndex(idx);
  }, []);

  const examplePrompts = ALL_PROMPTS[promptIndex] ?? ALL_PROMPTS[0];

  const handleSearch = async () => {
    if (!input.trim() || isSearching) return;
    if (!store.apiKey) {
      setError('Please add your Claude API key in Settings');
      return;
    }

    setIsSearching(true);
    setError(null);
    setSolution(null);
    setMatchedPatents([]);

    try {
      setSearchPhase('Analyzing problem...');
      const keywords = await extractSearchTerms(input, store.apiKey);

      setSearchPhase('Searching patents...');
      const results = await Promise.all(
        keywords.slice(0, 4).map(kw => searchPatents(kw).catch(() => []))
      );
      const seen = new Set<string>();
      const uniquePatents = results.flat().filter(p => {
        if (seen.has(p.id)) return false;
        seen.add(p.id);
        return true;
      });
      setMatchedPatents(uniquePatents);

      if (uniquePatents.length === 0) {
        setSolution({
          problem: input,
          summary: 'No patents found. Try different keywords.',
          matches: [],
          additionalSuggestions: 'Break down your problem into specific technical terms.',
        });
        setIsSearching(false);
        return;
      }

      setSearchPhase('Finding solutions...');
      const result = await findPatentsForProblem(input, uniquePatents, store.apiKey);
      setSolution(result);
      store.addProblemEntry({ problem: input, solution: result, matchedPatents: uniquePatents });
      setInput('');
    } catch (e) {
      setError(String(e instanceof Error ? e.message : e));
    }
    setIsSearching(false);
  };

  const reset = () => {
    setInput('');
    setSolution(null);
    setMatchedPatents([]);
    setError(null);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col min-h-[calc(100vh-5rem)] md:min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Problem Solver</h1>
        <div className="flex gap-2">
          {store.problemHistory.length > 0 && (
            <button onClick={() => setShowHistory(!showHistory)} className="text-sm text-gray-400 hover:text-white px-3 py-1 bg-gray-800 rounded-lg">
              🕐 History
            </button>
          )}
          {(solution || error) && (
            <button onClick={reset} className="text-sm text-gray-400 hover:text-white px-3 py-1 bg-gray-800 rounded-lg">
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-y-auto mb-4">
        {showHistory ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Search History</h2>
              <button onClick={() => store.clearProblemHistory()} className="text-xs text-red-400 hover:text-red-300">Clear All</button>
            </div>
            {store.problemHistory.map((entry) => (
              <button
                key={entry.id}
                onClick={() => {
                  setInput(entry.problem);
                  setSolution(entry.solution);
                  setMatchedPatents(entry.matchedPatents);
                  setShowHistory(false);
                }}
                className="w-full text-left p-4 bg-gray-800 rounded-xl hover:bg-gray-750 transition-colors"
              >
                <p className="font-medium text-sm line-clamp-2">{entry.problem}</p>
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">{entry.solution.summary}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-blue-400">{entry.solution.matches.length} patents</span>
                  <span className="text-xs text-gray-500">{new Date(entry.date).toLocaleDateString()}</span>
                </div>
              </button>
            ))}
          </div>
        ) : !solution && !isSearching && !error ? (
          // Welcome
          <div className="text-center py-12">
            <div className="text-5xl mb-4">💡</div>
            <h2 className="text-xl font-bold mb-2">Find Patent Solutions</h2>
            <p className="text-gray-400 text-sm mb-8">Describe your challenge and AI will find patents that could help.</p>
            <div className="text-left space-y-2">
              <p className="text-xs font-bold text-gray-500 uppercase">Try these:</p>
              {examplePrompts.map((p) => (
                <button
                  key={p}
                  onClick={() => setInput(p)}
                  className="w-full text-left p-3 bg-gray-800 rounded-lg text-sm hover:bg-gray-700 transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        ) : isSearching ? (
          <div className="flex flex-col items-center py-20">
            <div className="animate-spin text-3xl mb-4">🛰️</div>
            <p className="text-gray-400">{searchPhase}</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center py-20 text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <p className="text-gray-400 text-sm">{error}</p>
            {error.includes('API key') && (
              <Link href="/settings" className="mt-2 text-blue-400 text-sm hover:underline">Add API Key in Settings</Link>
            )}
            <button onClick={handleSearch} className="mt-4 px-4 py-2 bg-blue-600 rounded-lg text-sm">Try Again</button>
          </div>
        ) : solution ? (
          <div className="space-y-5">
            {/* Summary */}
            <div className="p-4 bg-blue-900/20 border border-blue-800/30 rounded-xl">
              <p className="text-sm font-semibold flex items-center gap-2 mb-2">
                <span className="text-blue-400">✨</span> AI Analysis
              </p>
              <p className="text-sm text-gray-300">{solution.summary}</p>
            </div>

            {/* Matches */}
            {solution.matches.length > 0 ? (
              <>
                <h3 className="font-semibold">Matching Patents</h3>
                {solution.matches.map((match, i) => {
                  const patent = matchedPatents[match.patentIndex];
                  if (!patent) return null;
                  return <MatchCard key={i} patent={patent} match={match} />;
                })}
              </>
            ) : (
              <div className="text-center py-8">
                <div className="text-3xl mb-2">🔍</div>
                <p className="text-sm text-gray-400">No matching patents found. Try rephrasing your problem.</p>
              </div>
            )}

            {/* Suggestions */}
            {solution.additionalSuggestions && (
              <div className="p-4 bg-gray-800 rounded-xl">
                <p className="text-sm font-semibold flex items-center gap-2 mb-1">
                  <span className="text-yellow-400">💡</span> Tip
                </p>
                <p className="text-xs text-gray-400">{solution.additionalSuggestions}</p>
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* Input */}
      <div className="flex gap-2 items-center sticky bottom-20 md:bottom-4 bg-gray-950 py-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Describe your problem..."
          className="flex-1 bg-gray-800 border border-gray-700 rounded-full px-5 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
        />
        <button
          onClick={handleSearch}
          disabled={!input.trim() || isSearching}
          className="w-11 h-11 bg-blue-600 hover:bg-blue-500 disabled:opacity-30 rounded-full flex items-center justify-center text-lg transition-colors shrink-0"
        >
          ↑
        </button>
      </div>
    </div>
  );
}
