import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { after, before, test } from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import * as runtime from 'react/jsx-runtime';
import { evaluate } from '@mdx-js/mdx';
import { createServer } from 'vite';
import { articleText, countArticleWords } from '../src/lib/article-text.js';

let server;
let components;
let source;
let page;
let fixturePage;

const fixture = `
export const metadata = { author: 'A Writer', initials: 'AW', category: 'TRANSIT', location: 'Atlanta', bio: 'Author bio.', image: '/hero.jpg', imageAlt: 'Station' };

<ArticleLayout metadata={metadata}>

<Hero>

# Example *headline*

A deck outside the count.

</Hero>

<Intro label="Introduction">

Intro words.

</Intro>

<Section id="sound" label="Sound">

## Sound heading

Two words.

<YouTube id="3d8JPAbC93I" title="Video label">

Caption words.

</YouTube>

</Section>

<Closing>

## Closing heading

Final words.

</Closing>

<WorksCited>

## Works Cited

Reference words.

</WorksCited>

</ArticleLayout>
`;

before(async () => {
  server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom', logLevel: 'error' });
  const layout = await server.ssrLoadModule('/src/components/ArticleLayout.jsx');
  const { default: YouTube } = await server.ssrLoadModule('/src/components/YouTube.jsx');
  components = { ...layout, YouTube };
  source = await readFile(new URL('../src/content/article.mdx', import.meta.url), 'utf8');
  const { default: Article } = await server.ssrLoadModule('/src/content/article.mdx');
  page = renderToStaticMarkup(h(Article));
  fixturePage = await renderEdit(fixture);
});

after(async () => { await server?.close(); });

async function renderEdit(mdx) {
  // Supply the same components to in-memory revisions without editing the real article.
  const { default: Article } = await evaluate(mdx.replace(/^import .+;\r?$/gm, ''), runtime);
  return renderToStaticMarkup(h(Article, { components }));
}

function displayedCount(html) {
  const match = html.match(/<\/svg> ([\d,]+) words?<\/span>/);
  assert.ok(match, 'The byline should display the computed word count');
  return Number(match[1].replaceAll(',', ''));
}

test('word counting preserves inline boundaries and counts visible link text', () => {
  const nodes = [
    h('h2', null, 'Heading'),
    h('p', null, 'A ', h('em', null, 'shared'), ' ride with em', h('strong', null, 'pha'), 'sis.'),
    h('p', null, h('a', { href: 'https://example.com/extra-words' }, 'Read more'), '.'),
  ];
  assert.equal(countArticleWords(nodes), 8);
  assert.match(articleText(nodes), /emphasis/);
});

test('word counting handles punctuation, contractions, hyphens, numbers, and empty content', () => {
  assert.equal(countArticleWords(h('p', null, 'MARTA’s public-awareness campaign — 2026.')), 4);
  assert.equal(countArticleWords([null, false, ' \n ']), 0);
  assert.equal(countArticleWords([h('p', null, 'First'), h('p', null, 'Second')]), 2);
});

test('Vite renders MDX into the existing hero, section layout, media, and credits', () => {
  assert.match(page, /<h1>.+<\/h1>/);
  assert.match(page, /class="standfirst"/);
  assert.match(page, /class="drop-cap"/);
  for (const [, id] of source.matchAll(/<Section id="([^"]+)"/g)) {
    assert.match(page, new RegExp(`<section id="${id}" class="article-section reveal"`));
    assert.match(page, new RegExp(`href="#${id}"`));
  }
  assert.match(page, /src="https:\/\/www.youtube.com\/embed\/3d8JPAbC93I"/);
  assert.match(page, /<figcaption><p>/);
  const credits = page.match(/<div class="citations">([\s\S]*?)<\/div>/)?.[1];
  assert.ok(credits?.includes('<p>'));
  assert.ok(displayedCount(page) > 0);
  assert.doesNotMatch(page, /minute read/);
});

test('an MDX paragraph edit immediately changes the displayed word count', async () => {
  const edited = fixture.replace('Two words.', 'Two words. Three extra words.');
  assert.equal(displayedCount(await renderEdit(edited)), displayedCount(fixturePage) + 3);
});

test('captions count, while metadata, media attributes, and credits do not', async () => {
  const edited = fixture
    .replace("author: 'A Writer'", "author: 'An Author With A Longer Name'")
    .replace('title="Video label"', 'title="Extra words in an accessible iframe title"')
    .replace('## Works Cited', '## Works Cited\n\nExtra bibliography words stay outside the article count.')
    .replace('Caption words.', 'New caption words. Caption words.');
  assert.equal(displayedCount(await renderEdit(edited)), displayedCount(fixturePage) + 3);
});

test('adding an MDX section updates both navigation systems, numbering, and count', async () => {
  const extra = '<Section id="new-stop" label="New stop">\n\n## A new heading\n\nTwo words.\n\n</Section>\n\n';
  const html = await renderEdit(fixture.replace('<Closing>', `${extra}<Closing>`));
  assert.equal(html.match(/href="#new-stop"/g)?.length, 2);
  assert.match(html, /<span>02 \/ New stop<\/span><h2>A new heading<\/h2>/);
  assert.equal(displayedCount(html), displayedCount(fixturePage) + 5);
});

test('YouTube also supports a self-closing embed and rejects invalid IDs', () => {
  const html = renderToStaticMarkup(h(components.YouTube, { id: '3d8JPAbC93I', title: 'Campaign' }));
  assert.match(html, /title="Campaign"/);
  assert.doesNotMatch(html, /<figcaption>/);
  assert.throws(() => renderToStaticMarkup(h(components.YouTube, { id: 'https://youtube.com/watch?v=3d8JPAbC93I' })), /11-character video id/);
});
