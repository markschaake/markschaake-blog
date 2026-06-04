# AGENTS.md

This file provides guidance to coding agents when working with code in this repository.

## Commands

```bash
pnpm run dev      # Start dev server at localhost:4321
pnpm run build    # Build production site to ./dist/
pnpm run preview  # Preview production build locally
```

## Architecture

This is an Astro 5 static blog with MDX support, Tailwind CSS v4, and Vercel deployment.

### Content System

Blog posts live in `src/content/posts/` as markdown or MDX files. The content collection schema is defined in `src/content.config.ts` with Zod validation:

- `title`, `description`, `pubDate` are required
- `draft: true` excludes posts from production builds
- `tags` is an optional string array
- `llms` is an optional string array identifying the LLM models used to write or edit the post
- `heroImage` accepts local image imports

Posts are rendered via dynamic route at `src/pages/posts/[...slug].astro` using the `BlogPost.astro` layout.

### LLM Attribution

When writing or editing any blog post in `src/content/posts/`, update that post's `llms` frontmatter array with the model ID of the LLM doing the work if it is not already present.

Example:

```yaml
llms: ["opus-4.6", "gpt-5.5"]
```

### Styling

Tailwind v4 is configured entirely in `src/styles/global.css` using CSS `@theme` blocks (no tailwind.config.js). Custom color variables and typography scales are defined there.

### Site Configuration

Constants like site title, description, and author are in `src/consts.ts`. The site URL is set in `astro.config.mjs`.

### Integrations

- `@astrojs/mdx` - MDX support for posts
- `@astrojs/rss` - RSS feed at `/rss.xml`
- `@astrojs/sitemap` - Auto-generated sitemap
- `sharp` - Image optimization

## Writing Style

When writing or editing blog content, **read `voice.md` first** — it contains all voice, tone, punctuation, and style guidelines. That file is the single source of truth for Mark's writing voice (shared across blog, LinkedIn, and other platforms).

## Background Material for Brainstorming

For brainstorming new posts or understanding Mark's current thinking, consult `~/project/daily/`. This daily journal contains raw notes, recurring themes, personal context, and other material that can help agents get a feel for Mark and the state of his mind before proposing topics or angles.

Mark is currently highly focused on `eforge`, which he is developing at `~/projects/eforge-build/eforge`. When brainstorming or drafting posts related to agentic coding, build systems, or eforge itself, use that repository as important background context. The public website is <https://www.eforge.build>, with LLM-oriented resources available at <https://www.eforge.build/llms.txt> and <https://www.eforge.build/llms-full.txt>.

Daily generated news about the eforge/agentic coding space lives in `~/projects/daily/news/`. Use it as timely context for trend-aware brainstorming, comparisons, and responses to current developments.
