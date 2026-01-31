# PatentRadar Web

The web client for [PatentRadar](https://github.com/riorio3/PatentRadar) — browse, search, and analyze government patents for commercialization, right from your browser.

## Features

- **Patent Discovery** — Browse 600+ patents across 15 categories, search by keyword
- **AI Problem Solver** — Describe a problem in plain English, get matched patents with relevance scores
- **Business Analysis** — AI-powered commercialization reports (markets, competitors, roadmap, costs)
- **Saved Patents** — Bookmark patents for later review
- **Responsive UI** — Dark-themed interface built for desktop and mobile

## Tech Stack

- **Next.js 16** — App Router, API routes
- **React 19**
- **Tailwind CSS 4**
- **TanStack React Query** — Data fetching and caching
- **Zustand** — Client state management
- **Claude AI** — Anthropic's Claude for patent analysis
- **NASA T2 Portal API** — Patent data source

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## API Key

AI features require a Claude API key from [Anthropic](https://console.anthropic.com/). Add it in the Settings page.

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Discovery / browse patents
│   ├── patent/[caseNumber]/  # Patent detail page
│   ├── solve/                # AI Problem Solver
│   ├── saved/                # Saved patents
│   ├── settings/             # Settings (API key)
│   └── api/                  # Backend routes (nasa, anthropic)
├── components/               # Shared UI components
├── lib/
│   ├── api/                  # API client functions
│   ├── stores/               # Zustand stores
│   └── utils/                # Categories, HTML parser
└── types/                    # TypeScript types
```

## Related

- [PatentRadar iOS](https://github.com/riorio3/PatentRadar) — the native iOS app

## Data Source

Patent data comes from [NASA's Technology Transfer Portal](https://technology.nasa.gov/). This app is not affiliated with or endorsed by NASA.
