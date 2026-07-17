'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, lazy, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { getPatentDetail } from '@/lib/api/nasa';
import { analyzePatent } from '@/lib/api/anthropic';
import { usePatentStore } from '@/lib/stores/patents';
import { Patent, BusinessAnalysis } from '@/types';
import Image from 'next/image';
import { SatelliteIcon, WarningIcon, BookmarkIcon, CheckIcon, LightbulbIcon, SparklesIcon, HourglassIcon, StarIcon, MicroscopeIcon, BuildingIcon, DocumentIcon, GlobeIcon } from '@/components/icons';

const BusinessAnalysisModal = lazy(() =>
  import('@/components/business-analysis/modal').then(m => ({ default: m.BusinessAnalysisModal }))
);

function DetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div className="skeleton h-4 w-16" />
      <div className="skeleton aspect-[21/9] rounded-xl" />
      <div className="space-y-3">
        <div className="skeleton h-3 w-24" />
        <div className="skeleton h-8 w-3/4" />
        <div className="skeleton h-10 w-32 rounded-lg" />
      </div>
      <div className="space-y-2">
        <div className="skeleton h-5 w-28" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-2/3" />
      </div>
    </div>
  );
}

function YouTubeThumbnail({ url }: { url: string }) {
  const videoId = url.match(/[?&]v=([^&]+)/)?.[1] ?? '';
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="relative block aspect-video bg-[#0d1320] rounded-xl overflow-hidden group"
    >
      <Image
        src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
        alt="Video thumbnail"
        fill
        sizes="(max-width: 768px) 100vw, 672px"
        className="object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-colors">
        <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-lg shadow-red-600/30">
          <span className="text-white text-2xl ml-1">&#9654;</span>
        </div>
      </div>
    </a>
  );
}

function SectionTitle({ children, icon }: { children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
      {icon}
      {children}
    </h2>
  );
}

