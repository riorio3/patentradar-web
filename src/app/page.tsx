'use client';

import { Suspense, useState, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { browsePatents, browseAllPatents, searchPatents } from '@/lib/api/nasa';
import { CATEGORIES } from '@/lib/utils/categories';
import { Patent, CategoryConfig } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { SatelliteIcon, SparklesIcon, WarningIcon, SearchIcon, GridIcon } from '@/components/icons';

function SkeletonCard() {
  return (
    <div className="rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--surface)]">
      <div className="aspect-[16/10] skeleton" />
      <div className="p-4 space-y-2.5">
        <div className="skeleton h-3 w-16" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-3 w-3/4" />
      </div>
    </div>
  );
}

function PatentCard({ patent, fromCategory }: { patent: Patent; fromCategory?: string }) {
  const href = fromCategory
    ? `/patent/${patent.caseNumber}?from=${encodeURIComponent(fromCategory)}`
    : `/patent/${patent.caseNumber}`;
  return (
    <Link
      href={href}
      className="group block rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--surface)] card-glow"
    >
      {patent.imageURL ? (
        <div className="aspect-[16/10] overflow-hidden bg-[#0d1320] relative">
          <Image
            src={patent.imageURL}
            alt={patent.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="aspect-[16/10] bg-gradient-to-br from-blue-950/60 to-indigo-950/60 flex items-center justify-center">
          <span className="opacity-30"><SatelliteIcon size={36} /></span>
        </div>
      )}
      <div className="p-4">
        <p className="text-[11px] font-medium text-blue-400/80 mb-1.5 uppercase tracking-wide">{patent.category}</p>
        <h3 className="text-sm font-semibold line-clamp-2 group-hover:text-blue-300 transition-colors leading-snug">
          {patent.title}
        </h3>
        <p className="text-xs text-[var(--muted)] mt-1.5 line-clamp-2 leading-relaxed">{patent.description}</p>
        {patent.center && (
          <p className="text-[10px] text-[var(--muted)]/60 mt-2.5 font-medium">{patent.center}</p>
        )}
      </div>
    </Link>
  );
}

function CategoryGrid({ onSelect }: { onSelect: (cat: CategoryConfig) => void }) {
  return (
    <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-2">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.key}
          onClick={() => onSelect(cat)}
          className="flex flex-col items-center gap-2 p-3.5 rounded-xl transition-all duration-200 hover:scale-[1.03] border border-transparent hover:border-[var(--border)]"
          style={{ backgroundColor: `${cat.color}08` }}
        >
          <span className="text-sm font-bold" style={{ color: cat.color }}>{cat.icon}</span>
          <span className="text-[11px] font-medium" style={{ color: cat.color }}>{cat.shortName}</span>
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
    <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none px-1">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.key}
          onClick={() => onSelect(cat)}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 ${
            selected.key === cat.key
              ? 'text-white shadow-md'
              : 'bg-[var(--surface)] text-[var(--muted)] border border-[var(--border)] hover:border-[var(--border-hover)] hover:text-[var(--foreground)]'
          }`}
          style={selected.key === cat.key ? { backgroundColor: cat.color, boxShadow: `0 4px 12px ${cat.color}30` } : undefined}
        >
          <span>{cat.icon}</span>
          <span>{cat.shortName}</span>
        </button>
      ))}
    </div>
  );
}

function DiscoveryPageInner() {
  const searchParams = useSearchParams();
  const initialCategoryKey = searchParams.get('category');
  const initialCategory =
    CATEGORIES.find((c) => c.key === initialCategoryKey) ?? CATEGORIES[0];

  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryConfig>(initialCategory);
  const [hasSearched, setHasSearched] = useState(!!initialCategoryKey);

  const allSlugs = useMemo(
    () => CATEGORIES.filter(c => c.apiSlug).map(c => c.apiSlug!),
    []
  );

  const browseQuery = useQuery({
    queryKey: ['browse', selectedCategory.key],
    queryFn: () => {
      if (selectedCategory.apiSlug === null) {
        return browseAllPatents(allSlugs);
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

  const resultCount = patents?.length ?? 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Search bar */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          {hasSearched && (
            <button
              type="button"
              onClick={goHome}
              aria-label="Back to categories"
              className="flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--border-hover)] text-[var(--muted)] hover:text-[var(--foreground)] shrink-0 transition-all duration-200"
            >
              <GridIcon size={16} />
            </button>
          )}
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search NASA patents..."
              className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl pl-10 pr-4 py-2.5 text-base sm:text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all duration-200 placeholder:text-[var(--muted)]/50"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]/50"><SearchIcon size={16} /></span>
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-sm font-medium transition-all duration-200 shadow-md shadow-blue-600/10 hover:shadow-blue-500/20"
          >
            Search
          </button>
        </div>
      </form>

      {/* Category pills (when browsing) */}
      {hasSearched && !activeSearch && (
        <div className="mb-5">
          <CategoryPills selected={selectedCategory} onSelect={handleCategorySelect} />
        </div>
      )}

      {/* Result count */}
      {hasSearched && !isLoading && !error && patents && patents.length > 0 && (
        <p className="text-xs text-[var(--muted)] mb-4 font-medium">
          {resultCount} patent{resultCount !== 1 ? 's' : ''} found
          {activeSearch ? ` for "${activeSearch}"` : ` in ${selectedCategory.displayName}`}
        </p>
      )}

      {/* Content */}
      {!hasSearched ? (
        <div className="text-center py-16">
          <div className="mb-5 flex justify-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center">
              <SparklesIcon size={28} className="text-blue-400" />
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-2 tracking-tight">Explore NASA Patents</h1>
          <p className="text-[var(--muted)] mb-10 text-sm max-w-md mx-auto">Search and discover 600+ government patents available for licensing</p>
          <CategoryGrid onSelect={handleCategorySelect} />
        </div>
      ) : isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center py-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-red-600/10 border border-red-500/20 flex items-center justify-center mb-4">
            <WarningIcon size={24} className="text-red-400" />
          </div>
          <p className="text-[var(--muted)] text-sm mb-4">{String(error)}</p>
          <button
            onClick={() => activeSearch ? searchQueryResult.refetch() : browseQuery.refetch()}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-sm font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : patents && patents.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center mb-4">
            <SearchIcon size={24} className="text-[var(--muted)]" />
          </div>
          <h2 className="text-base font-semibold mb-1">No patents found</h2>
          <p className="text-[var(--muted)] text-sm">Try a different search term or category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {patents?.map((patent) => (
            <PatentCard
              key={patent.id}
              patent={patent}
              fromCategory={!activeSearch ? selectedCategory.key : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function DiscoveryPage() {
  return (
    <Suspense fallback={null}>
      <DiscoveryPageInner />
    </Suspense>
  );
}
