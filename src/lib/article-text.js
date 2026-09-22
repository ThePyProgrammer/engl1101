import { isValidElement } from 'react';

const blockTags = new Set([
  'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'blockquote',
  'pre', 'div', 'section', 'figure', 'figcaption', 'td', 'th',
]);

// Read authored children, not component-generated UI or JSX attributes.
// Inline elements concatenate so em**pha**sis remains a single word.
export function articleText(node) {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(articleText).join('');
  if (!isValidElement(node)) return '';
  if (node.type === 'br' || node.type === 'hr') return '\n';

  const text = articleText(node.props.children);
  const isBlock = blockTags.has(node.type) || typeof node.type !== 'string';
  return isBlock ? `\n${text}\n` : text;
}

export function countArticleWords(nodes) {
  return articleText(nodes).match(/\S+/gu)?.filter((word) => /[\p{L}\p{N}]/u.test(word)).length ?? 0;
}
