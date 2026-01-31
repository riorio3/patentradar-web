// Patent (basic - from search/browse API)
export interface Patent {
  id: string;
  title: string;
  description: string;
  category: string;
  caseNumber: string;
  patentNumber?: string;
  imageURL?: string;
  center?: string;
  trl?: string;
}

// Patent Detail (rich - from HTML scraping)
export interface PatentDetail {
  id: string;
  caseNumber: string;
  title: string;
  fullDescription: string;
  benefits: string[];
  applications: string[];
  images: string[];
  videos: string[];
  patentNumbers: string[];
  relatedTechnologies: string[];
}

// Business Analysis
export interface BusinessAnalysis {
  id: string;
  patentId: string;
  businessIdeas: BusinessIdea[];
  targetMarkets: string[];
  competition: CompetitorInfo[];
  revenueModels: string[];
  roadmap: RoadmapStep[];
  costEstimates: CostEstimate;
  generatedAt: string;
}

export interface BusinessIdea {
  name: string;
  description: string;
  potentialScale: string;
}

export interface CompetitorInfo {
  name: string;
  description: string;
  gap: string;
}

export interface RoadmapStep {
  step: number;
  title: string;
  description: string;
}

export interface CostEstimate {
  prototyping: string;
  manufacturing: string;
  marketing: string;
  total: string;
}

// Problem Solver
export interface ProblemSolution {
  problem: string;
  summary: string;
  matches: PatentMatch[];
  additionalSuggestions: string;
}

export interface PatentMatch {
  patentIndex: number;
  relevanceScore: number;
  explanation: string;
  applicationIdea: string;
}

export interface ProblemHistoryEntry {
  id: string;
  problem: string;
  solution: ProblemSolution;
  matchedPatents: Patent[];
  date: string;
}

export interface BusinessAnalysisHistoryEntry {
  id: string;
  patent: Patent;
  analysis: BusinessAnalysis;
  date: string;
}

// Categories
export interface CategoryConfig {
  key: string;
  displayName: string;
  shortName: string;
  icon: string;
  color: string;
  apiSlug: string | null;
}

// ElasticSearch API response (browse)
export interface ElasticSearchResult {
  _id: string;
  _source: {
    title?: string;
    abstract?: string;
    tech_desc?: string;
    category?: string;
    client_record_id?: string;
    center?: string;
    patent_number?: string;
    trl?: string;
    img1?: string;
  };
}

// NASA Search API response
export interface NASASearchResponse {
  results: (string | number | null)[][];
  count: number;
  total: number;
  perpage: number;
  page: number;
}
