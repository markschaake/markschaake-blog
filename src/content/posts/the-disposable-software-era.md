---
title: "The Disposable Software Era"
description: "When building software becomes cheaper than buying it, the economics of SaaS start to look different."
pubDate: 2026-01-30
draft: false
tags: ["ai", "software", "saas"]
---

<a href="https://www.axios.com/2026/01/13/anthropic-claude-code-cowork-vibe-coding" target="_blank" rel="noopener noreferrer">Anthropic shipped Cowork</a> in about 10 days using Claude Code itself. Four engineers, AI-assisted development. These aren't startups trying to prove a point. These are the companies building the tools.

What happens to SaaS when building is this cheap?

## The Economics Flipped

Software used to be expensive to build and cheap to distribute. That's the entire SaaS model: amortize high development costs across thousands of customers, deliver via browser, collect monthly fees. The math worked because building was hard.

Now building is fast. <a href="https://fortune.com/2026/01/29/100-percent-of-code-at-anthropic-and-openai-is-now-ai-written-boris-cherny-roon/" target="_blank" rel="noopener noreferrer">Anthropic reports 70-90% of code</a> at the company is written by AI. <a href="https://www.anthropic.com/news/anthropic-acquires-bun-as-claude-code-reaches-usd1b-milestone" target="_blank" rel="noopener noreferrer">Claude Code grew from research preview to billion-dollar product</a> in six months. <a href="https://sacra.com/research/cursor-at-100m-arr/" target="_blank" rel="noopener noreferrer">Cursor hit $100M ARR</a> faster than any company in history - 12 months.

The economics are inverting. When building is cheap, "buying" loses its appeal. Why pay $50/seat/month for a tool that does 80% of what you need when you can build the exact thing you need in a weekend?

a16z calls this "<a href="https://a16z.com/disposable-software/" target="_blank" rel="noopener noreferrer">disposable software</a>" - applications that never justified engineering investment now make sense because the investment required has collapsed. The constraint is no longer ROI. It's imagination.

## What This Looks Like

The Cowork example is instructive. Four engineers, 10 days, using Claude Code itself. That's not a prototype. That's a product.

This isn't hypothetical. Last year I built a 200,000-line TypeScript MVP for a startup client in 7 weeks - by myself. Before AI tools, that's 12-18 months of work for a software team. And that was before the latest model improvements and tooling refinements. The floor keeps rising.

## The Opposition Steelmanned

Before declaring SaaS dead, the counterarguments deserve serious treatment.

**Security is a real problem.** <a href="https://www.veracode.com/blog/genai-code-security-report/" target="_blank" rel="noopener noreferrer">Veracode tested 100+ LLMs</a> and found 45% of code samples failed security tests, introducing OWASP Top 10 vulnerabilities. Java was worst at 72% failure. The <a href="https://cloudsecurityalliance.org/blog/2025/07/09/understanding-security-risks-in-ai-generated-code" target="_blank" rel="noopener noreferrer">Cloud Security Alliance</a> found 62% of AI-generated code contains design flaws or known vulnerabilities. <a href="https://www.theregister.com/2025/12/17/ai_code_bugs/" target="_blank" rel="noopener noreferrer">CodeRabbit's analysis</a> showed AI code has 1.75x more logic errors, 1.57x more security findings, and 2.74x more XSS vulnerabilities than human-written code. These studies vary in scope, language coverage, and model versions tested.

The "vibe coding hangover" is real. Speed up front, chaos downstream.

**Enterprise systems have moats.** Compliance frameworks like GDPR and SOC 2 are hard to replicate. Systems of record - clinical trial management, financial reconciliation, regulated industries - have data moats and regulatory logic that custom solutions can't easily absorb.

<a href="https://www.bain.com/insights/will-agentic-ai-disrupt-saas-technology-report-2025/" target="_blank" rel="noopener noreferrer">Bain's analysis</a> is useful here: workflows that rely on human judgment, proprietary data, and regulatory oversight are defensible. The CRM you built in a weekend won't replace Salesforce for companies that need 15 years of institutional knowledge encoded in their data model.

**History suggests transitions expand rather than replace.** "Cloud will replace on-prem" became "hybrid is the norm." Global SaaS is still growing - $197B in 2023, $232B projected for 2025. These transitions are slower and messier than they look in the moment.

**The 80/20 problem.** AI gets you 80% of the way fast, but the last 20% - reliable, secure, maintainable - still requires engineering judgment. Getting to "works on my machine" is trivial. Getting to "runs in production under load without leaking data" is not.

## The Synthesis

SaaS doesn't die overnight. It evolves.

Seat-based pricing makes less sense when the software required to service a seat can be generated on demand. Outcome-based pricing rises. The winning position for existing SaaS players is probably unique data plus AI augmentation - hard to replicate datasets wrapped in AI-powered interfaces.

For most businesses, the calculation is shifting. Custom solutions that were never worth the engineering investment are now worth considering. Not for everything - you're not going to build your own Stripe - but for the long tail of internal tools, specific workflows, and niche applications.

## The Uncertain Ground

The question isn't whether software development economics are changing. The examples are too stark to ignore.

The question is how fast.

For SaaS companies: adapt or become the next generation's legacy system. The seat-based model is under pressure. The companies with unique data and real switching costs will survive. The ones competing on features alone are vulnerable.

For businesses: the math is starting to favor custom solutions in places it never did before. Worth running the numbers. But don't assume AI-generated code is production-ready without the same scrutiny you'd apply to any new vendor.

No confident predictions here. Just a recognition that the ground is shifting - and that uncertainty should inform strategy without paralyzing it.
