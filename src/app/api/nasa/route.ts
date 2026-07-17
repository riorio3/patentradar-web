import { NextRequest, NextResponse } from 'next/server';
import { parsePatentDetail } from '@/lib/utils/html-parser';

const NASA_BASE = 'https://technology.nasa.gov';

interface RawElasticResult {
  _id: string;
  _source: Record<string, unknown>;
}

function slimBrowseResult(r: RawElasticResult) {
  const s = r._source;
  return {
    _id: r._id,
    _source: {
      title: s.title,
      abstract: s.abstract,
      tech_desc: s.tech_desc,
      category: s.category,
      client_record_id: s.client_record_id,
      center: s.center,
      patent_number: s.patent_number,
      trl: s.trl,
      img1: s.img1,
    },
  };
}

function cachedResponse(data: unknown, maxAge: number) {
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': `public, s-maxage=${maxAge}, stale-while-revalidate=${maxAge * 2}`,
    },
  });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action');

  if (!action || !['browse', 'search', 'detail'].includes(action)) {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }

  try {
    if (action === 'browse') {
      const slug = searchParams.get('slug') ?? '';
      const slugs = slug.includes(',') ? slug.split(',').map(s => s.trim()).filter(Boolean) : [slug];

      if (slugs.length > 1) {
        const results = await Promise.allSettled(
          slugs.map(s => fetch(`${NASA_BASE}/searchosapicat/multi/aw/patent/${s}/1/200/`, { next: { revalidate: 600 } }).then(r => r.ok ? r.json() : []))
        );
        const merged = results
          .filter((r): r is PromiseFulfilledResult<RawElasticResult[]> => r.status === 'fulfilled')
          .flatMap(r => r.value)
          .map(slimBrowseResult);
        return cachedResponse(merged, 600);
      }

      const url = `${NASA_BASE}/searchosapicat/multi/aw/patent/${slug}/1/200/`;
      const res = await fetch(url, { next: { revalidate: 600 } });
      if (!res.ok) return cachedResponse([], 60);
      const data: RawElasticResult[] = await res.json();
      return cachedResponse(data.map(slimBrowseResult), 600);
    }

    if (action === 'search') {
      const query = searchParams.get('query') ?? '';
      const page = searchParams.get('page') ?? '1';
      const url = `${NASA_BASE}/api/api/patent/${encodeURIComponent(query)}?page=${page}`;
      const res = await fetch(url, { next: { revalidate: 300 } });
      if (!res.ok) return cachedResponse({ results: [], count: 0, total: 0, perpage: 0, page: 1 }, 60);
      const data = await res.json();
      return cachedResponse(data, 300);
    }

    if (action === 'detail') {
      const caseNumber = searchParams.get('caseNumber') ?? '';
      const url = `${NASA_BASE}/patent/${caseNumber}`;
      const res = await fetch(url, { next: { revalidate: 3600 } });
      if (!res.ok) return NextResponse.json({ error: 'Not found' }, { status: 404 });
      const html = await res.text();
      const detail = parsePatentDetail(html, caseNumber);
      return cachedResponse(detail, 3600);
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (e) {
    console.error('NASA API error:', e);
    return NextResponse.json({ error: 'An internal error occurred' }, { status: 500 });
  }
}
