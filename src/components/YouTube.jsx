import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function YouTube({ id, title = 'YouTube video', children }) {
  if (!/^[A-Za-z0-9_-]{11}$/.test(id ?? '')) {
    throw new Error('YouTube requires an 11-character video id.');
  }

  return (
    <figure className="video-figure">
      <div className="video-frame">
        <iframe
          src={`https://www.youtube.com/embed/${id}`}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
      {children && <figcaption>{children}</figcaption>}
      <a className="video-link" href={`https://www.youtube.com/watch?v=${id}`} target="_blank" rel="noopener noreferrer">
        Watch on YouTube <ArrowUpRight size={14} />
      </a>
    </figure>
  );
}
