import type { ExtensionContext } from "@earendil-works/pi-coding-agent";

export const IMAGE_MODELS = [
	{ id: "gpt-image-2.5-flare", label: "GPT Image 2.5 Flare - fast everyday generation (default)" },
	{ id: "gpt-image-2.5-sunburst", label: "GPT Image 2.5 Sunburst - highest capability / precise editing" },
	{ id: "gpt-image-2", label: "GPT Image 2 - previous model" },
] as const;

export type ImageModel = (typeof IMAGE_MODELS)[number]["id"];
export const DEFAULT_IMAGE_MODEL: ImageModel = IMAGE_MODELS[0].id;
export const IMAGE_QUALITY = "medium";

type ModelPickerContext = {
	hasUI: boolean;
	ui: Pick<ExtensionContext["ui"], "select">;
};

export async function chooseImageModel(ctx: ModelPickerContext): Promise<ImageModel | undefined> {
	if (!ctx.hasUI) return DEFAULT_IMAGE_MODEL;
	const selected = await ctx.ui.select("Image model", IMAGE_MODELS.map((model) => model.label));
	// Canceling must not silently select the default or make a paid request.
	return IMAGE_MODELS.find((model) => model.label === selected)?.id;
}

export async function generateOpenAIWebp(prompt: string, size: string, model: ImageModel, signal?: AbortSignal): Promise<Buffer> {
	const apiKey = process.env.OPENAI_API_KEY;
	if (!apiKey) {
		throw new Error("OPENAI_API_KEY is required for image generation");
	}

	// One request to the selected model; failures never trigger a model fallback.
	const response = await fetch("https://api.openai.com/v1/images/generations", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`,
		},
		body: JSON.stringify({
			model,
			prompt,
			n: 1,
			size,
			quality: IMAGE_QUALITY,
			output_format: "webp",
			output_compression: 85,
			background: "opaque",
		}),
		signal,
	});

	if (!response.ok) {
		const text = await response.text();
		throw new Error(`OpenAI image generation failed for ${model} (${response.status}): ${text.slice(0, 800)}`);
	}

	const json = await response.json() as { data?: Array<{ b64_json?: string }> };
	const b64 = json.data?.[0]?.b64_json;
	if (!b64) {
		throw new Error("OpenAI image generation response did not include data[0].b64_json");
	}
	return Buffer.from(b64, "base64");
}
