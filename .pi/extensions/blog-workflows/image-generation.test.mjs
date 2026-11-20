import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { registerHooks } from "node:module";
import { tmpdir } from "node:os";
import path from "node:path";
import { beforeEach, test } from "node:test";
import { chooseImageModel, DEFAULT_IMAGE_MODEL, generateOpenAIWebp, IMAGE_MODELS, IMAGE_QUALITY } from "./image-generation.ts";

// Exercise real command handlers without installing Pi or launching an agent/TUI.
const hooks = registerHooks({
	resolve(specifier, context, nextResolve) {
		const stubs = {
			"@earendil-works/pi-coding-agent": "export class BorderedLoader { signal = new AbortController().signal; }",
			"@earendil-works/pi-tui": "export class Text {}",
		};
		if (specifier in stubs) {
			return { url: `data:text/javascript,${encodeURIComponent(stubs[specifier])}`, shortCircuit: true };
		}
		return nextResolve(specifier, context);
	},
});
const { default: blogWorkflows } = await import("./index.ts");
hooks.deregister();

beforeEach((t) => {
	const previousKey = process.env.OPENAI_API_KEY;
	process.env.OPENAI_API_KEY = "test-key";
	t.after(() => {
		if (previousKey === undefined) delete process.env.OPENAI_API_KEY;
		else process.env.OPENAI_API_KEY = previousKey;
	});
	t.mock.method(globalThis, "fetch", async () => { throw new Error("Unexpected network request"); });
});

function mockImageResponse(t) {
	return t.mock.method(globalThis, "fetch", async () => new Response(JSON.stringify({
		data: [{ b64_json: Buffer.from("test image bytes").toString("base64") }],
	})));
}

async function commandFixture(t, selectedModel, hasUI = true) {
	const cwd = await mkdtemp(path.join(tmpdir(), "blog-image-test-"));
	t.after(() => rm(cwd, { recursive: true, force: true }));
	const postsDir = path.join(cwd, "src/content/posts");
	await mkdir(postsDir, { recursive: true });
	const postPath = path.join(postsDir, "example.md");
	await writeFile(postPath, '---\ntitle: "Example"\ndescription: "Test image"\npubDate: 2026-09-16\ndraft: true\n---\n\nTest body.\n');
	const commands = new Map();
	const messages = [];
	const confirmations = [];
	const builds = [];
	blogWorkflows({
		registerMessageRenderer() {},
		registerCommand(name, command) { commands.set(name, command); },
		sendMessage(message) { messages.push(message); },
		async exec(...args) { builds.push(args); return { code: 0, stdout: "built", stderr: "" }; },
	});
	const ctx = {
		cwd, hasUI,
		ui: {
			async editor(_title, prompt) { return prompt; },
			async input(_title, placeholder) { return placeholder; },
			async select(title, options) {
				if (title === "Image model") return IMAGE_MODELS.find((model) => model.id === selectedModel)?.label;
				return options[0];
			},
			async confirm(title, text) {
				confirmations.push(text);
				return title !== "Insert markdown?";
			},
			custom(factory) { return new Promise((done) => factory({}, {}, {}, done)); },
			notify() {}, setStatus() {}, setEditorText() {},
		},
	};
	return { commands, ctx, messages, confirmations, builds, postsDir, postPath };
}

test("noninteractive selection defaults to Flare without opening a picker", async () => {
	assert.equal(DEFAULT_IMAGE_MODEL, "gpt-image-2.5-flare");
	assert.equal(await chooseImageModel({ hasUI: false, ui: { select() { assert.fail("unexpected UI"); } } }), DEFAULT_IMAGE_MODEL);
});

for (const model of IMAGE_MODELS) {
	test(`picker and request use ${model.id}`, async (t) => {
		const selected = await chooseImageModel({ hasUI: true, ui: { async select(_title, labels) {
			assert.equal(labels[0], IMAGE_MODELS[0].label);
			return model.label;
		} } });
		assert.equal(selected, model.id);
		const fetchMock = mockImageResponse(t);
		const signal = new AbortController().signal;
		const bytes = await generateOpenAIWebp("test prompt", "1536x864", selected, signal);
		assert.equal(bytes.toString(), "test image bytes");
		const [url, request] = fetchMock.mock.calls[0].arguments;
		assert.equal(url, "https://api.openai.com/v1/images/generations");
		assert.equal(request.method, "POST");
		assert.equal(request.signal, signal);
		assert.equal(request.headers.Authorization, "Bearer test-key");
		assert.deepEqual(JSON.parse(request.body), {
			model: model.id, prompt: "test prompt", n: 1, size: "1536x864",
			quality: IMAGE_QUALITY, output_format: "webp", output_compression: 85, background: "opaque",
		});
	});
}

