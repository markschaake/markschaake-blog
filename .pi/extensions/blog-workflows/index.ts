import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { BorderedLoader } from "@earendil-works/pi-coding-agent";
import { Text } from "@earendil-works/pi-tui";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import path from "node:path";

const POSTS_DIR = path.join("src", "content", "posts");
const HERO_QUALITY = 80;
const REVIEW_REFERENCE_POST_COUNT = 3;

type Post = {
	slug: string;
	fileName: string;
	absolutePath: string;
	relativePath: string;
	title: string;
	pubDate?: Date;
	draft: boolean;
	mtimeMs: number;
};

type HeroResult = {
	post: Post;
	sourcePath: string;
	outputPath: string;
	originalBytes: number;
	webpBytes: number;
	build: { ok: boolean; stdout: string; stderr: string; code: number | null };
};

type BuildResult = { ok: boolean; stdout: string; stderr: string; code: number | null };

type GeneratedImageResult = {
	kind: "hero" | "inline";
	post: Post;
	outputPath: string;
	prompt: string;
	size: string;
	quality: string;
	webpBytes: number;
	altText?: string;
	markdownSnippet?: string;
	inserted?: boolean;
	build: BuildResult;
};

function normalizeInputPath(input: string, cwd: string): string {
	const withoutAt = input.startsWith("@") ? input.slice(1) : input;
	const expanded = withoutAt === "~" ? homedir() : withoutAt.startsWith("~/") ? path.join(homedir(), withoutAt.slice(2)) : withoutAt;
	return path.isAbsolute(expanded) ? expanded : path.resolve(cwd, expanded);
}

function formatBytes(bytes: number): string {
	if (bytes < 1024) return `${bytes} B`;
	const kib = bytes / 1024;
	if (kib < 1024) return `${kib.toFixed(0)} KB`;
	return `${(kib / 1024).toFixed(1)} MB`;
}

function parseArgs(input: string): string[] {
	const args: string[] = [];
	let current = "";
	let quote: "'" | '"' | undefined;
	let escaping = false;
	let sawToken = false;

	for (const ch of input) {
		if (escaping) {
			current += ch;
			escaping = false;
			sawToken = true;
			continue;
		}

		if (ch === "\\" && quote !== "'") {
			escaping = true;
			sawToken = true;
			continue;
		}

		if ((ch === "'" || ch === '"') && (!quote || quote === ch)) {
			quote = quote ? undefined : ch;
			sawToken = true;
			continue;
		}

		if (!quote && /\s/.test(ch)) {
			if (sawToken) {
				args.push(current);
				current = "";
				sawToken = false;
			}
			continue;
		}

		current += ch;
		sawToken = true;
	}

	if (escaping) current += "\\";
	if (sawToken) args.push(current);
	return args;
}

