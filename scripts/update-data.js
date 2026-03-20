#!/usr/bin/env node
/**
 * Weekly data update script for AI Marketing Intelligence Hub.
 * Fetches top AI GitHub repos and AI news, caches to JSON files,
 * and updates the "last updated" date in index.html.
 *
 * Usage: node scripts/update-data.js
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const INDEX_PATH = path.join(__dirname, '..', 'index.html');

// ── GitHub Repos ────────────────────────────────────────────────────────────

async function fetchGitHubRepos() {
  const queries = [
    'topic:artificial-intelligence',
    'topic:machine-learning',
    'topic:large-language-model',
    'topic:generative-ai',
    'topic:llm',
    'AI OR LLM OR "machine learning" OR "deep learning" OR "generative ai"',
  ];

  const headers = { 'Accept': 'application/vnd.github+json', 'User-Agent': 'ai-marketing-stack-updater' };
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const results = await Promise.all(
    queries.map(q =>
      fetch(`https://api.github.com/search/repositories?q=${encodeURIComponent(q)}&sort=stars&order=desc&per_page=50`, { headers })
        .then(r => {
          if (!r.ok) throw new Error(`GitHub API ${r.status}: ${r.statusText}`);
          return r.json();
        })
        .then(d => d.items || [])
        .catch(err => { console.warn(`  Warning: GitHub query failed (${q.slice(0, 30)}...): ${err.message}`); return []; })
    )
  );

  const seen = new Set();
  const merged = [];
  for (const items of results) {
    for (const repo of items) {
      if (!seen.has(repo.id)) {
        seen.add(repo.id);
        merged.push({
          id: repo.id,
          name: repo.name,
          full_name: repo.full_name,
          html_url: repo.html_url,
          description: repo.description,
          language: repo.language,
          stargazers_count: repo.stargazers_count,
          forks_count: repo.forks_count,
          topics: (repo.topics || []).slice(0, 6),
          updated_at: repo.updated_at,
          created_at: repo.created_at,
        });
      }
    }
  }

  merged.sort((a, b) => b.stargazers_count - a.stargazers_count);
  return merged.slice(0, 100);
}

// ── AI News ─────────────────────────────────────────────────────────────────

async function fetchAINews() {
  const queries = [
    'artificial intelligence',
    'AI startup',
    'LLM',
    'generative AI',
    'AI marketing',
    'machine learning',
    'OpenAI OR Anthropic OR Google AI',
  ];

  const results = await Promise.all(
    queries.map(q =>
      fetch(`https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(q)}&tags=story&hitsPerPage=30&numericFilters=points>20`)
        .then(r => r.json())
        .then(d => d.hits || [])
        .catch(err => { console.warn(`  Warning: HN query failed (${q}): ${err.message}`); return []; })
    )
  );

  const seen = new Set();
  const merged = [];
  for (const hits of results) {
    for (const hit of hits) {
      if (!seen.has(hit.objectID)) {
        seen.add(hit.objectID);
        merged.push({
          objectID: hit.objectID,
          title: hit.title,
          url: hit.url,
          author: hit.author,
          points: hit.points,
          num_comments: hit.num_comments,
          created_at_i: hit.created_at_i,
          story_text: hit.story_text || null,
        });
      }
    }
  }

  merged.sort((a, b) => {
    const dayA = Math.floor(a.created_at_i / 86400);
    const dayB = Math.floor(b.created_at_i / 86400);
    if (dayA !== dayB) return dayB - dayA;
    return b.points - a.points;
  });

  return merged.slice(0, 100);
}

// ── Update Header Date ──────────────────────────────────────────────────────

function updateHeaderDate() {
  const now = new Date();
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const dateStr = `${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;

  let html = fs.readFileSync(INDEX_PATH, 'utf8');
  // Update the eyebrow date
  html = html.replace(
    /Updated\s+\w+\s+\d{1,2},?\s+\d{4}/,
    `Updated ${dateStr}`
  );
  fs.writeFileSync(INDEX_PATH, html, 'utf8');
  console.log(`  Updated header date to: ${dateStr}`);
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('AI Marketing Intelligence Hub — Weekly Data Update');
  console.log('='.repeat(52));

  // Ensure data directory exists
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

  // Fetch GitHub repos
  console.log('\n[1/3] Fetching top 100 AI GitHub repos...');
  try {
    const repos = await fetchGitHubRepos();
    const outPath = path.join(DATA_DIR, 'github-repos.json');
    fs.writeFileSync(outPath, JSON.stringify({ updated_at: new Date().toISOString(), repos }, null, 2));
    console.log(`  Cached ${repos.length} repos to data/github-repos.json`);
  } catch (err) {
    console.error(`  ERROR fetching GitHub repos: ${err.message}`);
  }

  // Fetch AI news
  console.log('\n[2/3] Fetching AI news...');
  try {
    const news = await fetchAINews();
    const outPath = path.join(DATA_DIR, 'ai-news.json');
    fs.writeFileSync(outPath, JSON.stringify({ updated_at: new Date().toISOString(), articles: news }, null, 2));
    console.log(`  Cached ${news.length} articles to data/ai-news.json`);
  } catch (err) {
    console.error(`  ERROR fetching AI news: ${err.message}`);
  }

  // Update header date
  console.log('\n[3/3] Updating header date...');
  try {
    updateHeaderDate();
  } catch (err) {
    console.error(`  ERROR updating header date: ${err.message}`);
  }

  console.log('\nDone.');
}

main().catch(err => { console.error(err); process.exit(1); });