for (const kind of ["hero", "image"]) {
	for (const model of IMAGE_MODELS) {
		test(`${kind} command confirms, requests, and reports ${model.id}`, async (t) => {
			const fixture = await commandFixture(t, model.id);
			const fetchMock = mockImageResponse(t);
			const command = fixture.commands.get(`blog-${kind}-create`);
			assert.match(command.description, /default: gpt-image-2\.5-flare/);
			await command.handler("example", fixture.ctx);
			assert.equal(fetchMock.mock.callCount(), 1);
			assert.equal(JSON.parse(fetchMock.mock.calls[0].arguments[1].body).model, model.id);
			assert.ok(fixture.confirmations.some((text) => text.includes(`OpenAI ${model.id} and write`)));
			assert.equal(fixture.messages.length, 1);
			assert.equal(fixture.messages[0].details.model, model.id);
			assert.ok(fixture.messages[0].content.includes(`Generation: ${model.id}, 1536x864, medium quality, WebP`));
			assert.equal(await readFile(fixture.messages[0].details.outputPath, "utf8"), "test image bytes");
			assert.equal(fixture.builds.length, kind === "hero" ? 1 : 0);
			if (kind === "hero") assert.match(await readFile(fixture.postPath, "utf8"), /heroImage: \.\/example.webp/);
		});
	}

	test(`${kind} picker cancellation does not call the API or write files`, async (t) => {
		const fixture = await commandFixture(t, undefined);
		const fetchMock = mockImageResponse(t);
		await fixture.commands.get(`blog-${kind}-create`).handler("example", fixture.ctx);
		assert.equal(fetchMock.mock.callCount(), 0);
		assert.equal(fixture.messages.length, 0);
		assert.equal(fixture.confirmations.length, 0);
		assert.deepEqual(await readdir(fixture.postsDir), ["example.md"]);
	});

	test(`${kind} noninteractive command uses and reports Flare`, async (t) => {
		const fixture = await commandFixture(t, undefined, false);
		const fetchMock = mockImageResponse(t);
		await fixture.commands.get(`blog-${kind}-create`).handler("example", fixture.ctx);
		assert.equal(JSON.parse(fetchMock.mock.calls[0].arguments[1].body).model, DEFAULT_IMAGE_MODEL);
		assert.equal(fixture.messages[0].details.model, DEFAULT_IMAGE_MODEL);
	});
}

test("API failure identifies the chosen model and never falls back", async (t) => {
	const fetchMock = t.mock.method(globalThis, "fetch", async () => new Response("model not available", { status: 403 }));
	await assert.rejects(generateOpenAIWebp("test", "1536x864", "gpt-image-2.5-sunburst"), /gpt-image-2\.5-sunburst \(403\): model not available/);
	assert.equal(fetchMock.mock.callCount(), 1);
});

test("missing key fails before making a request", async () => {
	delete process.env.OPENAI_API_KEY;
	await assert.rejects(generateOpenAIWebp("test", "1536x864", DEFAULT_IMAGE_MODEL), /OPENAI_API_KEY is required/);
	assert.equal(globalThis.fetch.mock.callCount(), 0);
});

test("missing image payload fails instead of reporting success", async (t) => {
	t.mock.method(globalThis, "fetch", async () => new Response('{"data":[]}'));
	await assert.rejects(generateOpenAIWebp("test", "1536x864", DEFAULT_IMAGE_MODEL), /did not include data\[0\].b64_json/);
});

test("aborted request propagates without retrying", async (t) => {
	const signal = AbortSignal.abort();
	const fetchMock = t.mock.method(globalThis, "fetch", async (_url, options) => options.signal.throwIfAborted());
	await assert.rejects(generateOpenAIWebp("test", "1536x864", DEFAULT_IMAGE_MODEL, signal), { name: "AbortError" });
	assert.equal(fetchMock.mock.callCount(), 1);
});
