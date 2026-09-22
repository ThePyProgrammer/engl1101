import React, { useEffect, useMemo, useState } from 'react';

export default function ReadingRoute({ sections }) {
  const routeStops = useMemo(() => [{ id: 'top', label: 'Start' }, ...sections, { id: 'end', label: 'End of the line' }], [sections]);
  const [position, setPosition] = useState({ progress: 0, active: 0 });

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const maximum = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      const offset = document.querySelector('.story-tabs')?.offsetHeight ?? 76;
      const targets = routeStops.map(({ id }, index) => {
        if (index === 0) return 0;
        if (index === routeStops.length - 1) return maximum;
        const element = document.getElementById(id);
        return Math.min(maximum, Math.max(0, (element?.getBoundingClientRect().top ?? 0) + window.scrollY - offset));
      });
      const scroll = Math.min(maximum, Math.max(0, window.scrollY));
      let active = 0;
      while (active < targets.length - 1 && scroll >= targets[active + 1] - 1) active += 1;
      const distance = targets[active + 1] - targets[active];
      const fraction = distance > 0 ? Math.min(1, Math.max(0, (scroll - targets[active]) / distance)) : 0;
      setPosition({ progress: maximum > 0 ? ((active + fraction) / (targets.length - 1)) * 100 : 0, active });
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    const observer = new ResizeObserver(schedule);
    observer.observe(document.body);
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [routeStops]);

  return (
    <nav className="reading-route" aria-label="Reading progress and article stops">
      <div className="route-track">
        <div className="route-fill" style={{ height: `${position.progress}%` }} aria-hidden="true" />
        {routeStops.map((stop, index) => (
          <a
            key={stop.id}
            href={`#${stop.id}`}
            className={`route-stop${index <= position.active ? ' visited' : ''}${index === position.active ? ' current' : ''}`}
            style={{ top: `${(index / (routeStops.length - 1)) * 100}%` }}
            aria-label={stop.label}
            aria-current={index === position.active ? 'location' : undefined}
          >
            <span className="route-dot" aria-hidden="true" />
            <span className="route-label" aria-hidden="true">{stop.label}</span>
          </a>
        ))}
        <span className="route-reader" style={{ top: `${position.progress}%` }} aria-hidden="true" />
      </div>
    </nav>
  );
}

