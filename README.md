# Between the Lines

## Editing the article

Edit **`src/content/article.mdx`**. The article's words, headings, author details,
hero image, caption, and citations live there. `src/main.jsx` only mounts the page.

The MDX file uses Markdown inside a few layout components:

- `metadata`: category, author, bio, and hero image information.
- `<Hero>`: the `#` heading is the headline; the paragraph below is the deck.
- `<Intro label="…">`: the first paragraph becomes the large opening text.
- `<Section id="sound" label="Sound & shared space">`: the `##` heading appears
  beside the body. The label appears in navigation; an optional `eyebrow` overrides
  the small label beside the heading. Keep IDs unique, with no spaces, and avoid
  the reserved IDs `top`, `intro`, `closing`, and `end`. Section links, route stops,
  and numbering follow the sections automatically.
- `<Closing>`: the `##` heading and following paragraph form the dark closing panel.
- `<WorksCited>`: the `##` heading and Markdown citations form the credits section.

Keep blank lines between component tags and Markdown. Use ordinary paragraphs,
`*italics*`, `**bold**`, and `[link text](https://example.com)` within each block.

### YouTube embeds

Place a video anywhere in a section using its YouTube video ID:

```mdx
<YouTube id="3d8JPAbC93I" title="MARTA Ride with Respect campaign">

Write the caption here. Markdown formatting and links work in captions too.

</YouTube>
```

For a video without a caption, use `<YouTube id="3d8JPAbC93I" title="Campaign" />`.
The component provides the responsive player and a “Watch on YouTube” link.

### Word count

The byline shows a count computed from the MDX content on every render, including
development updates. It counts the intro, section headings and prose, closing
heading and prose, and media captions. It excludes the hero headline and deck,
metadata, navigation labels, video titles/URLs, generated buttons, and citations.
Links count their visible text. Contractions and hyphenated words count as one;
standalone punctuation does not count. No count is manually maintained.

## Development

```sh
npm install
npm run dev
npm test
npm run build
```

MDX is compiled by the [official MDX Rollup/Vite integration](https://mdxjs.com/packages/rollup/).
Page layout lives in `src/components/ArticleLayout.jsx`; the media component is
`src/components/YouTube.jsx`; styles remain in `src/styles.css`.
