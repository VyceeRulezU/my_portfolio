# AGENTS.md

Instructions for AI coding agents working in this repo: Victor Ironali's portfolio (React 19 + Vite, deployed on Vercel from `main`). Read `README.md` for the full architecture.

## Commands

```bash
npm run dev          # http://localhost:5174 (fixed port; must stay on Sanity's CORS list)
npm run build        # must pass before you commit; it fails on leftover "TODO:" placeholders
npm run lint
npm run project:add -- <slug> <image-folder> [--first] [--overwrite]
npm run content:push # mirror content/projects/*.md into Sanity (backup) after content changes
npm run r2:upload -- <file> <r2-key>   # single image upload (resized copies are made automatically)
```

Scripts that touch R2 or Sanity need `.env` and `.env.local` on this machine. If they're missing, stop and tell the user; don't work around it.

## Where things live

- **Project case studies:** `content/projects/<slug>.md`. These files are the **source of truth**. Sanity is only a backup and fallback, so never edit project content in Sanity.
- **Images:** Cloudflare R2, referenced in frontmatter by key (e.g. `portfolio/whhf/cover.png`), never by full URL and never committed to the repo.
- **Everything else** (hero, about, experience, skills): the components in `src/components/` and `src/pages/`.

## Adding a project

1. Get from the user: the image folder, the slug (lowercase, dashes), and notes or facts about the project. Ask for anything missing rather than guessing.
2. The image folder layout, with files ordered by name (prefix them `01-`, `02-`, …):
   ```
   cover.png
   gallery/…              process / screens, shown in the gallery
   overview/ problem/ solution/ impact/…   optional images under that section
   ```
3. Run `npm run project:add -- <slug> "<folder>"`. Add `--first` if the project should appear first (usually true for new work). This uploads the images and creates `content/projects/<slug>.md` with every image path filled in and `TODO:` placeholders.
4. Replace **every** `TODO:` with real copy (see the rules below). Delete the `url:` line if there's no live link.
5. Run `npm run build` and fix any errors, then `npm run content:push`.
6. Commit on a branch (never directly to `main`) and tell the user what you wrote and anything you were unsure of.

To add images to an existing project, run the same command with the existing slug. It appends the images and leaves the text alone.

## File format

```markdown
---
title: Project name
slug: project-name            # must match the file name
num: '01'                     # order on the home page
type: live                    # live | case | other
role: Product Designer & UX Engineer
year: '2026'
url: https://example.com      # optional
headline: One line shown as the case-study title.
desc: One or two sentences for the project card.
cover: portfolio/project-name/cover.png
gallery:
  - portfolio/project-name/gallery/01-home.png
images:                        # optional, per section
  solution:
    - portfolio/project-name/solution/01-flow.png
aliases: []                    # optional old slugs that redirect here
private: false                 # true = body lives in Sanity behind a password; don't set this without the user
---
## Overview
## Problem
## Solution
## Impact
```

- Exactly these four `##` headings split the sections. Inside a section, use `###` or smaller headings, paragraphs, `-` lists and `**bold**`.
- Keep `year` and `num` quoted strings.

## Writing rules for case-study copy

- **Only state facts the user gave you** or that you can verify (the live site, their repo). Never invent metrics, percentages, user counts, clients or outcomes. If there are no numbers, write qualitatively.
- Match the existing case studies' voice: first person, direct, specific about decisions and trade-offs. Read one or two files in `content/projects/` before writing.
- Overview gives the context, the client and Victor's role. Problem covers users, pain points and constraints. Solution covers the key design decisions and what was built. Impact covers outcomes and what shipped.
- Keep `desc` to about 25 words. It sits on a card.
- List anything you inferred or were unsure about in your summary to the user.

## Don'ts

- Don't commit `.env`, `.env.local` or any secret, and don't put secrets in `VITE_*` variables (those ship to the browser).
- Don't commit image files; they go to R2.
- Don't push to `main` or merge without the user asking.
- Don't edit or delete content in Sanity or objects in R2 beyond what the task needs.
- Don't put private case-study content in this repo; it's public on GitHub.
