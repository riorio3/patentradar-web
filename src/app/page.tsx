'use client';

import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { browsePatents, searchPatents } from '@/lib/api/nasa';
import { CATEGORIES } from '@/lib/utils/categories';
import { Patent, CategoryConfig } from '@/types';
import Link from 'next/link';

function PatentCard({ patent }: { patent: Patent }) {
  return (
    <Link
      href={`/patent/${patent.caseNumber}`}
      className="group block bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-gray-600 transition-colors"
    >
      {patent.imageURL ? (
        <div className="aspect-[16/10] overflow-hidden bg-gray-800">
          <img
            src={patent.imageURL}
            alt={patent.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="aspect-[16/10] bg-gradient-to-br from-blue-900/40 to-purple-900/40 flex items-center justify-center">
          <span className="text-4xl opacity-60">🛰️</span>
        </div>
      )}
      <div className="p-3">
        <p className="text-xs text-blue-400 mb-1">{patent.category}</p>
        <h3 className="text-sm font-semibold line-clamp-2 group-hover:text-blue-300 transition-colors">
          {patent.title}
        </h3>
        <p className="text-xs text-gray-400 mt-1 line-clamp-2">{patent.description}</p>
        {patent.center && (
          <p className="text-[10px] text-gray-500 mt-2">{patent.center}</p>
        )}
      </div>
    </Link>
  );
}

function CategoryGrid({ onSelect }: { onSelect: (cat: CategoryConfig) => void }) {
  return (
    <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-3">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.key}
          onClick={() => onSelect(cat)}
          className="flex flex-col items-center gap-1.5 p-3 rounded-xl transition-colors hover:bg-gray-800"
          style={{ backgroundColor: `${cat.color}15` }}
        >
          <span className="text-2xl">{cat.icon}</span>
          <span className="text-xs font-medium" style={{ color: cat.color }}>{cat.shortName}</span>
        </button>
      ))}
    </div>
  );
}

function CategoryPills({
  selected,
  onSelect,
}: {
  selected: CategoryConfig;
  onSelect: (cat: CategoryConfig) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none px-1">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.key}
          onClick={() => onSelect(cat)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
            selected.key === cat.key
              ? 'text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
          style={selected.key === cat.key ? { backgroundColor: cat.color } : undefined}
        >
          <span>{cat.icon}</span>
          <span>{cat.shortName}</span>
        </button>
      ))}
    </div>
  );
}

export default function DiscoveryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryConfig>(CATEGORIES[0]);
  const [hasSearched, setHasSearched] = useState(false);

  const browseQuery = useQuery({
    queryKey: ['browse', selectedCategory.key],
    queryFn: () => {
      if (selectedCategory.apiSlug === null) {
        // "All" - fetch a few categories in parallel
        return Promise.all(
          CATEGORIES.filter(c => c.apiSlug).slice(0, 5).map(c => browsePatents(c.apiSlug!))
        ).then(results => {
          const seen = new Set<string>();
          return results.flat().filter(p => { if (seen.has(p.id)) return false; seen.add(p.id); return true; })
            .sort((a, b) => a.title.localeCompare(b.title));
        });
      }
      return browsePatents(selectedCategory.apiSlug!);
    },
    enabled: hasSearched && !activeSearch,
  });

  const searchQueryResult = useQuery({
    queryKey: ['search', activeSearch],
    queryFn: () => searchPatents(activeSearch),
    enabled: !!activeSearch,
  });

  const patents = activeSearch ? searchQueryResult.data : browseQuery.data;
  const isLoading = activeSearch ? searchQueryResult.isLoading : browseQuery.isLoading;
  const error = activeSearch ? searchQueryResult.error : browseQuery.error;

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      setActiveSearch(q);
      setHasSearched(true);
    }
  }, [searchQuery]);

  const handleCategorySelect = useCallback((cat: CategoryConfig) => {
    setSelectedCategory(cat);
    setActiveSearch('');
    setHasSearched(true);
  }, []);

  const goHome = useCallback(() => {
    setSearchQuery('');
    setActiveSearch('');
    setHasSearched(false);
    setSelectedCategory(CATEGORIES[0]);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Search bar */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          {hasSearched && (
            <button
              type="button"
              onClick={goHome}
              className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 shrink-0"
            >
              ⊞
            </button>
          )}
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search patents..."
              className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium transition-colors"
          >
            Search
          </button>
        </div>
      </form>

      {/* Category pills (when browsing) */}
      {hasSearched && !activeSearch && (
        <div className="mb-4">
          <CategoryPills selected={selectedCategory} onSelect={handleCategorySelect} />
        </div>
      )}

      {/* Content */}
      {!hasSearched ? (
        // Welcome view
        <div className="text-center py-12">
          <div className="text-5xl mb-4">✨</div>
          <h1 className="text-2xl font-bold mb-2">Explore Patents</h1>
          <p className="text-gray-400 mb-8">Search 600+ government patents available for licensing</p>
          <CategoryGrid onSelect={handleCategorySelect} />
        </div>
      ) : isLoading ? (
        <div className="flex flex-col items-center py-20">
          <div className="animate-spin text-3xl mb-4">🛰️</div>
          <p className="text-gray-400">Searching patents...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center py-20 text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <p className="text-gray-400">{String(error)}</p>
          <button
            onClick={() => hasSearched && browseQuery.refetch()}
            className="mt-4 px-4 py-2 bg-blue-600 rounded-lg text-sm"
          >
            Try Again
          </button>
        </div>
      ) : patents && patents.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-center">
          <div className="text-4xl mb-4">🔍</div>
          <h2 className="text-lg font-semibold mb-1">No patents found</h2>
          <p className="text-gray-400 text-sm">Try a different search term or category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {patents?.map((patent) => (
            <PatentCard key={patent.id} patent={patent} />
          ))}
        </div>
      )}
    </div>
  );
}
