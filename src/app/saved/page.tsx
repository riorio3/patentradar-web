'use client';

import Link from 'next/link';
import { usePatentStore } from '@/lib/stores/patents';

export default function SavedPage() {
  const { savedPatents, removePatent } = usePatentStore();

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-xl font-bold mb-6">Saved Patents</h1>

      {savedPatents.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🔖</div>
          <h2 className="text-lg font-semibold mb-2">No Saved Patents</h2>
          <p className="text-gray-400 text-sm mb-4">Patents you bookmark will appear here.</p>
          <Link href="/" className="text-blue-400 hover:underline text-sm">Browse Patents</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {savedPatents.map((patent) => (
            <div key={patent.id} className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 relative group">
              <Link href={`/patent/${patent.caseNumber}`}>
                {patent.imageURL ? (
                  <div className="aspect-[16/10] overflow-hidden bg-gray-800">
                    <img src={patent.imageURL} alt={patent.title} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                ) : (
                  <div className="aspect-[16/10] bg-gradient-to-br from-blue-900/40 to-purple-900/40 flex items-center justify-center">
                    <span className="text-4xl opacity-60">🛰️</span>
                  </div>
                )}
                <div className="p-3">
                  <p className="text-xs text-blue-400 mb-1">{patent.category}</p>
                  <h3 className="text-sm font-semibold line-clamp-2">{patent.title}</h3>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-2">{patent.description}</p>
                </div>
              </Link>
              <button
                onClick={() => removePatent(patent)}
                className="absolute top-2 right-2 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                title="Remove"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
