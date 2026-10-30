**中文** · [README.md](./README.md)

<p align="center">
  <img src="assets/banner.svg" alt="Tech News Hub">
</p>

<p align="center">
  <a href="#what-it-is">30-Second Overview</a> · <a href="#features">Features</a> · <a href="#quick-start">Quick Start</a> · <a href="#how-it-works">How It Works</a> · <a href="#contributing">Contributing</a>
</p>

[![Build](https://github.com/huanweide/tech-news-hub/actions/workflows/weekly-update.yml/badge.svg)](https://github.com/huanweide/tech-news-hub/actions/workflows/weekly-update.yml)
[![Stars](https://img.shields.io/github/stars/huanweide/tech-news-hub)](https://github.com/huanweide/tech-news-hub/stargazers)
[![Site](https://img.shields.io/badge/site-huanweide.github.io%2Ftech--news--hub-blue)](https://huanweide.github.io/tech-news-hub/)
[![Non-profit](https://img.shields.io/badge/nature-non--profit%20public%20science-9b59b6)](https://huanweide.github.io/tech-news-hub/)

# TechPulse — turn weekly tech news into a traceable, searchable, deep-readable knowledge map

A **non-profit, public-interest science-communica­tion** weekly tech-news site. Instead of dumping an information feed, it adds **original sources, an 8-dimension deep read, and a searchable knowledge base** to every story, plus a **Bring-Your-Own-Key (BYOK)** AI study assistant that helps you actually read the news through. Purely static, no backend, hosted on GitHub Pages for $0.

> Live site: **https://huanweide.github.io/tech-news-hub/**

> **📦 Portability at a glance**
>
> - **Pure static, no backend**: HTML / CSS / vanilla JS, no framework, no build. Host on GitHub Pages for free, or just double-click `index.html` locally.
> - The LLM assistant is BYOK (the key lives only in your browser); you can read the news and knowledge base without any key.
> - Want your own weekly? Change a single `pulse.config.js` to switch domains.

---

## Who Should Use This

- **Readers tired of feed-only tech news** who want every story backed by its original source and a real explanation.
- **Chinese-reading learners** who want a searchable knowledge base where a term jumps to its architecture diagram and the related stories.
- **People who want an AI assistant to discuss the news** — local-key (BYOK), grounded in this site's sourced knowledge base via retrieval-augmented generation.
- **Anyone hunting for real, sourced model / API discounts** rather than marketed "deals".
- **Developers** who want to fork the shell and run their own weekly in any domain.

## Who Should NOT

- **Real-time breaking-news hunters** — this is a curated *weekly* with depth, not a live firehose of thousands of sources.
- **People who want the AI assistant but won't bring their own key** — the assistant is strictly BYOK; the news and knowledge base themselves work with no key at all.
- **Non-Chinese readers** — the site's editorial content (stories, knowledge base, deal notes) is written in Chinese.

---

## What It Is

Most tech-news sites only give you a feed. TechPulse also gives you the **knowledge map behind the information**:

- **Traceable** — every story carries its original source link; key conclusions can be cross-checked, closing the information gap.
- **Deep-readable** — each piece gets an 8-dimension authoritative breakdown (what actually happened / horizontal comparison / driving logic / real-world output / technical analysis & architecture / industry impact / reader action, etc.), with inline SVG architecture diagrams.
- **Searchable** — professional terms and architecture diagrams aggregate into a knowledge base; term ↔ architecture two-way jumps, click a term to see its definition and linked news.
- **Conversational** — a local-key LLM study assistant does retrieval-augmented generation (RAG) over this site's *sourced, traceable* knowledge base.

## Features

| Feature | Description |
|------|------|
| Authoritative deep read | 8-dimension breakdown of every story, with inline SVG architecture diagrams; theme colors (`var(--brand)` etc.) adapt to light/dark mode |
| Searchable knowledge base | Aggregates professional terms (MoE, RAG, alignment, qubit, brain-computer interface…) and architecture diagrams; a three-pane searchable view (term / architecture / news) with term ↔ architecture two-way jumps |
| Local-key LLM assistant | A right-side drawer, Bring-Your-Own-Key (key stored only in browser `localStorage`, never uploaded); built-in retrieval tools, can chat and jump straight to the article |
| Verified deals circle | Real offers from relays (OpenRouter, etc.) and official providers (SiliconFlow, Volcano Engine, DeepSeek, Alibaba Bailian, Zhipu GLM, Tencent Hunyuan…); filter by type × platform, keyword search, auto-expire on end date; each with an official source |
| Weekly auto-update | GitHub Actions fetches that week's real news + verifies the deals circle and pushes; a quality gate (including axe-core accessibility regression) runs before every push |
| Accessibility-first | Passes axe-core structural rules and WCAG AA contrast (≥ 4.5), locked in as a permanent `npm test` regression gate |
| $0 static site | Pure front-end (HTML / CSS / vanilla JS, no framework, no build), auto-deployed by GitHub Pages |

---

## Quick Start

```bash
# Option 1: just open it (double-click index.html)
# Option 2: local server (recommended, avoids occasional browser file:// limits)
python -m http.server 8080
# then visit http://localhost:8080
```

> The LLM assistant needs the browser to be able to reach the endpoint you configure (e.g. DeepSeek / an OpenAI-compatible service).

---

## Configuration (BYOK)

The LLM study assistant is **Bring-Your-Own-Key**; all keys and memory stay in your local browser. Open the "Assistant" drawer → Configure to set:

| Setting | Description |
|--------|------|
| Provider preset | OpenAI / DeepSeek / Kimi (Moonshot) / Qwen (DashScope) / local Ollama / custom |
| Base URL | OpenAI-compatible `/v1` base, e.g. `https://api.openai.com/v1` |
| Model name | e.g. `gpt-4o-mini`, `deepseek-chat` |
| API key | Stored only in browser `localStorage`, never uploaded to any server |
| Interactive / confirmable / streaming | whether the assistant may call the knowledge-base tools, ask before executing an action, and stream output |

Optional environment variables / secrets for the GitHub Actions auto-update:

| Variable | Purpose |
|------|------|
| `DEEPSEEK_API_KEY` | used to polish deals-circle copy during auto-update (optional; runs fine without it) |

---

## How It Works

```
Public media / RSS (JiQieMachine, QbitAI, 36Kr, SSPai, Hacker News, arXiv…)
        │  fetch + verify
        ▼
news-data.js  ── appends that week's real news weekly (with sources + 8-dimension read)
deals-sources.json ── hand-curated real deals (single source of truth)
        │  deals_update.cjs regenerates idempotently
        ▼
deals-data.js  ── deals-circle data layer
        │
        ▼
Pure static site (HTML/CSS/vanilla JS) ── renders feed / knowledge base / deals / assistant
        │  git push
        ▼
GitHub Pages auto-deploy  +  npm test quality gate (139 assertions + axe-core)
```

1. **News**: from public tech media and RSS, each with an original source link for cross-checking.
2. **Deals circle**: the single source of truth is `deals-sources.json` (hand-curated, each with an official source link); `scripts/deals_update.cjs` regenerates `deals-data.js` from it weekly (skips if unchanged — idempotent). To add/update a real deal, edit `deals-sources.json` and push.
3. **Quality gate**: `npm test` must be fully green before anything goes live, including axe-core accessibility regression and contrast checks.

---

## Weekly Auto-Update Mechanism

| Stage | Main update (GitHub Actions) | Fallback |
|------|------|------|
| Trigger | Scheduled weekly (high-quality AI update + RSS fallback) | same |
| News | fetch that week's real news → append to `news-data.js` | `scripts/weekly_update.cjs` RSS fetch + optional AI summary |
| Deals circle | verify `deals-sources.json` authenticity + check for new deals and write back | `deals_update.cjs` sync (optional `DEEPSEEK_API_KEY` for polishing) |
| Quality gate | `npm test` green | `npm test` green |
| Go live | `git push` → Pages redeploys | same |

Test scripts: `r13_test.cjs`–`r16_test.cjs` (news / knowledge base / assistant), `deals_test.cjs` (deals circle), `a11y_test.cjs` (accessibility).

---

## Make Your Own Weekly

The site's shell — the 8-dimension template, inline SVG architecture diagrams, searchable knowledge base, BYOK assistant, and axe accessibility regression — has nothing to do with "tech". **The news sources, category words, tag pool, and architecture-diagram copy are all externalized in `pulse.config.js`**; change one file to switch to your own domain.

```bash
# Option 1: edit pulse.config.js directly (simplest)
vim pulse.config.js

# Option 2: write a separate config and point to it via env var
cp pulse.config.js my-weekly.config.js
PULSE_CONFIG=./my-weekly.config.js DRY_RUN=1 node scripts/weekly_update.cjs
```

What you can change in `pulse.config.js`:

| Field | Role |
|------|------|
| `site` | site name / subtitle (written into the generated data file's comments) |
| `feeds` | fetch-source list; each `cat` must fall within `categories.ids` |
| `categories` | category id, which category a keyword hit maps to, and the fallback category |
| `categoryKeywords` | words that, when hit, assign to the main category |
| `tagPool` / `tagMax` | candidate tag pool and the max number to take |
| `archLabels` | default wording for each category's architecture diagram |
| `harvest` | only collect the last few days, max N per week |

> **Backward compatibility**: the defaults in `pulse.config.js` match the values previously hard-coded in the scripts one by one, so the author's existing weekly auto-update behavior is unchanged. `scripts/config_test.cjs` guards this equivalence — if config and old behavior diverge, the test goes red immediately.
>
> To adapt to a brand-new domain (say a "biomedicine weekly"), just swap `categories.ids` for your own; the front-end category labels are read automatically from the data layer's `categories[]`.

---

## Directory Structure

```
index.html                page structure
style.css                 styles (light/dark theme / architecture diagrams / knowledge base / assistant drawer / deals)
app.js                    front-end logic (render / search / knowledge base / glossary / LLM assistant / deals)
news-data.js              news data layer (on window.NEWS_DATA)
deals-data.js             deals-circle data layer (auto-generated by deals_update.cjs, do not edit by hand)
deals-sources.json        deals-circle single source of truth (hand-curated real deals)
features.js               helper features (recommendations / popularity)
pulse.config.js           site config: fetch sources / category words / tag pool / architecture-diagram copy
vendor/                   localized third-party deps (Chart.js v4.4.1, MIT)
r13_test.cjs…r16_test.cjs  news / knowledge-base / assistant verification scripts (jsdom)
deals_test.cjs            deals-circle verification script (jsdom)
a11y_test.cjs             accessibility regression test (axe-core + contrast)
scripts/weekly_update.cjs  news auto-fetch script (called by GitHub Actions)
scripts/deals_update.cjs   deals-circle sync script (idempotent regeneration from sources)
.github/workflows/         auto-update pipeline
```

---

## Privacy and BYOK

The LLM assistant is Bring-Your-Own-Key: **the API key is stored only in your browser's `localStorage`**. Requests go directly from your browser to the endpoint you configure; this statically hosted site holds and transmits no key of yours. Conversation / note memory is local and can be cleared separately from the key.

---

## Contributing

- Add / update a real deal: edit `deals-sources.json` (with an official source link) and push; Actions regenerates the data layer automatically.
- Fix a news read or the knowledge base: submit a PR directly in the relevant data file.
- Before submitting, run `npm test` and make sure all test cases and accessibility checks pass (the case count grows with versions; trust the actual output).

---

## Author

Maintained by **huanweide** · [GitHub profile](https://github.com/huanweide)

## Other Tools by the Same Author

> A series of open-source productivity tools; a Star is appreciated:

- 📚 Long-form writing — AI novel workshop, local rule engine, zero-dependency: [visit](https://github.com/huanweide/novel-smith)
- 🎓 Course assistant — Zhihuishu auto-play / resume / AI answers: [visit](https://github.com/huanweide/zhihuishu-helper)
- 🎬 Subtitles / video — one-click Bilibili subtitle extraction (zero-key official subtitles): [visit](https://github.com/huanweide/bili-subtitle-universal)
- 📺 Live subtitles — real-time subtitles for streams / meetings: [visit](https://github.com/huanweide/live-subtitle)
- ✂️ Video summary — one-click long-video summary: [visit](https://github.com/huanweide/video-brief)
- 🖥️ Overview — all the author's open-source projects: [visit](https://github.com/huanweide/family-showcase)
- 🩺 Code health — zero-dependency multi-axis static checkup: [visit](https://github.com/huanweide/doctors)

---

## License

Code is licensed under [MIT](LICENSE).

Content (news reads and knowledge base) is **non-profit public-interest science communication**, for learning reference only; please retain the source when reposting. Copyright of cited third-party information belongs to the original authors; this site only indexes and explains it.
