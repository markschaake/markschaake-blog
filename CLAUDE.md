# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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
- `heroImage` accepts local image imports

Posts are rendered via dynamic route at `src/pages/posts/[...slug].astro` using the `BlogPost.astro` layout.

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