function parseFrontmatterField(frontmatter: string, field: string): string | undefined {
	const escaped = field.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	const match = frontmatter.match(new RegExp(`^${escaped}:\\s*(.*)$`, "m"));
	if (!match) return undefined;
	return match[1]?.trim().replace(/^['\"]|['\"]$/g, "");
}

function splitFrontmatter(content: string): { frontmatter: string; body: string; frontmatterEnd: number } {
	if (!content.startsWith("---\n")) return { frontmatter: "", body: content, frontmatterEnd: 0 };
	const end = content.indexOf("\n---", 4);
	if (end === -1) return { frontmatter: "", body: content, frontmatterEnd: 0 };
	const closeEnd = end + "\n---".length;
	return { frontmatter: content.slice(4, end), body: content.slice(closeEnd), frontmatterEnd: closeEnd };
}

function parseFrontmatterArray(frontmatter: string, field: string): string[] {
	const raw = parseFrontmatterField(frontmatter, field);
	if (!raw) return [];
	const bracketMatch = raw.match(/^\[(.*)\]$/);
	if (!bracketMatch) return [raw];
	return bracketMatch[1]!
		.split(",")
		.map((value) => value.trim().replace(/^['\"]|['\"]$/g, ""))
		.filter(Boolean);
}

function sanitizeFileStem(input: string): string {
	return input
		.toLowerCase()
		.trim()
		.replace(/\.[a-z0-9]+$/i, "")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "")
		.slice(0, 80);
}

function listPosts(cwd: string): Post[] {
	const absolutePostsDir = path.join(cwd, POSTS_DIR);
	if (!existsSync(absolutePostsDir)) return [];

	return readdirSync(absolutePostsDir)
		.filter((fileName) => /\.mdx?$/.test(fileName))
		.map((fileName) => {
			const absolutePath = path.join(absolutePostsDir, fileName);
			const relativePath = path.join(POSTS_DIR, fileName);
			const raw = existsSync(absolutePath) ? statSync(absolutePath) : undefined;
			let frontmatter = "";
			try {
				const content = readPostFileSync(absolutePath);
				if (content.startsWith("---\n")) {
					const end = content.indexOf("\n---", 4);
					if (end !== -1) frontmatter = content.slice(4, end);
				}
			} catch {
				// Keep a minimal entry if frontmatter cannot be read.
			}

			const slug = fileName.replace(/\.mdx?$/, "");
			const title = parseFrontmatterField(frontmatter, "title") || slug;
			const pubDateValue = parseFrontmatterField(frontmatter, "pubDate");
			const pubDate = pubDateValue ? new Date(pubDateValue) : undefined;
			const draftValue = parseFrontmatterField(frontmatter, "draft")?.toLowerCase();
			const draft = draftValue === "true";

			return {
				slug,
				fileName,
				absolutePath,
				relativePath,
				title,
				pubDate: pubDate && !Number.isNaN(pubDate.getTime()) ? pubDate : undefined,
				draft,
				mtimeMs: raw?.mtimeMs ?? 0,
			};
		})
		.sort((a, b) => a.slug.localeCompare(b.slug));
}

function readPostFileSync(filePath: string): string {
	return readFileSync(filePath, "utf8");
}

function findPost(cwd: string, slugOrPath: string): Post | undefined {
	const posts = listPosts(cwd);
	const normalized = slugOrPath.startsWith("@") ? slugOrPath.slice(1) : slugOrPath;
	const candidatePath = path.isAbsolute(normalized) ? normalized : path.resolve(cwd, normalized);
	return (
		posts.find((post) => post.slug === normalized || post.fileName === normalized) ||
		posts.find((post) => path.resolve(post.absolutePath) === candidatePath) ||
		posts.find((post) => post.relativePath === normalized || post.relativePath === normalized.replace(/^\.\//, ""))
	);
}

function mostRecentlyModifiedPost(cwd: string): Post | undefined {
	return [...listPosts(cwd)].sort((a, b) => b.mtimeMs - a.mtimeMs)[0];
}

function mostRecentPublishedPosts(cwd: string, excludeSlug: string, limit: number): Post[] {
	return listPosts(cwd)
		.filter((post) => !post.draft && post.slug !== excludeSlug && post.pubDate)
		.sort((a, b) => (b.pubDate?.getTime() ?? 0) - (a.pubDate?.getTime() ?? 0))
		.slice(0, limit);
}

function postSelectionItems(posts: Post[]): string[] {
	return posts.map((post) => `${post.slug} — ${post.title}${post.draft ? " [draft]" : ""}`);
}

function slugFromSelection(selection: string): string {
	return selection.split(" — ")[0]!.trim();
}

async function choosePost(ctx: { cwd: string; hasUI: boolean; ui: { select: (title: string, items: string[]) => Promise<string | undefined>; notify: (message: string, level: "info" | "warning" | "error") => void } }, title: string, sort: "mtime" | "title" = "title"): Promise<Post | undefined> {
	const posts = listPosts(ctx.cwd);
	const sorted = sort === "mtime" ? [...posts].sort((a, b) => b.mtimeMs - a.mtimeMs) : posts;
	if (!ctx.hasUI) return sorted[0];
	if (sorted.length === 0) {
		ctx.ui.notify("No posts found in src/content/posts", "error");
		return undefined;
	}
	const selected = await ctx.ui.select(title, postSelectionItems(sorted));
	if (!selected) return undefined;
	return findPost(ctx.cwd, slugFromSelection(selected));
}

function insertOrReplaceHeroImage(content: string, heroValue: string): string {
	if (!content.startsWith("---\n")) {
		throw new Error("Post does not have YAML frontmatter");
	}

	const end = content.indexOf("\n---", 4);
	if (end === -1) {
		throw new Error("Post frontmatter is missing a closing --- marker");
	}

	const frontmatter = content.slice(4, end);
	const suffix = content.slice(end);
	const lines = frontmatter.split("\n");
	const heroLine = `heroImage: ${heroValue}`;
	const existingHeroIndex = lines.findIndex((line) => /^heroImage\s*:/.test(line));

	if (existingHeroIndex >= 0) {
		lines[existingHeroIndex] = heroLine;
		return `---\n${lines.join("\n")}${suffix}`;
	}

	const tagsIndex = lines.findIndex((line) => /^tags\s*:/.test(line));
	if (tagsIndex >= 0) {
		let insertAfter = tagsIndex;
		for (let i = tagsIndex + 1; i < lines.length; i++) {
			const line = lines[i]!;
			if (/^[A-Za-z0-9_-]+\s*:/.test(line)) break;
			if (line.trim() === "") break;
			insertAfter = i;
		}
		lines.splice(insertAfter + 1, 0, heroLine);
	} else {
		lines.push(heroLine);
	}

	return `---\n${lines.join("\n")}${suffix}`;
}

async function runWithLoader<T>(ctx: any, message: string, task: (signal?: AbortSignal) => Promise<T>): Promise<T | null> {
	if (!ctx.hasUI) return task(undefined);

	return ctx.ui.custom<T | null>((tui: any, theme: any, _keybindings: any, done: (value: T | null) => void) => {
		const loader = new BorderedLoader(tui, theme, message);
		loader.onAbort = () => done(null);
		task(loader.signal).then(done).catch((error) => {
			ctx.ui.notify(error instanceof Error ? error.message : String(error), "error");
			done(null);
		});
		return loader;
	});
}

async function addHeroImage(pi: ExtensionAPI, ctx: any, rawArgs: string): Promise<HeroResult | undefined> {
	const args = parseArgs(rawArgs);
	let sourceArg = args[0];
	let slugArg = args[1];

	if (!sourceArg && ctx.hasUI) {
		sourceArg = await ctx.ui.input("Source image", "~/Downloads/image.png");
	}
	if (!sourceArg) {
		ctx.ui.notify("Usage: /blog-hero [source-image-path] [post-slug]", "error");
		return undefined;
	}

	const sourcePath = normalizeInputPath(sourceArg, ctx.cwd);
	if (!existsSync(sourcePath)) {
		ctx.ui.notify(`Source image not found: ${sourcePath}`, "error");
		return undefined;
	}

	if (!slugArg) {
		const inferredSlug = path.basename(sourcePath).replace(/\.[^.]+$/, "");
		const inferredPost = findPost(ctx.cwd, inferredSlug);
		if (inferredPost) {
			slugArg = inferredSlug;
		} else {
			const selectedPost = await choosePost(ctx, "Choose post for hero image", "title");
			if (!selectedPost) return undefined;
			slugArg = selectedPost.slug;
		}
	}

	const post = findPost(ctx.cwd, slugArg);
	if (!post) {
		ctx.ui.notify(`Post not found: ${slugArg}`, "error");
		return undefined;
	}

	const outputPath = path.join(ctx.cwd, POSTS_DIR, `${post.slug}.webp`);
	if (existsSync(outputPath) && ctx.hasUI) {
		const overwrite = await ctx.ui.confirm("Overwrite hero image?", `${path.relative(ctx.cwd, outputPath)} already exists. Replace it?`);
		if (!overwrite) return undefined;
	}

	const result = await runWithLoader(ctx, `Converting ${path.basename(sourcePath)} and building site...`, async (signal) => {
		ctx.ui.setStatus("blog", "converting hero image");
		const sourceStats = await stat(sourcePath);
		await mkdir(path.dirname(outputPath), { recursive: true });
		const sharpModule = await import("sharp");
		const sharp = sharpModule.default;
		await sharp(sourcePath).webp({ quality: HERO_QUALITY }).toFile(outputPath);
		const outputStats = await stat(outputPath);

		ctx.ui.setStatus("blog", "updating frontmatter");
		const postContent = await readFile(post.absolutePath, "utf8");
		const updatedPostContent = insertOrReplaceHeroImage(postContent, `./${post.slug}.webp`);
		await writeFile(post.absolutePath, updatedPostContent, "utf8");

		ctx.ui.setStatus("blog", "running pnpm build");
		const build = await pi.exec("pnpm", ["run", "build"], { cwd: ctx.cwd, signal, timeout: 120_000 });

		return {
			post,
			sourcePath,
			outputPath,
			originalBytes: sourceStats.size,
			webpBytes: outputStats.size,
			build: { ok: build.code === 0, stdout: build.stdout, stderr: build.stderr, code: build.code },
		} satisfies HeroResult;
	});

	ctx.ui.setStatus("blog", undefined);
	if (!result) return undefined;

	const reduction = result.originalBytes > 0 ? ((1 - result.webpBytes / result.originalBytes) * 100).toFixed(1) : "0.0";
	const summary = [
		`## Blog hero image`,
		``,
		`Post: ${result.post.title} (${result.post.slug})`,
		`Image: ${path.relative(ctx.cwd, result.outputPath)}`,
		`Size: ${formatBytes(result.originalBytes)} → ${formatBytes(result.webpBytes)} (${reduction}% smaller)`,
		`Build: ${result.build.ok ? "passed" : `failed${result.build.code === null ? "" : ` (${result.build.code})`}`}`,
	].join("\n");

	pi.sendMessage({ customType: "blog-workflows", content: summary, display: true, details: result });

	if (result.build.ok) {
		ctx.ui.notify(`Hero image added: ${path.relative(ctx.cwd, result.outputPath)}`, "info");
	} else {
		ctx.ui.notify("Hero image added, but pnpm run build failed", "error");
		if (ctx.hasUI) {
			ctx.ui.setEditorText(`Build failed for /blog-hero ${sourceArg} ${post.slug}\n\nSTDOUT:\n${result.build.stdout}\n\nSTDERR:\n${result.build.stderr}`);
		}
	}

	return result;
}

function stripMarkdownForPrompt(markdown: string): string {
	return markdown
		.replace(/```[\s\S]*?```/g, " ")
		.replace(/^import\s+.*$/gm, " ")
		.replace(/<[^>]+>/g, " ")
		.replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
		.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
		.replace(/^#{1,6}\s+/gm, "")
		.replace(/^---+$/gm, " ")
		.replace(/[ \t]+/g, " ")
		.replace(/\n{3,}/g, "\n\n")
		.trim();
}

async function getPostImageContext(post: Post): Promise<{ title: string; description: string; tags: string[]; excerpt: string }> {
	const content = await readFile(post.absolutePath, "utf8");
	const { frontmatter, body } = splitFrontmatter(content);
	const title = parseFrontmatterField(frontmatter, "title") || post.title;
	const description = parseFrontmatterField(frontmatter, "description") || "";
	const tags = parseFrontmatterArray(frontmatter, "tags");
	const excerpt = stripMarkdownForPrompt(body).split(/\s+/).slice(0, 180).join(" ");
	return { title, description, tags, excerpt };
}

function defaultGeneratedImagePrompt(context: { title: string; description: string; tags: string[]; excerpt: string }, kind: "hero" | "inline"): string {
	const role = kind === "hero" ? "a wide editorial hero image for a thoughtful personal technology essay" : "an in-body editorial illustration that supports one section of a thoughtful personal technology essay";
	const composition = kind === "hero" ? "16:9 composition, strong negative space, suitable for the top of a blog post" : "blog article illustration, composed so it can sit between paragraphs without overwhelming the text";

	return [
		`Create ${role}.`,
		``,
		`Post title: ${context.title}`,
		context.description ? `Post description: ${context.description}` : undefined,
		context.tags.length > 0 ? `Tags: ${context.tags.join(", ")}` : undefined,
		context.excerpt ? `Post excerpt: ${context.excerpt}` : undefined,
		``,
		`Visual direction: abstract but concrete metaphor, restrained palette, quiet tension, human-scale detail, editorial rather than decorative. ${composition}.`,
		`Avoid: text, captions, logos, UI screenshots, watermarks, glossy corporate stock art, literal robots, floating app icons, exaggerated sci-fi imagery, photorealistic fake people, clutter.`
	].filter(Boolean).join("\n");
}

async function editImagePrompt(ctx: any, title: string, prompt: string): Promise<string | undefined> {
	if (!ctx.hasUI) return prompt;
	const edited = await ctx.ui.editor(title, prompt);
	return edited?.trim() ? edited.trim() : undefined;
}

async function chooseImageSize(ctx: any, kind: "hero" | "inline"): Promise<string | undefined> {
	if (!ctx.hasUI) return kind === "hero" ? "1536x864" : "1536x864";
	const options = [
		"1536x864 — wide 16:9",
		"1536x1024 — landscape 3:2",
		"1024x1024 — square",
		"1024x1536 — portrait",
	];
	const selected = await ctx.ui.select("Image size", options);
	return selected?.split(" — ")[0];
}

async function generateOpenAIWebp(prompt: string, size: string, signal?: AbortSignal): Promise<Buffer> {
	const apiKey = process.env.OPENAI_API_KEY;
	if (!apiKey) {
		throw new Error("OPENAI_API_KEY is required for image generation");
	}

	const response = await fetch("https://api.openai.com/v1/images/generations", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`,
		},
		body: JSON.stringify({
			model: "gpt-image-2",
			prompt,
			n: 1,
			size,
			quality: "medium",
			output_format: "webp",
			output_compression: 85,
			background: "opaque",
		}),
		signal,
	});

	if (!response.ok) {
		const text = await response.text();
		throw new Error(`OpenAI image generation failed (${response.status}): ${text.slice(0, 800)}`);
	}

	const json = await response.json() as { data?: Array<{ b64_json?: string }> };
	const b64 = json.data?.[0]?.b64_json;
	if (!b64) {
		throw new Error("OpenAI image generation response did not include data[0].b64_json");
	}
	return Buffer.from(b64, "base64");
}

async function runBuild(pi: ExtensionAPI, ctx: any, signal?: AbortSignal): Promise<BuildResult> {
	ctx.ui.setStatus("blog", "running pnpm build");
	const build = await pi.exec("pnpm", ["run", "build"], { cwd: ctx.cwd, signal, timeout: 120_000 });
	return { ok: build.code === 0, stdout: build.stdout, stderr: build.stderr, code: build.code };
}

function summarizeGeneratedImage(ctx: any, result: GeneratedImageResult): string {
	return [
		`## Blog ${result.kind === "hero" ? "hero" : "inline"} image generated`,
		``,
		`Post: ${result.post.title} (${result.post.slug})`,
		`Image: ${path.relative(ctx.cwd, result.outputPath)}`,
		`Size: ${formatBytes(result.webpBytes)}`,
		`Generation: gpt-image-2, ${result.size}, ${result.quality} quality, WebP`,
		result.markdownSnippet ? `Markdown: ${result.markdownSnippet}` : undefined,
		result.inserted !== undefined ? `Inserted: ${result.inserted ? "yes" : "no"}` : undefined,
		`Build: ${result.build.code === null && !result.build.stdout && !result.build.stderr ? "not run" : result.build.ok ? "passed" : `failed${result.build.code === null ? "" : ` (${result.build.code})`}`}`,
	].filter(Boolean).join("\n");
}

async function createGeneratedHeroImage(pi: ExtensionAPI, ctx: any, rawArgs: string): Promise<GeneratedImageResult | undefined> {
	const targetArg = parseArgs(rawArgs)[0];
	const post = targetArg ? findPost(ctx.cwd, targetArg) : await choosePost(ctx, "Choose post for generated hero", "mtime");
	if (!post) {
		ctx.ui.notify(targetArg ? `Post not found: ${targetArg}` : "No post selected", "error");
		return undefined;
	}

	const context = await getPostImageContext(post);
	const prompt = await editImagePrompt(ctx, "Edit hero image prompt", defaultGeneratedImagePrompt(context, "hero"));
	if (!prompt) return undefined;

	const size = await chooseImageSize(ctx, "hero");
	if (!size) return undefined;

	if (ctx.hasUI) {
		const ok = await ctx.ui.confirm("Generate hero image?", `This will call OpenAI gpt-image-2 and write src/content/posts/${post.slug}.webp.`);
		if (!ok) return undefined;
	}

	const outputPath = path.join(ctx.cwd, POSTS_DIR, `${post.slug}.webp`);
	if (existsSync(outputPath) && ctx.hasUI) {
		const overwrite = await ctx.ui.confirm("Overwrite hero image?", `${path.relative(ctx.cwd, outputPath)} already exists. Replace it?`);
		if (!overwrite) return undefined;
	}

	const result = await runWithLoader(ctx, `Generating hero image for ${post.slug}...`, async (signal) => {
		ctx.ui.setStatus("blog", "generating hero image");
		const image = await generateOpenAIWebp(prompt, size, signal);
		await writeFile(outputPath, image);

		ctx.ui.setStatus("blog", "updating frontmatter");
		const postContent = await readFile(post.absolutePath, "utf8");
		await writeFile(post.absolutePath, insertOrReplaceHeroImage(postContent, `./${post.slug}.webp`), "utf8");

		const outputStats = await stat(outputPath);
		const build = await runBuild(pi, ctx, signal);
		return { kind: "hero", post, outputPath, prompt, size, quality: "medium", webpBytes: outputStats.size, build } satisfies GeneratedImageResult;
	});

	ctx.ui.setStatus("blog", undefined);
	if (!result) return undefined;
	pi.sendMessage({ customType: "blog-workflows", content: summarizeGeneratedImage(ctx, result), display: true, details: result });
	ctx.ui.notify(result.build.ok ? `Generated hero image: ${path.relative(ctx.cwd, result.outputPath)}` : "Generated hero image, but pnpm run build failed", result.build.ok ? "info" : "error");
	return result;
}

function insertMarkdownAfterAnchor(content: string, anchor: string, snippet: string): string | undefined {
	const index = content.indexOf(anchor);
	if (index === -1) return undefined;
	const insertAt = index + anchor.length;
	return `${content.slice(0, insertAt).replace(/\s*$/, "")}\n\n${snippet}\n\n${content.slice(insertAt).replace(/^\s*/, "")}`;
}

async function createGeneratedInlineImage(pi: ExtensionAPI, ctx: any, rawArgs: string): Promise<GeneratedImageResult | undefined> {
	const args = parseArgs(rawArgs);
	const targetArg = args[0];
	let imageNameArg = args[1];
	const post = targetArg ? findPost(ctx.cwd, targetArg) : await choosePost(ctx, "Choose post for inline image", "mtime");
	if (!post) {
		ctx.ui.notify(targetArg ? `Post not found: ${targetArg}` : "No post selected", "error");
		return undefined;
	}

	if (!imageNameArg && ctx.hasUI) {
		imageNameArg = await ctx.ui.input("Image file name", `${post.slug}-illustration`);
	}
	const imageStem = sanitizeFileStem(imageNameArg || `${post.slug}-illustration`);
	if (!imageStem) {
		ctx.ui.notify("Image file name is required", "error");
		return undefined;
	}

	const context = await getPostImageContext(post);
	const prompt = await editImagePrompt(ctx, "Edit inline image prompt", defaultGeneratedImagePrompt(context, "inline"));
	if (!prompt) return undefined;

	const size = await chooseImageSize(ctx, "inline");
	if (!size) return undefined;

	const altText = ctx.hasUI ? (await ctx.ui.input("Alt text", context.description || context.title))?.trim() : context.description || context.title;
	if (!altText) return undefined;

	const fileName = `${imageStem}.webp`;
	const outputPath = path.join(ctx.cwd, POSTS_DIR, fileName);
	const markdownSnippet = `![${altText.replace(/\]/g, "\\]")}](./${fileName})`;

	if (existsSync(outputPath) && ctx.hasUI) {
		const overwrite = await ctx.ui.confirm("Overwrite image?", `${path.relative(ctx.cwd, outputPath)} already exists. Replace it?`);
		if (!overwrite) return undefined;
	}

	if (ctx.hasUI) {
		const ok = await ctx.ui.confirm("Generate inline image?", `This will call OpenAI gpt-image-2 and write ${path.relative(ctx.cwd, outputPath)}.`);
		if (!ok) return undefined;
	}

	const generated = await runWithLoader(ctx, `Generating inline image for ${post.slug}...`, async (signal) => {
		ctx.ui.setStatus("blog", "generating inline image");
		const image = await generateOpenAIWebp(prompt, size, signal);
		await writeFile(outputPath, image);
		const outputStats = await stat(outputPath);
		return { outputStats };
	});

	ctx.ui.setStatus("blog", undefined);
	if (!generated) return undefined;

	let inserted = false;
	let build: BuildResult = { ok: true, stdout: "", stderr: "", code: null };

	if (ctx.hasUI) {
		const shouldInsert = await ctx.ui.confirm("Insert markdown?", `Generated ${fileName}. Insert an image markdown snippet into ${post.fileName}?`);
		if (shouldInsert) {
			const anchor = await ctx.ui.editor("Insert after exact text", "Paste an exact heading, sentence, or paragraph from the post to insert after. Leave empty to skip insertion.");
			if (anchor?.trim()) {
				const postContent = await readFile(post.absolutePath, "utf8");
				const updated = insertMarkdownAfterAnchor(postContent, anchor.trim(), markdownSnippet);
				if (updated) {
					await writeFile(post.absolutePath, updated, "utf8");
					inserted = true;
					const buildResult = await runWithLoader(ctx, `Building site after inserting ${fileName}...`, async (signal) => runBuild(pi, ctx, signal));
					if (!buildResult) return undefined;
					build = buildResult;
				} else {
					ctx.ui.notify("Anchor not found. Markdown snippet loaded into the editor instead.", "warning");
				}
			}
		}
	}

	const result: GeneratedImageResult = { kind: "inline", post, outputPath, prompt, size, quality: "medium", webpBytes: generated.outputStats.size, altText, markdownSnippet, inserted, build };
	pi.sendMessage({ customType: "blog-workflows", content: summarizeGeneratedImage(ctx, result), display: true, details: result });
	if (!result.inserted && ctx.hasUI) {
		ctx.ui.setEditorText(`Add this image where it belongs in ${post.relativePath}:\n\n${markdownSnippet}`);
	}
	ctx.ui.notify(result.inserted ? `Generated and inserted inline image: ${fileName}` : `Generated inline image: ${fileName}`, result.build.ok ? "info" : "error");
	return result;
}

async function loadFileIfExists(cwd: string, relativePath: string): Promise<string> {
	const filePath = path.join(cwd, relativePath);
	if (!existsSync(filePath)) return `[missing: ${relativePath}]`;
	return readFile(filePath, "utf8");
}

async function buildReviewPrompt(cwd: string, targetPost: Post): Promise<string> {
	const [targetContent, voice, agents, claude] = await Promise.all([
		readFile(targetPost.absolutePath, "utf8"),
		loadFileIfExists(cwd, "voice.md"),
		loadFileIfExists(cwd, "AGENTS.md"),
		loadFileIfExists(cwd, "CLAUDE.md"),
	]);

	const references = await Promise.all(
		mostRecentPublishedPosts(cwd, targetPost.slug, REVIEW_REFERENCE_POST_COUNT).map(async (post) => ({
			post,
			content: await readFile(post.absolutePath, "utf8"),
		})),
	);

	const referenceBlocks = references
		.map(
			({ post, content }, index) => `### Reference post ${index + 1}: ${post.title} (${post.relativePath})\n\n\`\`\`markdown\n${content}\n\`\`\``,
		)
		.join("\n\n");

	return `Perform a critical review of the blog post below for content, flow, voice, and mechanics. Do not edit files. Return only the review in the requested markdown format.

## Review workflow

### Step 1: Use these materials

- Target post: ${targetPost.relativePath}
- voice.md is authoritative for voice, tone, punctuation, formatting, and style.
- AGENTS.md and CLAUDE.md contain project-specific writing conventions.
- The reference posts are recent published posts for voice calibration.

### Step 2: Establish context before evaluation

Before any evaluation, write a brief context section:

- **Thesis**: What is the post's central argument or observation?
- **Prompt**: What seems to have prompted this post (experience, trend, event)?
- **Arc**: How does the post develop its idea (for example: concrete opening -> analysis -> counterargument -> open close)?

This context frames the review. A post about personal experience has different content expectations than one making technical claims.

### Step 3: Evaluate across four dimensions

For each finding, assign a severity:

| Severity | Meaning | Action |
|----------|---------|--------|
| **Revise** | Undermines the post's effectiveness or violates voice | Must address before publishing |
| **Consider** | Would meaningfully strengthen the post | Worth addressing |
| **Note** | Minor observation or pattern to be aware of | Optional |

Be specific. Quote the problematic text and explain why it does not work. When suggesting changes, offer a concrete rewrite.

#### 1. Content

Evaluate whether the post's argument is sound and well-supported.

Check for:
- Thesis clarity: Can you state the central argument in one sentence? If not, the post may lack focus.
- Evidence: Are claims supported by concrete evidence (personal experience, citations, examples)? Flag unsupported assertions.
- Counterarguments: Does the post address obvious objections? Strong posts on this blog acknowledge tension rather than arguing past it.
- Essentiality: Does every section serve the argument? Flag paragraphs that could be cut without losing anything.
- Citations: Are external claims linked? Do links follow voice.md format?

#### 2. Flow

Evaluate how the post moves the reader through its ideas.

Check for:
- Opening: Does it ground the reader in something concrete and specific? This blog should not open with abstractions or thesis statements. It opens with situations: a client email, a tennis club, a debugging session.
- Arc: Does the post follow a natural progression? Typical pattern: concrete situation -> development and analysis -> complication or counterargument -> implications -> open close. Not every post follows this exactly, but there should be a discernible shape.
- Transitions: Are section breaks (---) placed at genuine tonal or topical shifts? Do bridging sentences connect sections naturally rather than announcing what comes next?
- Closing: Use voice.md closing guidance. Flag tidy conclusions, ceremonial callbacks to the opening, or unnecessary wrap-up paragraphs.
- Pacing: Is paragraph length varied? Long analytical paragraphs should be balanced by shorter grounding ones. Flag monotonous paragraph lengths.

#### 3. Voice

This is the most important dimension. voice.md is authoritative. Compare against both voice.md and the reference posts.

Flag violations of voice.md rules, including sentence rhythm, directness, personal grounding, tone, phrases to avoid, emphasis/formatting, and claims. When flagging, reference the specific voice.md section being violated.

#### 4. Mechanics

Quick checks for formatting consistency per voice.md:

- Punctuation
- Citations
- Frontmatter: required fields present (title, description, pubDate). draft: true if not ready.

## Output format

\`\`\`markdown
## Review: [Post Title]

### Context
[Thesis, prompt, and arc as described above]

### Content
[Findings with severity tags]

### Flow
[Findings with severity tags]

### Voice
[Findings with severity tags]

### Mechanics
[Findings with severity tags]

### Summary
[2-3 sentences: overall assessment, most important thing to address, and what is working well]
\`\`\`

Finding format:

> **[Severity]** - [What the issue is]
>
> [Quoted text from the post]
>
> [Why it does not work, referencing the specific criterion]
>
> [Suggested revision if applicable]

---

## Project writing guidance: voice.md

\`\`\`markdown
${voice}
\`\`\`

## Project guidance: AGENTS.md

\`\`\`markdown
${agents}
\`\`\`

## Project guidance: CLAUDE.md

\`\`\`markdown
${claude}
\`\`\`

## Target post: ${targetPost.title} (${targetPost.relativePath})

\`\`\`markdown
${targetContent}
\`\`\`

## Recent published reference posts

${referenceBlocks || "No recent published reference posts found."}
`;
}

async function reviewPost(pi: ExtensionAPI, ctx: any, rawArgs: string): Promise<void> {
	const tokens = parseArgs(rawArgs);
	const send = tokens.includes("--send") || tokens.includes("-s");
	const targetArg = tokens.find((token) => token !== "--send" && token !== "-s");

	let targetPost: Post | undefined;
	if (targetArg) {
		targetPost = findPost(ctx.cwd, targetArg);
		if (!targetPost) {
			ctx.ui.notify(`Post not found: ${targetArg}`, "error");
			return;
		}
	} else if (ctx.hasUI) {
		targetPost = await choosePost(ctx, "Choose post to review", "mtime");
	} else {
		targetPost = mostRecentlyModifiedPost(ctx.cwd);
	}

	if (!targetPost) {
		ctx.ui.notify("No post selected", "warning");
		return;
	}

	const prompt = await runWithLoader(ctx, `Gathering review materials for ${targetPost.slug}...`, async () => buildReviewPrompt(ctx.cwd, targetPost));
	if (!prompt) return;

	if (send || !ctx.hasUI) {
		pi.sendUserMessage(prompt);
		ctx.ui.notify(`Review started for ${targetPost.slug}`, "info");
		return;
	}

	ctx.ui.setEditorText(prompt);
	ctx.ui.notify(`Review prompt loaded for ${targetPost.slug}. Edit or submit when ready. Use /blog-review --send to run directly.`, "info");
}

function postCompletions(cwd: string, prefix: string) {
	const token = /\s$/.test(prefix) ? "" : parseArgs(prefix).at(-1) ?? prefix.trim();
	const posts = listPosts(cwd);
	const filtered = posts.filter((post) => post.slug.startsWith(token) || post.title.toLowerCase().includes(token.toLowerCase()));
	return filtered.slice(0, 20).map((post) => ({
		value: post.slug,
		label: post.slug,
		description: `${post.title}${post.draft ? " [draft]" : ""}`,
	}));
}

function heroCompletions(prefix: string) {
	const hasWhitespace = /\s/.test(prefix);
	if (!hasWhitespace) return null;
	const completions = postCompletions(process.cwd(), prefix);
	return completions.length > 0 ? completions : null;
}

export default function blogWorkflows(pi: ExtensionAPI): void {
	pi.registerMessageRenderer("blog-workflows", (message, _options, theme) => {
		return new Text(theme.fg("accent", message.content), 0, 0);
	});

	pi.registerCommand("blog-hero", {
		description: "Convert an image to WebP, add it as a post heroImage, and run the Astro build",
		getArgumentCompletions: heroCompletions,
		handler: async (args, ctx) => {
			await addHeroImage(pi, ctx, args);
		},
	});

	pi.registerCommand("blog-hero-create", {
		description: "Generate a hero image with OpenAI gpt-image-2, save it, update frontmatter, and run the Astro build",
		getArgumentCompletions: (prefix) => {
			const completions = postCompletions(process.cwd(), prefix);
			return completions.length > 0 ? completions : null;
		},
		handler: async (args, ctx) => {
			await createGeneratedHeroImage(pi, ctx, args);
		},
	});

	pi.registerCommand("blog-image-create", {
		description: "Generate an inline post image with OpenAI gpt-image-2 and provide or insert the Markdown snippet",
		getArgumentCompletions: (prefix) => {
			const completions = postCompletions(process.cwd(), prefix);
			return completions.length > 0 ? completions : null;
		},
		handler: async (args, ctx) => {
			await createGeneratedInlineImage(pi, ctx, args);
		},
	});

	pi.registerCommand("blog-review", {
		description: "Prepare a critical blog post review prompt using voice.md and recent published posts",
		getArgumentCompletions: (prefix) => {
			const completions = postCompletions(process.cwd(), prefix);
			return completions.length > 0 ? completions : null;
		},
		handler: async (args, ctx) => {
			await reviewPost(pi, ctx, args);
		},
	});
}
