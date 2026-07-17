'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { extractSearchTerms, findPatentsForProblem } from '@/lib/api/anthropic';
import { searchPatents } from '@/lib/api/nasa';
import { usePatentStore } from '@/lib/stores/patents';
import { Patent, ProblemSolution, PatentMatch } from '@/types';
import { LightbulbIcon, SatelliteIcon, WarningIcon, SparklesIcon, SearchIcon, ClockIcon } from '@/components/icons';

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
  const scoreColor = match.relevanceScore >= 80 ? 'bg-emerald-600' : match.relevanceScore >= 70 ? 'bg-blue-600' : 'bg-orange-600';
  return (
    <Link
      href={`/patent/${patent.caseNumber}`}
      className="block p-4 bg-[var(--surface)] rounded-xl card-glow border border-[var(--border)]"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="font-semibold text-sm line-clamp-2">{patent.title}</h3>
        <span className={`${scoreColor} text-white text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0`}>
          {match.relevanceScore}%
        </span>
      </div>
      <p className="text-xs text-[var(--muted)] line-clamp-2 mb-3">{match.explanation}</p>
      <div className="flex items-center gap-2 p-2.5 bg-yellow-600/5 border border-yellow-500/10 rounded-lg text-xs">
        <span className="text-yellow-400 shrink-0"><LightbulbIcon size={13} /></span>
        <span className="line-clamp-1 text-[var(--foreground)]/70">{match.applicationIdea}</span>
      </div>
    </Link>
  );
}

