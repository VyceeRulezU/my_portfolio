// Project content files: YAML frontmatter + one "## <Section>" heading per case-study section.
// Shared by the Vite plugin (build) and scripts/content-sync.js.
import matter from 'gray-matter';

export const SECTIONS = ['overview', 'problem', 'solution', 'impact'];
export const SECTION_TITLES = { overview: 'Overview', problem: 'Problem', solution: 'Solution', impact: 'Impact' };

export function parseProjectFile(source, file = 'project file') {
  const { data, content } = matter(source);
  const sections = {};
  let current = null;
  for (const line of content.split(/\r?\n/)) {
    const heading = line.match(/^## (.+?)\s*$/);
    if (heading) {
      current = SECTIONS.find((s) => SECTION_TITLES[s].toLowerCase() === heading[1].toLowerCase());
      if (!current) throw new Error(`${file}: unknown section "## ${heading[1]}" (expected ${Object.values(SECTION_TITLES).join(', ')})`);
      sections[current] = [];
    } else if (current) {
      sections[current].push(line);
    }
  }
  for (const key of Object.keys(sections)) sections[key] = sections[key].join('\n').trim();
  for (const field of ['title', 'slug', 'num', 'type']) {
    if (!data[field]) throw new Error(`${file}: missing "${field}" in frontmatter`);
  }
  return { data, sections };
}

export function stringifyProjectFile(data, sections) {
  const body = SECTIONS
    .filter((s) => sections[s])
    .map((s) => `## ${SECTION_TITLES[s]}\n\n${sections[s].trim()}\n`)
    .join('\n');
  return matter.stringify(body, data);
}