function PatentDetailPageInner() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromCategory = searchParams.get('from');
  const caseNumber = decodeURIComponent(params.caseNumber as string);
  const store = usePatentStore();

  const handleBack = () => {
    if (fromCategory) {
      router.push(`/?category=${encodeURIComponent(fromCategory)}`);
      return;
    }
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<BusinessAnalysis | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const closeImage = useCallback(() => setSelectedImage(null), []);

  useEffect(() => {
    if (!selectedImage) return;
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') closeImage(); };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [selectedImage, closeImage]);

  const { data: detail, isLoading } = useQuery({
    queryKey: ['detail', caseNumber],
    queryFn: () => getPatentDetail(caseNumber),
  });

  const patent: Patent = {
    id: caseNumber,
    title: detail?.title ?? caseNumber,
    description: detail?.fullDescription ?? '',
    category: '',
    caseNumber,
  };

  const isSaved = store.savedPatents.some(p => p.caseNumber === caseNumber);

  const toggleSave = () => {
    if (isSaved) {
      store.removePatent(patent);
    } else {
      store.savePatent(patent);
    }
  };

  const handleAnalyze = async () => {
    if (!store.apiKey) {
      setAnalysisError('Please add your Claude API key in Settings');
      return;
    }
    setIsAnalyzing(true);
    setAnalysisError(null);
    try {
      const result = await analyzePatent(patent, store.apiKey);
      setAnalysis(result);
      store.addAnalysisEntry(patent, result);
      setShowAnalysis(true);
    } catch (e) {
      setAnalysisError(String(e instanceof Error ? e.message : e));
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (isLoading) return <DetailSkeleton />;

  if (!detail) {
    return (
      <div className="flex flex-col items-center py-32">
        <div className="w-14 h-14 rounded-2xl bg-red-600/10 border border-red-500/20 flex items-center justify-center mb-4">
          <WarningIcon size={24} className="text-red-400" />
        </div>
        <p className="text-[var(--muted)]">Patent not found</p>
      </div>
    );
  }

  const images = detail.images;
  const videos = detail.videos;

  return (
    <>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        {/* Back */}
        <button
          onClick={handleBack}
          className="mb-5 inline-flex items-center gap-1.5 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          aria-label="Go back"
        >
          <span aria-hidden="true" className="text-base leading-none">{'‹'}</span>
          <span>Back</span>
        </button>

        {/* Media Gallery */}
        {(images.length > 0 || videos.length > 0) && (
          <div className="mb-8">
            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
                {images.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(url)}
                    className="aspect-video bg-[#0d1320] rounded-xl overflow-hidden relative"
                  >
                    <Image
                      src={url}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 50vw, 224px"
                      className="object-cover hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            )}
            {videos.map((url, i) => (
              <YouTubeThumbnail key={i} url={url} />
            ))}
          </div>
        )}

        {images.length === 0 && videos.length === 0 && (
          <div className="aspect-[21/9] bg-gradient-to-br from-blue-950/40 to-indigo-950/40 rounded-xl flex items-center justify-center mb-8 border border-[var(--border)]">
            <span className="opacity-20"><SatelliteIcon size={56} /></span>
          </div>
        )}

        {/* Title */}
        <div className="mb-8">
          <p className="text-xs text-blue-400/70 mb-2 font-mono">{detail.caseNumber}</p>
          <h1 className="text-2xl md:text-3xl font-bold mb-4 tracking-tight leading-tight">{detail.title}</h1>

          <button
            onClick={toggleSave}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              isSaved
                ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20'
                : 'bg-[var(--surface)] text-[var(--muted)] border border-[var(--border)] hover:border-[var(--border-hover)] hover:text-[var(--foreground)]'
            }`}
          >
            <BookmarkIcon size={15} /> {isSaved ? 'Saved' : 'Save Patent'}
          </button>
        </div>

        {/* Patent Numbers */}
        {detail.patentNumbers.length > 0 && (
          <div className="mb-8">
            <SectionTitle>US Patents ({detail.patentNumbers.length})</SectionTitle>
            <div className="flex flex-wrap gap-2">
              {detail.patentNumbers.map((num) => (
                <a
                  key={num}
                  href={`https://patents.google.com/patent/US${num}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-blue-600/10 text-blue-400 rounded-lg text-xs font-mono border border-blue-500/10 hover:border-blue-500/30 transition-colors"
                >
                  {num}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        <div className="mb-8">
          <SectionTitle>Description</SectionTitle>
          <p className="text-[var(--foreground)]/80 whitespace-pre-line leading-relaxed text-[15px]">{detail.fullDescription || 'No description available.'}</p>
        </div>

        {/* Benefits */}
        {detail.benefits.length > 0 && (
          <div className="mb-8">
            <SectionTitle icon={<span className="text-emerald-400"><CheckIcon size={16} /></span>}>Benefits</SectionTitle>
            <ul className="space-y-2.5">
              {detail.benefits.map((b, i) => (
                <li key={i} className="flex items-start gap-2.5 text-[var(--foreground)]/80">
                  <span className="text-emerald-400 mt-1 shrink-0"><CheckIcon size={13} /></span>
                  <span className="text-[15px]">{b}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Applications */}
        {detail.applications.length > 0 && (
          <div className="mb-8">
            <SectionTitle icon={<span className="text-orange-400"><LightbulbIcon size={16} /></span>}>Applications</SectionTitle>
            <ul className="space-y-2.5">
              {detail.applications.map((a, i) => (
                <li key={i} className="flex items-start gap-2.5 text-[var(--foreground)]/80">
                  <span className="text-orange-400 mt-1 text-sm shrink-0">&rarr;</span>
                  <span className="text-[15px]">{a}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* AI Analysis */}
        <div className="mb-8 p-5 bg-[var(--surface)] rounded-xl border border-[var(--border)]">
          <SectionTitle icon={<SparklesIcon size={16} className="text-blue-400" />}>Business Potential</SectionTitle>
          {analysisError && (
            <div className="mb-4 p-3.5 bg-orange-600/5 border border-orange-500/15 rounded-xl text-sm text-orange-300">
              {analysisError}
              {analysisError.includes('API key') && (
                <a href="/settings" className="block mt-1.5 text-blue-400 hover:underline text-xs">Add API Key in Settings</a>
              )}
            </div>
          )}
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-md shadow-blue-600/10"
          >
            {isAnalyzing ? (
              <>
                <span className="animate-spin"><HourglassIcon size={16} /></span>
                Analyzing...
              </>
            ) : (
              <>
                <SparklesIcon size={16} />
                Analyze with AI
              </>
            )}
          </button>
          <p className="text-[11px] text-[var(--muted)] mt-2.5">AI-powered business ideas, market analysis, and implementation roadmap</p>
        </div>

        {/* Licensing */}
        <div className="mb-8">
          <SectionTitle>Licensing Options</SectionTitle>
          <div className="space-y-2">
            <div className="p-4 bg-blue-600/5 border border-blue-500/10 rounded-xl">
              <p className="font-medium flex items-center gap-2 text-sm">
                <StarIcon size={15} className="text-yellow-400" />
                Startup NASA
                <span className="text-[10px] bg-emerald-600/15 text-emerald-400 px-2 py-0.5 rounded-full font-semibold">FREE</span>
              </p>
              <p className="text-xs text-[var(--muted)] mt-1">Free for startups &mdash; up to 3 years</p>
            </div>
            <div className="p-4 bg-[var(--surface)] rounded-xl border border-[var(--border)]">
              <p className="font-medium flex items-center gap-2 text-sm"><MicroscopeIcon size={15} /> Research License</p>
              <p className="text-xs text-[var(--muted)] mt-1">12-month development &amp; testing</p>
            </div>
            <div className="p-4 bg-[var(--surface)] rounded-xl border border-[var(--border)]">
              <p className="font-medium flex items-center gap-2 text-sm"><BuildingIcon size={15} /> Commercial License</p>
              <p className="text-xs text-[var(--muted)] mt-1">Full manufacturing rights</p>
            </div>
          </div>
          <a
            href="https://technology.nasa.gov/license"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 block text-center py-3 bg-[var(--surface)] hover:bg-[var(--surface-hover)] border border-[var(--border)] rounded-xl text-sm transition-all duration-200"
          >
            Start Licensing Application {'↗'}
          </a>
        </div>

        {/* Links */}
        <div className="mb-10 space-y-2">
          <SectionTitle>More Information</SectionTitle>
          {detail.patentNumbers.length > 0 && (
            <a
              href={`https://patents.google.com/patent/US${detail.patentNumbers[0]}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3.5 bg-[var(--surface)] rounded-xl border border-[var(--border)] hover:border-[var(--border-hover)] transition-all duration-200 text-sm text-blue-400"
            >
              <span className="flex items-center gap-2"><DocumentIcon size={15} /> View Full Patent (USPTO)</span>
              <span className="text-[var(--muted)]">{'↗'}</span>
            </a>
          )}
          <a
            href={`https://technology.nasa.gov/patent/${caseNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3.5 bg-[var(--surface)] rounded-xl border border-[var(--border)] hover:border-[var(--border-hover)] transition-all duration-200 text-sm text-blue-400"
          >
            <span className="flex items-center gap-2"><GlobeIcon size={15} /> View on NASA T2 Portal</span>
            <span className="text-[var(--muted)]">{'↗'}</span>
          </a>
        </div>
      </div>

      {/* Full screen image viewer */}
      {selectedImage && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
          onClick={closeImage}
        >
          <button className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors" onClick={closeImage} aria-label="Close image viewer">
            &#10005;
          </button>
          <img src={selectedImage} alt="" className="max-w-full max-h-full object-contain" />
        </div>
      )}

      {/* Business Analysis Modal */}
      {showAnalysis && analysis && (
        <Suspense fallback={null}>
          <BusinessAnalysisModal
            analysis={analysis}
            patent={patent}
            onClose={() => setShowAnalysis(false)}
          />
        </Suspense>
      )}
    </>
  );
}

export default function PatentDetailPage() {
  return (
    <Suspense fallback={<DetailSkeleton />}>
      <PatentDetailPageInner />
    </Suspense>
  );
}
