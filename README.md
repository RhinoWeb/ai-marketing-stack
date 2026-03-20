# AI Marketing Intelligence Hub

A curated, scored database of 111+ AI tools for marketing agencies and solopreneurs. Built as a single-page intelligence dossier with a dark luxury aesthetic.

**Live site:** Hosted via GitHub Pages

## Features

### Tool Database (`index.html`)
- **111 AI tools** scored across 5 dimensions: Revenue Impact, Automation Power, Creative Output, API Integration, and Cost Efficiency
- **Tier rankings** (S/A/B/C) based on composite scores
- **12 categories**: Foundation AI, Image Generation, Video Generation, Voice & Audio, AI Calling, Automation, Outreach & CRM, SEO & Analytics, Social & Content, Music & Podcast, Speech Recognition, Infrastructure
- **Category & use case filtering** with real-time search
- **Sort** by score, A-Z, or category
- **Stack Dossier** sidebar to build your own tool stack with average scoring and coverage analysis
- **Checkout page** generating a downloadable PDF stack report
- **Side-by-side comparison** for up to 3 tools
- **6 pre-built stack templates**: Lean Solopreneur, Full-Service Agency, Ecommerce Growth, B2B Lead Gen, Content Machine, AI Calling Stack
- **Tool suggestion form** with Supabase backend
- **YouTube demo embeds** per tool
- **Agency USP** field on every tool row

### Top 100 AI GitHub Repos (`github-repos.html`)
- Live data from the GitHub Search API on page load
- Queries across multiple AI topics, deduplicates and ranks by stars
- Language filter pills, search, star/fork counts, topics, last updated
- Top 10 (gold) and top 25 (blue) rank highlights

### AI News (`ai-news.html`)
- Aggregated from HackerNews Algolia API across 7 AI-related queries
- Auto-categorized: Models, Tools, Marketing, Research, Funding, Regulation, Open Source, Industry
- Category pill filters and search
- Sorted by recency then engagement (points)
- Featured card layout for top story

### Changelog (`changelog.html`)
- Timeline-based version history of all hub updates
- Tagged entries: Feature, Added, Fix, Design

### Admin (`admin.html`)
- Password-protected review page for tool suggestions

## Tech Stack

- **Pure HTML/CSS/JS** — no build tools, no frameworks, no dependencies
- **GitHub Search API** for live repo data
- **HackerNews Algolia API** for news aggregation
- **Supabase** for tool suggestion storage (optional)
- **Google Fonts**: Cormorant Garamond, Syne, JetBrains Mono

## File Structure

```
index.html          Main tool database and intelligence hub
changelog.html      Version history timeline
github-repos.html   Live top 100 AI GitHub repos
ai-news.html        Curated AI news feed
admin.html          Tool suggestion admin review
```

## Design

Dark luxury "intelligence dossier" aesthetic with:
- `#06080f` deep navy background
- `#c8a96e` gold accents
- Cormorant Garamond (headings), Syne (body), JetBrains Mono (data)
- Responsive across all screen sizes

## Author

Curated by **Ryan Shaw**
