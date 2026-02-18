---
name: add-hero-image
description: Convert an image to WebP and add it as a hero image to a blog post
disable-model-invocation: true
argument-hint: [source-image-path] [post-slug]
allowed-tools: Bash, Read, Edit, Glob
---

# Add Hero Image to Blog Post

Convert a source image to WebP format and add it as a hero image to a blog post.

## Arguments

- `$1` - Path to the source image (e.g., `~/Downloads/my-image.png`)
- `$2` - Post slug (e.g., `the-layer-above`). If omitted, infer from the image filename.

## Steps

1. **Locate the post** at `src/content/posts/$2.md` or `src/content/posts/$2.mdx`
2. **Convert the image** to WebP using ImageMagick:
   ```
   convert <source> -quality 80 src/content/posts/<slug>.webp
   ```
3. **Report the size reduction** (original size vs converted size)
4. **Add the frontmatter field** `heroImage: ./<slug>.webp` to the post (add it after the `tags` line if present, otherwise before the closing `---`)
5. **Verify the build** with `pnpm run build`
