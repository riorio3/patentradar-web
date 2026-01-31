import { Patent, BusinessAnalysis, ProblemSolution } from '@/types';

const API_URL = '/api/anthropic';

async function sendRequest(prompt: string, apiKey: string): Promise<string> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, apiKey }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(err.error || `API error: ${res.status}`);
  }

  const data = await res.json();
  return data.text;
}

function extractJSON(text: string): string {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end === -1) return text;
  return text.substring(start, end + 1);
}

export async function analyzePatent(patent: Patent, apiKey: string): Promise<BusinessAnalysis> {
  const prompt = `You are a business strategist analyzing NASA technology for commercialization potential.

PATENT INFORMATION:
Title: ${patent.title}
Description: ${patent.description}
Category: ${patent.category}
NASA Case Number: ${patent.caseNumber}
Technology Readiness Level: ${patent.trl ?? 'Unknown'}

Analyze this NASA patent and provide a comprehensive business analysis. Return your response in the following JSON format exactly:

{
    "businessIdeas": [
        {"name": "Idea Name", "description": "What the business would do", "potentialScale": "Small/Medium/Large"}
    ],
    "targetMarkets": ["Market 1", "Market 2", "Market 3"],
    "competition": [
        {"name": "Competitor Name", "description": "What they do", "gap": "What this NASA tech offers that they don't"}
    ],
    "revenueModels": ["Revenue model 1", "Revenue model 2"],
    "roadmap": [
        {"step": 1, "title": "Step Title", "description": "What to do"}
    ],
    "costEstimates": {
        "prototyping": "$X - $Y",
        "manufacturing": "$X - $Y",
        "marketing": "$X - $Y",
        "total": "$X - $Y"
    }
}

Provide 3-5 business ideas, 3-5 target markets, 2-4 competitors, 2-4 revenue models, and 5-7 roadmap steps.
Be specific, realistic, and actionable. Focus on practical opportunities for startups and small businesses.
Return ONLY the JSON, no additional text.`;

  const response = await sendRequest(prompt, apiKey);
  const parsed = JSON.parse(extractJSON(response));

  return {
    id: crypto.randomUUID(),
    patentId: patent.id,
    businessIdeas: parsed.businessIdeas,
    targetMarkets: parsed.targetMarkets,
    competition: parsed.competition,
    revenueModels: parsed.revenueModels,
    roadmap: parsed.roadmap.map((s: { title: string; description: string }, i: number) => ({
      step: i + 1,
      title: s.title,
      description: s.description,
    })),
    costEstimates: parsed.costEstimates,
    generatedAt: new Date().toISOString(),
  };
}

export async function extractSearchTerms(problem: string, apiKey: string): Promise<string[]> {
  const prompt = `Extract 3-5 search keywords from this problem description that would help find relevant NASA patents.
Focus on technical terms, materials, processes, or phenomena.

Problem: ${problem}

Return ONLY a JSON array of strings, nothing else:
["keyword1", "keyword2", "keyword3"]`;

  const response = await sendRequest(prompt, apiKey);
  try {
    return JSON.parse(response.trim());
  } catch {
    return problem.split(/\s+/).filter(w => w.length > 4).slice(0, 3);
  }
}

export async function findPatentsForProblem(
  problem: string,
  patents: Patent[],
  apiKey: string
): Promise<ProblemSolution> {
  const patentList = patents.slice(0, 15).map((p, i) => `[${i + 1}] ${p.title}
Case: ${p.caseNumber}
Category: ${p.category}
Description: ${p.description.substring(0, 300)}...`).join('\n\n');

  const prompt = `You are a NASA technology transfer specialist helping entrepreneurs find NASA patents to solve real-world problems.

USER'S PROBLEM:
${problem}

AVAILABLE NASA PATENTS:
${patentList}

Analyze which patents could help solve this problem. Return your response in this exact JSON format:

{
    "summary": "Brief explanation of how NASA technology can help with this problem",
    "matches": [
        {
            "patentIndex": 1,
            "relevanceScore": 85,
            "explanation": "How this specific patent addresses the user's problem",
            "applicationIdea": "Concrete way to apply this technology to their situation"
        }
    ],
    "additionalSuggestions": "Any other advice or alternative approaches"
}

Rules:
- Only include patents with relevanceScore >= 60
- Sort by relevanceScore descending
- Maximum 5 matches
- Be specific about how each technology applies
- If no patents are relevant, return empty matches array with helpful summary
- Return ONLY the JSON, no additional text`;

  const response = await sendRequest(prompt, apiKey);
  const parsed = JSON.parse(extractJSON(response));

  return {
    problem,
    summary: parsed.summary,
    matches: parsed.matches.map((m: { patentIndex: number; relevanceScore: number; explanation: string; applicationIdea: string }) => ({
      patentIndex: m.patentIndex - 1,
      relevanceScore: m.relevanceScore,
      explanation: m.explanation,
      applicationIdea: m.applicationIdea,
    })),
    additionalSuggestions: parsed.additionalSuggestions,
  };
}
