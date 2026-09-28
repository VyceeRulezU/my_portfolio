// Portable Text <-> Markdown for the subset the case studies use:
// paragraphs, headings, bullet/numbered lists (nested), strong / em / code marks, line breaks.
import { randomUUID } from 'node:crypto';
import { marked } from 'marked';

const newKey = () => randomUUID().replace(/-/g, '').slice(0, 12);
const sameMarks = (a = [], b = []) => a.length === b.length && a.every((m) => b.includes(m));

function mergeSpans(spans) {
  const out = [];
  for (const span of spans) {
    const prev = out[out.length - 1];
    if (prev && sameMarks(prev.marks, span.marks)) prev.text += span.text;
    else out.push({ ...span, marks: [...(span.marks || [])] });
  }
  return out;
}

// ---------- Portable Text -> Markdown ----------

const escapeInline = (text) => text.replace(/([\\`*_[\]])/g, '\\$1');

function spanToMarkdown({ text = '', marks = [] }) {
  if (!marks.length || !text.trim()) return escapeInline(text);
  const lead = text.match(/^\s*/)[0];
  const trail = text.match(/\s*$/)[0];
  let core = marks.includes('code') ? `\`${text.trim()}\`` : escapeInline(text.trim());
  if (marks.includes('em')) core = `*${core}*`;
  if (marks.includes('strong')) core = `**${core}**`;
  return lead + core + trail;
}

const escapeLineStart = (line) => line.replace(/^(\s*)(\d+)\./, '$1$2\\.').replace(/^(\s*)([#>+-])/, '$1\\$2');

// Blank lines inside a block become real paragraph breaks; single newlines become hard line breaks.
function blockText(block) {
  const text = mergeSpans(block.children || []).map(spanToMarkdown).join('');
  return text
    .split(/\n{2,}/)
    .map((para) => para.split('\n').map(escapeLineStart).join('  \n').trim())
    .filter(Boolean)
    .join('\n\n');
}

export function portableTextToMarkdown(blocks = []) {
  if (typeof blocks === 'string') return escapeInline(blocks);
  let out = '';
  let prevWasList = false;
  for (const block of blocks) {
    if (block._type !== 'block') continue;
    const text = blockText(block);
    if (!text.trim()) continue;
    let line;
    if (block.listItem) {
      const indent = '   '.repeat((block.level || 1) - 1);
      line = `${indent}${block.listItem === 'number' ? '1.' : '-'} ${text}`;
    } else {
      const heading = /^h([1-6])$/.exec(block.style || '');
      line = heading ? `${'#'.repeat(Math.max(3, Number(heading[1])))} ${text}` : text;
    }
    out += out ? (prevWasList && block.listItem ? '\n' : '\n\n') : '';
    out += line;
    prevWasList = Boolean(block.listItem);
  }
  return out;
}

// ---------- Markdown -> Portable Text ----------

const decodeEntities = (s) => s
  .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

function inlineToSpans(tokens = [], marks = []) {
  const spans = [];
  for (const t of tokens) {
    if (t.type === 'strong') spans.push(...inlineToSpans(t.tokens, [...marks, 'strong']));
    else if (t.type === 'em') spans.push(...inlineToSpans(t.tokens, [...marks, 'em']));
    else if (t.type === 'codespan') spans.push({ text: decodeEntities(t.text), marks: [...marks, 'code'] });
    else if (t.type === 'br') spans.push({ text: '\n', marks });
    else if (t.tokens?.length) spans.push(...inlineToSpans(t.tokens, marks));
    else spans.push({ text: decodeEntities(t.text ?? t.raw ?? ''), marks });
  }
  return spans;
}

const makeBlock = (spans, extra = {}) => ({
  _type: 'block',
  _key: newKey(),
  style: 'normal',
  markDefs: [],
  ...extra,
  children: mergeSpans(spans).map((s) => ({ _type: 'span', _key: newKey(), text: s.text, marks: s.marks })),
});

function listToBlocks(list, level) {
  const blocks = [];
  for (const item of list.items) {
    const spans = [];
    const nested = [];
    for (const t of item.tokens) {
      if (t.type === 'list') nested.push(...listToBlocks(t, level + 1));
      else if (t.type === 'text' || t.type === 'paragraph') {
        if (spans.length) spans.push({ text: '\n', marks: [] });
        spans.push(...inlineToSpans(t.tokens || [{ type: 'text', text: t.text }]));
      }
    }
    blocks.push(makeBlock(spans, { listItem: list.ordered ? 'number' : 'bullet', level }), ...nested);
  }
  return blocks;
}

export function markdownToPortableText(markdown = '') {
  const blocks = [];
  for (const token of marked.lexer(markdown)) {
    if (token.type === 'paragraph') blocks.push(makeBlock(inlineToSpans(token.tokens)));
    else if (token.type === 'heading') blocks.push(makeBlock(inlineToSpans(token.tokens), { style: `h${token.depth}` }));
    else if (token.type === 'list') blocks.push(...listToBlocks(token, 1));
  }
  return blocks;
}
