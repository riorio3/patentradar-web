import { Patent, ElasticSearchResult, NASASearchResponse, PatentDetail } from '@/types';

const BASE_URL = '/api/nasa';

function cleanHTMLText(text: string): string {
  return text
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\\n/g, ' ')
    .trim();
}

function elasticToPatent(result: ElasticSearchResult): Patent | null {
  const src = result._source;
  if (!src.title) return null;

  let imageURL: string | undefined;
  if (src.img1) {
    imageURL = src.img1.startsWith('http') ? src.img1 : `https://technology.nasa.gov${src.img1}`;
  }

  let desc = src.abstract ?? '';
  if (src.tech_desc && !desc.includes(src.tech_desc.substring(0, 50))) {
    desc += desc ? `\n\n${src.tech_desc}` : src.tech_desc;
  }

  return {
    id: result._id,
    title: src.title,
    description: desc,
    category: src.category ?? 'General',
    caseNumber: src.client_record_id ?? result._id,
    patentNumber: src.patent_number ?? undefined,
    imageURL,
    center: src.center ?? undefined,
    trl: src.trl ?? undefined,
  };
}

export async function browsePatents(categorySlug: string): Promise<Patent[]> {
  const res = await fetch(`${BASE_URL}?action=browse&slug=${encodeURIComponent(categorySlug)}`);
  if (!res.ok) throw new Error('Failed to fetch patents');
  const data: ElasticSearchResult[] = await res.json();
  return data.map(elasticToPatent).filter((p): p is Patent => p !== null);
}

export async function searchPatents(query: string, page = 1): Promise<Patent[]> {
  const res = await fetch(`${BASE_URL}?action=search&query=${encodeURIComponent(query)}&page=${page}`);
  if (!res.ok) throw new Error('Failed to search patents');
  const data: NASASearchResponse = await res.json();

  return data.results.map((arr): Patent | null => {
    if (arr.length < 10) return null;
    const id = String(arr[0] ?? crypto.randomUUID());
    const caseNumber = String(arr[1] ?? '');
    let title = String(arr[2] ?? 'Untitled');
    let description = String(arr[3] ?? '');
    const category = String(arr[5] ?? 'General');
    const center = arr.length > 9 ? String(arr[9] ?? '') || undefined : undefined;
    const imageURL = arr.length > 10 ? String(arr[10] ?? '') || undefined : undefined;

    title = cleanHTMLText(title);
    description = cleanHTMLText(description);

    return { id, title, description, category, caseNumber, imageURL, center };
  }).filter((p): p is Patent => p !== null);
}

export async function getPatentDetail(caseNumber: string): Promise<PatentDetail> {
  const res = await fetch(`${BASE_URL}?action=detail&caseNumber=${encodeURIComponent(caseNumber)}`);
  if (!res.ok) throw new Error('Failed to fetch patent detail');
  return res.json();
}
