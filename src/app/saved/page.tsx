'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePatentStore } from '@/lib/stores/patents';
import { BookmarkIcon, SatelliteIcon } from '@/components/icons';

export default function SavedPage() {
  const { savedPatents, removePatent } = usePatentStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-bold tracking-tight">Saved Patents</h1>
        {savedPatents.length > 0 && (
          <span className="text-xs text-[var(--muted)] font-medium">{savedPatents.length} saved</span>
        )}
      </div>

      {savedPatents.length === 0 ? (
        <div className="text-center py-20">
          <div className="mb-5 flex justify-center">
            <div className="w-16 h-16 rounded-2xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center">
              <BookmarkIcon size={28} className="text-[var(--muted)]" />
            </div>
          </div>
          <h2 className="text-base font-semibold mb-1.5">No Saved Patents</h2>
          <p className="text-[var(--muted)] text-sm mb-5">Patents you bookmark will appear here</p>
          <Link href="/" className="text-blue-400 hover:underline text-sm font-medium">Browse Patents</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {savedPatents.map((patent) => (
            <div key={patent.id} className="rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--surface)] relative group card-glow">
              <Link href={`/patent/${patent.caseNumber}`}>
                {patent.imageURL ? (
                  <div className="aspect-[16/10] overflow-hidden bg-[#0d1320] relative">
                    <Image src={patent.imageURL} alt={patent.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-cover" loading="lazy" />
                  </div>
                ) : (
                  <div className="aspect-[16/10] bg-gradient-to-br from-blue-950/60 to-indigo-950/60 flex items-center justify-center">
                    <span className="opacity-30"><SatelliteIcon size={36} /></span>
                  </div>
                )}
                <div className="p-4">
                  <p className="text-[11px] text-blue-400/80 mb-1.5 uppercase tracking-wide font-medium">{patent.category}</p>
                  <h3 className="text-sm font-semibold line-clamp-2">{patent.title}</h3>
                  <p className="text-xs text-[var(--muted)] mt-1.5 line-clamp-2 leading-relaxed">{patent.description}</p>
                </div>
              </Link>
              <button
                onClick={() => removePatent(patent)}
                className="absolute top-2.5 right-2.5 w-8 h-8 bg-black/50 hover:bg-red-600 rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-all duration-200 backdrop-blur-sm"
                title="Remove"
              >
                &#10005;
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
