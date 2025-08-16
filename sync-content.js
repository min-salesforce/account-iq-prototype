#!/usr/bin/env node
// Sync content from content.md into index.html (static bake)
// No external deps; uses naive regex-based updates tailored to current markup

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const INDEX_PATH = path.join(ROOT, 'index.html');
const CONTENT_PATH = path.join(ROOT, 'content.md');

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function write(file, data) {
  fs.writeFileSync(file, data, 'utf8');
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function inlineMarkdownToHtml(text) {
  let s = escapeHtml(text);
  s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/__([^_]+)__/g, '<strong>$1</strong>');
  s = s.replace(/(^|\W)\*([^*]+)\*(?=$|\W)/g, '$1<em>$2</em>');
  s = s.replace(/(^|\W)_([^_]+)_(?=$|\W)/g, '$1<em>$2</em>');
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  return s;
}

function renderContentHTML(text) {
  const src = (text || '').trim();
  if (!src) return '';

  // Code fences
  let remaining = src;
  const codeBlocks = [];
  remaining = remaining.replace(/```([\s\S]*?)```/g, (_, code) => {
    const token = `__CODE_BLOCK_${codeBlocks.length}__`;
    codeBlocks.push(`<pre><code>${escapeHtml(code)}</code></pre>`);
    return token;
  });

  // Bold-only lines as their own blocks
  const linesNorm = [];
  const boldOnlyRe = /^\s*\*\*[^*]+\*\*\s*:?\s*$/;
  remaining.split(/\r?\n/).forEach((ln) => {
    if (boldOnlyRe.test(ln)) {
      if (linesNorm.length && linesNorm[linesNorm.length - 1] !== '') linesNorm.push('');
      linesNorm.push(ln);
      linesNorm.push('');
    } else {
      linesNorm.push(ln);
    }
  });
  remaining = linesNorm.join('\n');

  const blocks = remaining.split(/\n\s*\n/);
  const htmlBlocks = blocks.map((block) => {
    const lines = block.split(/\n/);
    const headingMatch = block.match(/^\s*(#{1,6})\s+(.+)\s*$/);
    if (headingMatch && lines.length === 1) {
      const level = headingMatch[1].length;
      const text = headingMatch[2];
      const content = inlineMarkdownToHtml(text);
      return `<h${level}>${content}</h${level}>`;
    }
    if (lines.every((l) => /^\s*[-*]\s+/.test(l))) {
      const items = lines.map((l) => l.replace(/^\s*[-*]\s+/, ''));
      const lis = items.map((it) => `<li>${inlineMarkdownToHtml(it)}</li>`).join('');
      return `<ul>${lis}</ul>`;
    }
    if (lines.every((l) => /^\s*\d+\.\s+/.test(l))) {
      const items = lines.map((l) => l.replace(/^\s*\d+\.\s+/, ''));
      const lis = items.map((it) => `<li>${inlineMarkdownToHtml(it)}</li>`).join('');
      return `<ol>${lis}</ol>`;
    }
    if (lines.every((l) => /^\s*>\s?/.test(l))) {
      const content = lines.map((l) => l.replace(/^\s*>\s?/, '')).join(' ');
      return `<blockquote>${inlineMarkdownToHtml(content)}</blockquote>`;
    }
    return `<p>${inlineMarkdownToHtml(block)}</p>`;
  });

  let html = htmlBlocks.join('\n');
  codeBlocks.forEach((cb, i) => {
    html = html.replaceAll(`__CODE_BLOCK_${i}__`, cb);
  });
  return html;
}

function parseContentPlan(mdText) {
  const lines = mdText.split(/\r?\n/);
  const cards = {};
  let inCards = false;
  let pendingCardId = null;
  let pendingKey = null;
  let pendingContent = [];

  const flushPending = () => {
    if (pendingCardId && pendingKey === 'content' && pendingContent.length) {
      const val = pendingContent.join('\n').trim();
      cards[pendingCardId] = cards[pendingCardId] || {};
      cards[pendingCardId][pendingKey] = val;
    }
    pendingCardId = null;
    pendingKey = null;
    pendingContent = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^##\s+Cards/.test(line)) { inCards = true; continue; }
    if (inCards && /^##\s+/.test(line)) { inCards = false; flushPending(); break; }
    if (!inCards) continue;

    const m = line.match(/^\s*-\s*\*\*(card-\d+)\.(\w+)\*\*:\s*(.*)$/);
    if (m) {
      if (pendingKey === 'content' && pendingContent.length) flushPending();
      const [, cid, key, rawVal] = m;
      if (rawVal.trim() === '|' && key === 'content') {
        pendingCardId = cid;
        pendingKey = 'content';
        pendingContent = [];
      } else {
        cards[cid] = cards[cid] || {};
        cards[cid][key] = rawVal.trim();
      }
      continue;
    }
    if (pendingKey === 'content') {
      const contLine = line.replace(/^\s{2,}/, '');
      if (/^\s*-\s*\*\*/.test(line) || /^##\s+/.test(line) || /^###\s+/.test(line)) {
        flushPending();
        i -= 1;
      } else {
        pendingContent.push(contLine);
      }
    }
  }
  if (pendingKey === 'content' && pendingContent.length) flushPending();
  return { cards };
}

function ensureDataSpanInOpenTag(openTag, span) {
  // Insert or replace data-span attribute in the opening card tag
  if (/\bdata-span\s*=/.test(openTag)) {
    return openTag.replace(/data-span\s*=\s*"\d+"/, `data-span="${span}"`);
  }
  // insert after data-card-id="..."
  return openTag.replace(/(data-card-id\s*=\s*"card-\d+")/, `$1 data-span="${span}"`);
}

function updateIndexHtml(indexHtml, cardsMap) {
  let html = indexHtml;
  for (const cardId of Object.keys(cardsMap)) {
    const cfg = cardsMap[cardId];

    // 1) Update title (preserving leading SVG if present)
    const h3Re = new RegExp(`(<div class=\"card[^>]*data-card-id=\"${cardId}\"[^>]*>[\\s\\S]*?<div class=\"card-header\">[\\s\\S]*?<h3>)([\\s\\S]*?)(<\\/h3>)`);
    html = html.replace(h3Re, (m, pre, inner, post) => {
      if (!cfg.title) return m;
      const iconMatch = inner.match(/^(\s*<svg[\s\S]*?<\/svg>\s*)/);
      const icon = iconMatch ? iconMatch[1] : '';
      const newInner = icon ? `${icon} ${escapeHtml(cfg.title)}` : escapeHtml(cfg.title);
      return pre + newInner + post;
    });

    // 2) Update span (data-span on opening card tag)
    if (cfg.span) {
      const span = parseInt(String(cfg.span), 10);
      if (!Number.isNaN(span)) {
        const openTagRe = new RegExp(`(<div class=\"card[^>]*data-card-id=\"${cardId}\"[^>]*)(>)`);
        html = html.replace(openTagRe, (m, open, end) => {
          const updatedOpen = ensureDataSpanInOpenTag(open, span);
          return updatedOpen + end;
        });
      }
    }

    // 3) Update body content
    if (cfg.type === 'rte') {
      // Update RTE editor content
      const rteRe = new RegExp(`(<div class=\"card[^>]*data-card-id=\"${cardId}\"[^>]*>[\\s\\S]*?<div class=\"card-content[^\"]*rte-content[^\"]*\"[^>]*>[\\s\\S]*?<div class=\"rte-editor\"[^>]*>)([\\s\\S]*?)(<\\/div>)`);
      html = html.replace(rteRe, (m, pre, inner, post) => {
        if (!cfg.content) return m;
        const newInner = renderContentHTML(cfg.content);
        return pre + newInner + post;
      });
    } else {
      const contentRe = new RegExp(`(<div class=\"card[^>]*data-card-id=\"${cardId}\"[^>]*>[\\s\\S]*?<div class=\"card-content\"[^>]*>)([\\s\\S]*?)(<\\/div>)`);
      html = html.replace(contentRe, (m, pre, inner, post) => {
        let newHtml = '';
        if (cfg.image) newHtml += `<img src="${cfg.image}" alt="" />`;
        if (cfg.content) newHtml += renderContentHTML(cfg.content);
        if (!newHtml) return m;
        return pre + newHtml + post;
      });
    }
  }
  return html;
}

function main() {
  if (!fs.existsSync(INDEX_PATH)) {
    console.error('index.html not found at', INDEX_PATH);
    process.exit(1);
  }
  if (!fs.existsSync(CONTENT_PATH)) {
    console.error('content.md not found at', CONTENT_PATH);
    process.exit(1);
  }

  const indexHtml = read(INDEX_PATH);
  const contentMd = read(CONTENT_PATH);
  const plan = parseContentPlan(contentMd);
  const updated = updateIndexHtml(indexHtml, plan.cards || {});
  if (updated !== indexHtml) {
    write(INDEX_PATH, updated);
    console.log('index.html updated from content.md');
  } else {
    console.log('No changes applied to index.html');
  }
}

if (require.main === module) {
  main();
}


