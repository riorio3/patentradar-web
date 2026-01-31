import { PatentDetail } from '@/types';

function extractMatch(html: string, pattern: RegExp): string | null {
  const match = html.match(pattern);
  return match?.[1] ?? null;
}

function extractMatches(html: string, pattern: RegExp): string[] {
  const results: string[] = [];
  let match;
  const global = new RegExp(pattern.source, pattern.flags.includes('g') ? pattern.flags : pattern.flags + 'g');
  while ((match = global.exec(html)) !== null) {
    if (match[1]) results.push(match[1]);
  }
  return results;
}

function cleanHTML(text: string): string {
  return text
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractListItems(html: string): string[] {
  return extractMatches(html, /<li>([^<]+)<\/li>/gi).map(cleanHTML).filter(Boolean);
}

export function parsePatentDetail(html: string, caseNumber: string): PatentDetail {
  const title = extractMatch(html, /<h1[^>]*>([^<]+)<\/h1>/i) ?? caseNumber;

  let abstract = extractMatch(html, /<div class="abstract body-text">(.*?)<\/div>/is) ?? '';
  abstract = cleanHTML(abstract);

  let techDesc = extractMatch(html, /<div class="tech_desc body-text">(.*?)<\/div>/is) ?? '';
  techDesc = cleanHTML(techDesc);

  const descParts: string[] = [];
  if (abstract) descParts.push(abstract);
  if (techDesc && techDesc !== abstract) descParts.push(techDesc);
  const fullDescription = descParts.join('\n\n');

  const benefitsSection = extractMatch(html, /<div class="benefits">(.*?)<\/div>\s*(?:<\/div>|<hr)/is) ?? '';
  const benefits = extractListItems(benefitsSection);

  const appsSection = extractMatch(html, /<div class="applications">(.*?)<\/div>\s*(?:<\/div>|<hr)/is) ?? '';
  const applications = extractListItems(appsSection);

  const images = extractMatches(html, /src="(https:\/\/technology\.nasa\.gov\/t2media\/tops\/img\/[^"]+)"/gi);

  const youtubeEmbedIDs = extractMatches(html, /src=["']https?:\/\/(?:www\.)?youtube\.com\/embed\/([^"'?]+)/gi);
  const youtubeWatchIDs = extractMatches(html, /href=["']https?:\/\/(?:www\.)?youtube\.com\/watch\?v=([^"'&]+)/gi);
  const videoIDs = [...new Set([...youtubeEmbedIDs, ...youtubeWatchIDs])];
  const videos = videoIDs.map(id => `https://www.youtube.com/watch?v=${id}`);

  const patentNumbers = extractMatches(html, />([0-9,D][0-9,]+)<\/a>/g)
    .map(n => n.replace(/,/g, ''))
    .filter(n => n.length >= 6);

  const relatedSection = extractMatch(html, /<div class="related">(.*?)<\/div>/is) ?? '';
  const relatedTechnologies = extractMatches(relatedSection, /href="\/patent\/([^"]+)"/g);

  return {
    id: caseNumber,
    caseNumber,
    title,
    fullDescription,
    benefits,
    applications,
    images,
    videos,
    patentNumbers,
    relatedTechnologies,
  };
}
