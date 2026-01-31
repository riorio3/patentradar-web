import { NextRequest, NextResponse } from 'next/server';
import { parsePatentDetail } from '@/lib/utils/html-parser';

const NASA_BASE = 'https://technology.nasa.gov';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action');

  try {
    if (action === 'browse') {
      const slug = searchParams.get('slug') ?? '';
      const url = `${NASA_BASE}/searchosapicat/multi/aw/patent/${slug}/1/200/`;
      const res = await fetch(url, { next: { revalidate: 300 } });
      if (!res.ok) return NextResponse.json([], { status: 200 });
      const data = await res.json();
      return NextResponse.json(data);
    }

    if (action === 'search') {
      const query = searchParams.get('query') ?? '';
      const page = searchParams.get('page') ?? '1';
      const url = `${NASA_BASE}/api/api/patent/${encodeURIComponent(query)}?page=${page}`;
      const res = await fetch(url, { next: { revalidate: 180 } });
      if (!res.ok) return NextResponse.json({ results: [], count: 0, total: 0, perpage: 0, page: 1 });
      const data = await res.json();
      return NextResponse.json(data);
    }

    if (action === 'detail') {
      const caseNumber = searchParams.get('caseNumber') ?? '';
      const url = `${NASA_BASE}/patent/${caseNumber}`;
      const res = await fetch(url, { next: { revalidate: 600 } });
      if (!res.ok) return NextResponse.json({ error: 'Not found' }, { status: 404 });
      const html = await res.text();
      const detail = parsePatentDetail(html, caseNumber);
      return NextResponse.json(detail);
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
