import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowDown,
  ArrowUpRight,
  Clock3,
} from 'lucide-react';
import './styles.css';

const tabs = [
  { id: 'sound', label: 'Sound & shared space' },
  { id: 'banner', label: 'Then Banner enters' },
  { id: 'city', label: 'A shared Atlanta' },
];

const routeStops = [
  { id: 'top', label: 'Start' },
  ...tabs,
  { id: 'end', label: 'End of the line' },
];

function ReadingRoute() {
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
        return Math.min(maximum, Math.max(0, element.getBoundingClientRect().top + window.scrollY - offset));
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
  }, []);

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

function Section({ id, eyebrow, title, children }) {
  return (
    <section id={id} className="article-section reveal" data-section={id}>
      <div className="section-heading">
        <span>{eyebrow}</span>
        <h2>{title}</h2>
      </div>
      <div className="section-body">{children}</div>
    </section>
  );
}

function App() {
  const [readingTime, setReadingTime] = useState({ minutes: 1, words: 0 });
  const articleRef = useRef(null);

  useEffect(() => {
    const blocks = articleRef.current?.querySelectorAll('.article-intro p, .section-heading h2, .section-body > p, figcaption, .closing-note h2, .closing-note > p') ?? [];
    const words = Array.from(blocks, (block) => block.textContent).join(' ').trim().match(/\S+/g)?.length ?? 0;
    setReadingTime({ words, minutes: Math.max(1, Math.ceil(words / 225)) });
  }, []);

  return (
    <>
      <ReadingRoute />
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Between the Lines home">
          <span className="line-mark"><i /><i /><i /></span>
          <span>Between<br />the Lines</span>
        </a>
        <div className="header-meta">
          <span>Atlanta</span>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <img className="hero-image" src="/assets/marta-750cfe-1024.jpeg" alt="A MARTA train stopped beside an indoor station platform" />
          <div className="hero-wash" />
          <div className="hero-content">
            <p className="hero-category">TRANSIT &amp; PUBLIC LIFE</p>
            <h1>What Does <em>Respect</em> Sound Like?</h1>
            <p className="hero-deck">How MARTA’s David Banner campaign turns rider etiquette into a sensory argument about sharing Atlanta.</p>
            <div className="hero-byline">
              <div className="author-avatar">PG</div>
              <p>
                <strong>Prannaya Gupta</strong>
                <span title={`${readingTime.words} words at 225 words per minute`}>
                  <Clock3 size={14} /> {readingTime.minutes} minute read
                </span>
              </p>
            </div>
          </div>
          <button className="scroll-cue" onClick={() => document.querySelector('.article-shell')?.scrollIntoView({ behavior: 'smooth' })}>
            <span>Enter the story</span><ArrowDown size={18} />
          </button>
        </section>

        <nav className="story-tabs" aria-label="Article sections">
          <span className="tabs-label">Explore the story</span>
          <div className="tabs-scroll">
            {tabs.map((tab, index) => (
              <a key={tab.id} href={`#${tab.id}`}>
                <span>{String(index + 1).padStart(2, '0')}</span>{tab.label}
              </a>
            ))}
          </div>
        </nav>

        <article className="article-shell" ref={articleRef}>
          <header id="intro" className="article-intro">
            <div className="intro-label"><span /> Ride with Respect</div>
            <div className="section-body intro-body">
            <p className="standfirst">The first thing MARTA’s new Ride with Respect ad asks you to do is be annoyed.</p>
            <p>A rider blasts music through the enclosed space of a bus. People dance awkwardly. Someone leaves trash behind. None of these actions stops the bus from moving, but together they make the ride feel more chaotic and less shared. Then David Banner appears, and the atmosphere changes.</p>
            <p>That change is the point.</p>
            <p>MARTA could have delivered the same message through a station poster. Its website already tells riders to use headphones, avoid talking loudly, throw away trash, and show “basic civility.” But the transit agency does more than tell passengers what respectful behavior looks like. It makes disrespect audible, turning everyday transit etiquette into something every passenger can feel.</p>
            </div>
          </header>

          <Section id="sound" eyebrow="01 / Sound & shared space" title="Sound does most of the work.">
            <p className="drop-cap">The music at the beginning is not simply a soundtrack. It behaves like the problem MARTA is trying to address: it takes over a space that everyone has to share. That matters on public transit. You can look away from another passenger. You can avoid a conversation. But in the narrow interior of a bus, you cannot easily opt out of someone else’s speaker.</p>
            <p>If you ride MARTA regularly, you probably know the feeling. On my own bus rides, the same arrangement stands out: paired seats, a narrow aisle, strangers positioned close to one another. The campaign does not need to explain why one person’s noise can become everyone’s problem. The bus already does that.</p>
            <p>MARTA's own Ride with Respect page puts the idea plainly: “MARTA belongs to all of us.” The video gives that sentence a sound. At first, the bus feels like a collection of individuals acting as if the space were theirs alone. The noise makes their private choices public.</p>
            <figure className="video-figure">
              <div className="video-frame">
                <iframe
                  src="https://www.youtube.com/embed/3d8JPAbC93I"
                  title="MARTA Ride with Respect campaign featuring David Banner"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
              <figcaption>Centered in the aisle and filmed from below, Banner takes control of the shared space at the same moment his voice takes control of its sound.</figcaption>
              <a className="video-link" href="https://www.youtube.com/watch?v=3d8JPAbC93I" target="_blank" rel="noopener noreferrer">Watch on YouTube <ArrowUpRight size={14} /></a>
            </figure>
          </Section>

          <Section id="banner" eyebrow="02 / David Banner" title="Then Banner enters.">
            <p>For a transit agency, that change in tone matters. Around the middle of the video, Banner stands in the aisle, shot from below. His deep, controlled voice cuts across the noise. Scattered movement gives way to attention.</p>
            <p>Rules about headphones, litter, and courtesy can fade into the background of a station poster or automated announcement. Banner gives those expectations a human voice. Inside a bus, where strangers already negotiate noise, space, and attention, he makes MARTA’s code of conduct feel like a social norm riders are expected to share.</p>
            <p>MARTA says it chose Banner for his “authenticity, strength, and credibility.” Born in Mississippi, he has described Atlanta as the city that adopted and embraced him. His place in the Southern hip-hop culture associated with Atlanta gives that voice cultural weight. He becomes more than a celebrity spokesperson: he restores order to the shared space.</p>
            <p>The campaign is not saying, “Follow this rule because MARTA says so.” Its tone is closer to, “Look around. Other people are here too.”</p>
          </Section>

          <Section id="city" eyebrow="03 / A shared Atlanta" title="The Bus Becomes a Small Version of Atlanta">
            <p>Atlanta is often advertised through skylines, stadiums, restaurants, music venues, and major events. Ride with Respect shows something much less glamorous: strangers sitting together on a city bus.</p>
            <p>Yet that may be exactly why it works.</p>
            <p>A MARTA bus is one of the places where Atlanta becomes physically shared. A city bus repeatedly places strangers from different neighborhoods and routines within a few feet of one another. For a handful of stops, riders who might never otherwise meet share sound, movement, seating, and personal space. One rider’s music, trash, conversation, or courtesy immediately becomes part of another rider’s experience of Atlanta.</p>
            <p>The bus is part of the advertisement’s argument: its enclosed interior makes every small choice matter to someone nearby. Sharing the city takes practice, stop by stop.</p>
            <p>MARTA launched this phase after its public-awareness efforts during the 2026 FIFA World Cup. The agency says the campaign will appear across its digital platforms, stations, trains, buses, and social media. Its message follows riders into the spaces where those expectations apply.</p>
            <p>There is also a limit to this version of Atlanta.</p>
            <p>Ride with Respect focuses almost entirely on what riders can control. Delays, service frequency, and infrastructure also shape the everyday commute, but they fall outside its frame. That omission does not make the campaign ineffective; it clarifies its purpose.</p>
            <p>MARTA is isolating one part of the transit experience that passengers produce themselves: the social atmosphere.</p>
            <p>A written code of conduct can tell riders what behavior is prohibited. This video asks them to notice what that behavior feels like to everyone else on board.</p>
          </Section>

          <section id="closing" className="closing-note">
            <div><span>Last stop</span><h2>The bus keeps moving either way. The question is what kind of shared space moves with it.</h2></div>
            <p>And in MARTA's version of Atlanta, respect is not just something riders are asked to read on a sign. It is something they are supposed to hear, see, and practice together.</p>
          </section>
        </article>

        <section className="works-cited" aria-labelledby="works-cited-heading">
          <h2 id="works-cited-heading">Works Cited / Media Credits</h2>
          <div className="citations">
            <p>“MARTA Partners with David Banner to Launch Next Phase of Ride with Respect Campaign.” <cite>MARTA</cite>, 11 Aug. 2026, <a href="https://itsmarta.com/marta-partners-with-david-banner.aspx">itsmarta.com/marta-partners-with-david-banner.aspx</a>. Accessed 21 Sept. 2026.</p>
            <p>“MARTA Ride with Respect | David Banner.” <cite>YouTube</cite>, uploaded by MARTA, 11 Aug. 2026, <a href="https://www.youtube.com/watch?v=3d8JPAbC93I">www.youtube.com/watch?v=3d8JPAbC93I</a>. Accessed 21 Sept. 2026.</p>
            <p>Photograph of a MARTA train at a station platform. <cite>PICRYL</cite>, <a href="https://picryl.com/media/marta-750cfe">picryl.com/media/marta-750cfe</a>. Accessed 21 Sept. 2026.</p>
            <p>“Ride with Respect.” <cite>MARTA</cite>, <a href="https://itsmarta.com/marta-ride-with-respect.aspx">itsmarta.com/marta-ride-with-respect.aspx</a>. Accessed 21 Sept. 2026.</p>
          </div>
        </section>

      </main>

      <footer id="end">
        <div className="wordmark footer-mark"><span className="line-mark"><i /><i /><i /></span><span>Between<br />the Lines</span></div>
        <p>Prannaya Gupta writes about transportation, technology, and public life in Atlanta.</p>
        <a href="#top">Back to top <ArrowUpRight size={15} /></a>
      </footer>

    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
