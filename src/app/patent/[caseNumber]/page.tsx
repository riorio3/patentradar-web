'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { getPatentDetail } from '@/lib/api/nasa';
import { analyzePatent } from '@/lib/api/anthropic';
import { usePatentStore } from '@/lib/stores/patents';
import { Patent, BusinessAnalysis } from '@/types';
import { BusinessAnalysisModal } from '@/components/business-analysis/modal';

function YouTubeThumbnail({ url }: { url: string }) {
  const videoId = url.match(/[?&]v=([^&]+)/)?.[1] ?? '';
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="relative block aspect-video bg-gray-800 rounded-lg overflow-hidden group"
    >
      <img
        src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
        alt="Video thumbnail"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-colors">
        <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center">
          <span className="text-white text-2xl ml-1">▶</span>
        </div>
      </div>
    </a>
  );
}

export default function PatentDetailPage() {
  const params = useParams();
  const caseNumber = decodeURIComponent(params.caseNumber as string);
  const store = usePatentStore();

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<BusinessAnalysis | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { data: detail, isLoading } = useQuery({
    queryKey: ['detail', caseNumber],
    queryFn: () => getPatentDetail(caseNumber),
  });

  // Build a Patent object for saving/analysis
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

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <div className="animate-spin text-3xl mb-4">✈️</div>
        <p className="text-gray-400">Loading details...</p>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="flex flex-col items-center py-32">
        <div className="text-4xl mb-4">⚠️</div>
        <p className="text-gray-400">Patent not found</p>
      </div>
    );
  }

  const images = detail.images;
  const videos = detail.videos;

  return (
    <>
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Media Gallery */}
        {(images.length > 0 || videos.length > 0) && (
          <div className="mb-6">
            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
                {images.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(url)}
                    className="aspect-video bg-gray-800 rounded-lg overflow-hidden"
                  >
                    <img src={url} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform" />
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
          <div className="aspect-[21/9] bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl flex items-center justify-center mb-6">
            <span className="text-6xl opacity-40">🛰️</span>
          </div>
        )}

        {/* Title */}
        <div className="mb-6">
          <p className="text-sm text-blue-400 mb-2">{detail.caseNumber}</p>
          <h1 className="text-2xl md:text-3xl font-bold mb-4">{detail.title}</h1>

          {/* Bookmark */}
          <button
            onClick={toggleSave}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isSaved ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {isSaved ? '🔖 Saved' : '🔖 Save Patent'}
          </button>
        </div>

        {/* Patent Numbers */}
        {detail.patentNumbers.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">US Patents ({detail.patentNumbers.length})</h2>
            <div className="flex flex-wrap gap-2">
              {detail.patentNumbers.map((num) => (
                <a
                  key={num}
                  href={`https://patents.google.com/patent/US${num}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-blue-900/30 text-blue-300 rounded-full text-xs font-mono hover:bg-blue-800/40 transition-colors"
                >
                  {num}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Description</h2>
          <p className="text-gray-300 whitespace-pre-line leading-relaxed">{detail.fullDescription || 'No description available.'}</p>
        </div>

        {/* Benefits */}
        {detail.benefits.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="text-green-400">✓</span> Benefits
            </h2>
            <ul className="space-y-2">
              {detail.benefits.map((b, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-300">
                  <span className="text-green-400 mt-0.5 text-sm">✓</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Applications */}
        {detail.applications.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="text-orange-400">💡</span> Applications
            </h2>
            <ul className="space-y-2">
              {detail.applications.map((a, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-300">
                  <span className="text-orange-400 mt-0.5 text-sm">→</span>
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* AI Analysis */}
        <div className="mb-6 p-5 bg-gray-900 rounded-xl border border-gray-800">
          <h2 className="text-lg font-semibold mb-3">Business Potential</h2>
          {analysisError && (
            <div className="mb-3 p-3 bg-orange-900/20 border border-orange-800 rounded-lg text-sm text-orange-300">
              {analysisError}
              {analysisError.includes('API key') && (
                <a href="/settings" className="block mt-1 text-blue-400 hover:underline">Add API Key in Settings</a>
              )}
            </div>
          )}
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            {isAnalyzing ? (
              <>
                <span className="animate-spin">⏳</span>
                Analyzing...
              </>
            ) : (
              <>
                <span>✨</span>
                Analyze with AI
              </>
            )}
          </button>
          <p className="text-xs text-gray-500 mt-2">Get AI-powered business ideas, market analysis, and an implementation roadmap</p>
        </div>

        {/* Licensing */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Licensing Options</h2>
          <div className="space-y-2">
            <div className="p-4 bg-blue-900/10 border border-blue-800/30 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium flex items-center gap-2">⭐ Startup NASA <span className="text-xs bg-green-900/40 text-green-400 px-2 py-0.5 rounded-full">FREE</span></p>
                  <p className="text-sm text-gray-400">Free for startups - up to 3 years</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-gray-900 rounded-lg border border-gray-800">
              <p className="font-medium">🔬 Research License</p>
              <p className="text-sm text-gray-400">12-month development & testing</p>
            </div>
            <div className="p-4 bg-gray-900 rounded-lg border border-gray-800">
              <p className="font-medium">🏢 Commercial License</p>
              <p className="text-sm text-gray-400">Full manufacturing rights</p>
            </div>
          </div>
          <a
            href="https://technology.nasa.gov/license"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 block text-center py-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors"
          >
            Start Licensing Application ↗
          </a>
        </div>

        {/* Links */}
        <div className="mb-10 space-y-2">
          <h2 className="text-lg font-semibold mb-3">More Information</h2>
          {detail.patentNumbers.length > 0 && (
            <a
              href={`https://patents.google.com/patent/US${detail.patentNumbers[0]}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 bg-gray-900 rounded-lg border border-gray-800 hover:border-gray-600 transition-colors text-sm text-blue-400"
            >
              <span>📄 View Full Patent (USPTO)</span>
              <span>↗</span>
            </a>
          )}
          <a
            href={`https://technology.nasa.gov/patent/${caseNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 bg-gray-900 rounded-lg border border-gray-800 hover:border-gray-600 transition-colors text-sm text-blue-400"
          >
            <span>🌐 View on NASA T2 Portal</span>
            <span>↗</span>
          </a>
        </div>
      </div>

      {/* Full screen image viewer */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button className="absolute top-4 right-4 text-white text-2xl z-10" onClick={() => setSelectedImage(null)}>✕</button>
          <img src={selectedImage} alt="" className="max-w-full max-h-full object-contain" />
        </div>
      )}

      {/* Business Analysis Modal */}
      {showAnalysis && analysis && (
        <BusinessAnalysisModal
          analysis={analysis}
          patent={patent}
          onClose={() => setShowAnalysis(false)}
        />
      )}
    </>
  );
}
