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

When writing or editing blog content, follow these guidelines:

### Punctuation
- Use straight quotes (`"`) not curly quotes (`"`)
- Use hyphens with spaces (` - `) not em dashes (`—`)
- Example: `This is a clause - not a separate sentence` not `This is a clause—not a separate sentence`

### Tone
- Essential, not fluffy. Every sentence earns its place.
- Concrete over abstract when possible
- No advice-giving - observe and analyze, don't prescribe
- Don't address the reader directly with advice (avoid "you should", "if you're considering", etc.)
- Don't tell readers what they know or feel ("you already know", "you'll find that...") - describe personal experience instead
- "You" for invitation is okay ("hard to explain until you've felt it") - "you" for prescription is not
- Avoid phrases that imply prior dishonesty (avoid "the honest answer", "to be frank", "truthfully", etc.)
- No hedging announcements ("No confident predictions here", "The timeline is opaque") - if uncertain, just don't predict. The absence is the honesty.

### Voice
Mark's writing voice has specific patterns:

**Sentence rhythm:**
- Connected clauses that breathe together - one thought flowing into the next
- Avoid staccato fragments for dramatic effect
- Bad: "The idea started small. Our club uses software that's... fine. It works."
- Good: "The idea started small - our club uses software that works, more or less, but it's old and clunky and owned by a company that doesn't know us."

**Plain observation over performative cleverness:**
- Let the idea land without forcing it
- Bad: "The formula is brutal: Confidence times Speed equals Distance traveled when wrong."
- Good: "The cost of falling over the edge scales with how fast I was moving."

**Personal grounding:**
- Personal details anchor analysis to something concrete - not decoration or performed vulnerability
- Use specifics that do work: "my lifelong best friend Dan" not "my close friend"
- The tennis club example isn't autobiography - it makes abstraction concrete
- Weave personal context through analytical sections rather than separating them

**Other patterns:**
- Italics for emphasis on key words ("it just _feels_ healthy")
- Parenthetical asides that clarify something real ("outside of family"), not decorative asides
- Warm through specificity, not adjectives

### Citations
- Always include links to referenced analyses, studies, or other people's work
- Links should open in new tabs using external link format: `[text](url){:target="_blank"}`
