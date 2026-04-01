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
2. **Convert the image** to WebP using sharp (already a project dependency):
   ```
   node -e "require('sharp')('<source>').webp({ quality: 80 }).toFile('src/content/posts/<slug>.webp').then(i => console.log('Output:', (i.size/1024).toFixed(0)+'KB'))"
   ```
3. **Report the size reduction** (original size vs converted size)
4. **Add the frontmatter field** `heroImage: ./<slug>.webp` to the post (add it after the `tags` line if present, otherwise before the closing `---`)
5. **Verify the build** with `pnpm run build`
