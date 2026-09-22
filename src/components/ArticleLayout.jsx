import React, { Children, cloneElement, isValidElement } from 'react';
import { ArrowDown, ArrowUpRight, FileText } from 'lucide-react';
import ReadingRoute from './ReadingRoute.jsx';
import { countArticleWords } from '../lib/article-text.js';

function contentNodes(children) {
  return Children.toArray(children).filter((child) => typeof child !== 'string' || child.trim());
}

function splitHeading(children, tag) {
  const nodes = contentNodes(children);
  const index = nodes.findIndex((node) => isValidElement(node) && node.type === tag);
  if (index === -1) throw new Error(`This article block needs a Markdown ${tag === 'h1' ? '#' : '##'} heading.`);
  return { heading: nodes[index], body: nodes.filter((_, position) => position !== index) };
}

function styleFirstParagraph(nodes, className) {
  let found = false;
  return nodes.map((node) => {
    if (found || !isValidElement(node) || node.type !== 'p') return node;
    found = true;
    return cloneElement(node, { className: [node.props.className, className].filter(Boolean).join(' ') });
  });
}

function Wordmark({ footer = false }) {
  return (
    <span className={`wordmark${footer ? ' footer-mark' : ''}`}>
      <span className="line-mark"><i /><i /><i /></span>
      <span>Between<br />the Lines</span>
    </span>
  );
}

export function Hero({ metadata, wordCount, children }) {
  const { heading, body } = splitHeading(children, 'h1');
  return (
    <section className="hero">
      <img className="hero-image" src={metadata.image} alt={metadata.imageAlt} />
      <div className="hero-wash" />
      <div className="hero-content">
        <p className="hero-category">{metadata.category}</p>
        {heading}
        {styleFirstParagraph(body, 'hero-deck')}
        <div className="hero-byline">
          <div className="author-avatar">{metadata.initials}</div>
          <p>
            <strong>{metadata.author}</strong>
            <span title="Article text, section headings, and media captions; excludes the headline, deck, and credits.">
              <FileText size={14} aria-hidden="true" /> {wordCount.toLocaleString('en-US')} {wordCount === 1 ? 'word' : 'words'}
            </span>
          </p>
        </div>
      </div>
      <button className="scroll-cue" onClick={() => document.querySelector('.article-shell')?.scrollIntoView({ behavior: 'smooth' })}>
        <span>Enter the story</span><ArrowDown size={18} />
      </button>
    </section>
  );
}

export function Intro({ label, children }) {
  return (
    <header id="intro" className="article-intro">
      <div className="intro-label"><span /> {label}</div>
      <div className="section-body intro-body">{styleFirstParagraph(contentNodes(children), 'standfirst')}</div>
    </header>
  );
}

export function Section({ id, label, eyebrow = label, number, children }) {
  const { heading, body } = splitHeading(children, 'h2');
  return (
    <section id={id} className="article-section reveal" data-section={id}>
      <div className="section-heading">
        <span>{String(number).padStart(2, '0')} / {eyebrow}</span>
        {heading}
      </div>
      <div className="section-body">{number === 1 ? styleFirstParagraph(body, 'drop-cap') : body}</div>
    </section>
  );
}

export function Closing({ children }) {
  const { heading, body } = splitHeading(children, 'h2');
  return (
    <section id="closing" className="closing-note">
      <div><span>Last stop</span>{heading}</div>
      {body}
    </section>
  );
}

export function WorksCited({ children }) {
  const { heading, body } = splitHeading(children, 'h2');
  return (
    <section className="works-cited" aria-labelledby="works-cited-heading">
      {cloneElement(heading, { id: 'works-cited-heading' })}
      <div className="citations">{body}</div>
    </section>
  );
}

export function ArticleLayout({ metadata, children }) {
  const blocks = contentNodes(children);
  const hero = blocks.find((node) => node.type === Hero);
  const article = blocks.filter((node) => [Intro, Section, Closing].includes(node.type));
  const credits = blocks.filter((node) => node.type === WorksCited);
  const sections = article.filter((node) => node.type === Section).map(({ props }) => ({ id: props.id, label: props.label }));
  const wordCount = countArticleWords(article);
  let sectionNumber = 0;

  return (
    <>
      <ReadingRoute sections={sections} />
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Between the Lines home"><Wordmark /></a>
        <div className="header-meta"><span>{metadata.location}</span></div>
      </header>
      <main id="top">
        {hero && cloneElement(hero, { metadata, wordCount })}
        <nav className="story-tabs" aria-label="Article sections">
          <span className="tabs-label">Explore the story</span>
          <div className="tabs-scroll">
            {sections.map((section, index) => (
              <a key={section.id} href={`#${section.id}`}>
                <span>{String(index + 1).padStart(2, '0')}</span>{section.label}
              </a>
            ))}
          </div>
        </nav>
        <article className="article-shell">
          {article.map((node) => node.type === Section ? cloneElement(node, { number: ++sectionNumber }) : node)}
        </article>
        {credits}
      </main>
      <footer id="end">
        <Wordmark footer />
        <p>{metadata.bio}</p>
        <a href="#top">Back to top <ArrowUpRight size={15} /></a>
      </footer>
    </>
  );
}