export default function ProblemSolverPage() {
  const store = usePatentStore();
  const [input, setInput] = useState('');
  const [submittedProblem, setSubmittedProblem] = useState('');
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
    const problem = input.trim();
    if (!problem || isSearching) return;
    if (!store.apiKey) {
      setError('Please add your Claude API key in Settings');
      return;
    }

    setIsSearching(true);
    setError(null);
    setSolution(null);
    setMatchedPatents([]);
    setSubmittedProblem(problem);
    setInput('');

    try {
      setSearchPhase('Analyzing problem...');
      const keywords = await extractSearchTerms(problem, store.apiKey);

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
          problem,
          summary: 'No patents found. Try different keywords.',
          matches: [],
          additionalSuggestions: 'Break down your problem into specific technical terms.',
        });
        setIsSearching(false);
        return;
      }

      setSearchPhase('Finding solutions...');
      const result = await findPatentsForProblem(problem, uniquePatents, store.apiKey);
      setSolution(result);
      store.addProblemEntry({ problem, solution: result, matchedPatents: uniquePatents });
    } catch (e) {
      setError(String(e instanceof Error ? e.message : e));
    }
    setIsSearching(false);
  };

  const reset = () => {
    setInput('');
    setSubmittedProblem('');
    setSolution(null);
    setMatchedPatents([]);
    setError(null);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 flex flex-col min-h-[calc(100vh-5rem)] md:min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-lg font-bold tracking-tight">Problem Solver</h1>
        <div className="flex gap-2">
          {store.problemHistory.length > 0 && (
            <button onClick={() => setShowHistory(!showHistory)} className="text-xs text-[var(--muted)] hover:text-[var(--foreground)] px-3 py-1.5 bg-[var(--surface)] border border-[var(--border)] rounded-lg flex items-center gap-1.5 transition-colors">
              <ClockIcon size={13} /> History
            </button>
          )}
          {(solution || error) && (
            <button onClick={reset} className="text-xs text-[var(--muted)] hover:text-[var(--foreground)] px-3 py-1.5 bg-[var(--surface)] border border-[var(--border)] rounded-lg transition-colors">
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-y-auto mb-4">
        {!showHistory && submittedProblem && (
          <div className="flex justify-end mb-5">
            <div className="max-w-[85%] bg-blue-600 text-white rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm whitespace-pre-wrap break-words shadow-md shadow-blue-600/10">
              {submittedProblem}
            </div>
          </div>
        )}
        {showHistory ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-semibold text-sm">Search History</h2>
              <button onClick={() => store.clearProblemHistory()} className="text-[11px] text-red-400 hover:text-red-300 transition-colors">Clear All</button>
            </div>
            {store.problemHistory.map((entry) => (
              <button
                key={entry.id}
                onClick={() => {
                  setInput('');
                  setSubmittedProblem(entry.problem);
                  setSolution(entry.solution);
                  setMatchedPatents(entry.matchedPatents);
                  setShowHistory(false);
                }}
                className="w-full text-left p-4 bg-[var(--surface)] rounded-xl border border-[var(--border)] hover:border-[var(--border-hover)] transition-all duration-200"
              >
                <p className="font-medium text-sm line-clamp-2">{entry.problem}</p>
                <p className="text-xs text-[var(--muted)] mt-1.5 line-clamp-2">{entry.solution.summary}</p>
                <div className="flex items-center justify-between mt-2.5">
                  <span className="text-xs text-blue-400 font-medium">{entry.solution.matches.length} patents</span>
                  <span className="text-[11px] text-[var(--muted)]">{new Date(entry.date).toLocaleDateString()}</span>
                </div>
              </button>
            ))}
          </div>
        ) : !solution && !isSearching && !error ? (
          <div className="text-center py-14">
            <div className="mb-5 flex justify-center">
              <div className="w-16 h-16 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center">
                <LightbulbIcon size={28} className="text-blue-400" />
              </div>
            </div>
            <h2 className="text-xl font-bold mb-2 tracking-tight">Find Patent Solutions</h2>
            <p className="text-[var(--muted)] text-sm mb-8">Describe your challenge and AI will find patents that could help</p>
            <div className="text-left space-y-2">
              <p className="text-[10px] font-semibold text-[var(--muted)] uppercase tracking-widest mb-2">Try these</p>
              {examplePrompts.map((p) => (
                <button
                  key={p}
                  onClick={() => setInput(p)}
                  className="w-full text-left p-3.5 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-sm hover:border-[var(--border-hover)] transition-all duration-200"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        ) : isSearching ? (
          <div className="flex flex-col items-center py-20">
            <div className="animate-spin mb-4 text-blue-400"><SatelliteIcon size={24} /></div>
            <p className="text-[var(--muted)] text-sm">{searchPhase}</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center py-20 text-center">
            <div className="w-14 h-14 rounded-2xl bg-red-600/10 border border-red-500/20 flex items-center justify-center mb-4">
              <WarningIcon size={24} className="text-red-400" />
            </div>
            <p className="text-[var(--muted)] text-sm">{error}</p>
            {error.includes('API key') && (
              <Link href="/settings" className="mt-2 text-blue-400 text-sm hover:underline">Add API Key in Settings</Link>
            )}
            <button onClick={handleSearch} className="mt-4 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-sm font-medium transition-colors">Try Again</button>
          </div>
        ) : solution ? (
          <div className="space-y-5">
            <div className="p-4 bg-blue-600/5 border border-blue-500/10 rounded-xl">
              <p className="text-sm font-semibold flex items-center gap-2 mb-2">
                <SparklesIcon size={15} className="text-blue-400" /> AI Analysis
              </p>
              <p className="text-sm text-[var(--foreground)]/80 leading-relaxed">{solution.summary}</p>
            </div>

            {solution.matches.length > 0 ? (
              <>
                <p className="text-xs font-semibold text-[var(--muted)] uppercase tracking-widest">Matching Patents</p>
                {solution.matches.map((match, i) => {
                  const patent = matchedPatents[match.patentIndex];
                  if (!patent) return null;
                  return <MatchCard key={i} patent={patent} match={match} />;
                })}
              </>
            ) : (
              <div className="text-center py-8">
                <SearchIcon size={24} className="mx-auto text-[var(--muted)] mb-2" />
                <p className="text-sm text-[var(--muted)]">No matching patents found. Try rephrasing your problem.</p>
              </div>
            )}

            {solution.additionalSuggestions && (
              <div className="p-4 bg-yellow-600/5 border border-yellow-500/10 rounded-xl">
                <p className="text-sm font-semibold flex items-center gap-2 mb-1">
                  <LightbulbIcon size={14} className="text-yellow-400" /> Tip
                </p>
                <p className="text-xs text-[var(--muted)]">{solution.additionalSuggestions}</p>
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* Input */}
      <div className="flex gap-2 items-center sticky bottom-20 md:bottom-4 bg-[var(--background)] py-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Describe your problem..."
          className="flex-1 bg-[var(--surface)] border border-[var(--border)] rounded-full px-5 py-3 text-base sm:text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all duration-200 placeholder:text-[var(--muted)]/50"
        />
        <button
          onClick={handleSearch}
          disabled={!input.trim() || isSearching}
          className="w-11 h-11 bg-blue-600 hover:bg-blue-500 disabled:opacity-30 rounded-full flex items-center justify-center text-lg transition-all duration-200 shrink-0 shadow-md shadow-blue-600/10"
        >
          {'↑'}
        </button>
      </div>
    </div>
  );
}
