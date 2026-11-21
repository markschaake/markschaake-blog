# markschaake.com

Source for [www.markschaake.com](https://www.markschaake.com), Mark Schaake's blog.

## Stack

- [Astro](https://astro.build) 6, static output, with MDX
- [Tailwind CSS](https://tailwindcss.com) 4 via `@tailwindcss/vite`, configured in `src/styles/global.css`
- [Chart.js](https://www.chartjs.org) for charts in posts
- [Giscus](https://giscus.app) for comments (GitHub Discussions)
- RSS (`@astrojs/rss`) and sitemap (`@astrojs/sitemap`)
- pnpm, Node 22
- Hosted on [Vercel](https://vercel.com)

## Running locally

```bash
pnpm install
pnpm run dev      # dev server at http://localhost:4321
pnpm run build    # production build to ./dist/
pnpm run preview  # serve the production build locally
```

## Posts

Posts live in `src/content/posts/` as `.md` or `.mdx` files; the file name is the URL slug (`/posts/<slug>/`). Images used by a post sit next to it.

Frontmatter is validated by the schema in `src/content.config.ts`, which is the source of truth. Currently:

| Field | Type | Default |
| :-- | :-- | :-- |
| `title` | string | required |
| `description` | string | required |
| `pubDate` | date | required |
| `updatedDate` | date | optional |
| `draft` | boolean | `false` |
| `handwritten` | boolean | `false` |
| `llms` | string[] | `[]` |
| `tags` | string[] | `[]` |
| `comments` | boolean | `true` |
| `heroImage` | local image | optional |
| `ogImage` | local image | optional |

### Drafts

Set `draft: true` to keep a post unpublished. Drafts show up (with a draft badge) in `pnpm run dev`, but are excluded from production builds and from the RSS feed.

## Deploys

- Pushing to `main` deploys to production on Vercel.
- Other branches get Vercel preview deployments, which are protected (not publicly viewable).
- GitHub Actions (`.github/workflows/ci.yml`) only runs `pnpm install --frozen-lockfile` and `pnpm run build` on pushes and pull requests to `main`; it does not deploy.
