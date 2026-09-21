import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowDown,
  ArrowUpRight,
  Clock3,
} from 'lucide-react';
import './styles.css';

const tabs = [
  { id: 'story', label: 'Full story' },
  { id: 'sound', label: 'Sound & shared space' },
  { id: 'banner', label: 'Then Banner enters' },
  { id: 'city', label: 'A shared Atlanta' },
];

function ProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? (window.scrollY / total) * 100 : 0);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  return <div className="progress" style={{ width: `${progress}%` }} aria-hidden="true" />;
}

function Section({ id, eyebrow, title, children, activeTab }) {
  const visible = activeTab === 'story' || activeTab === id;
  if (!visible) return null;
  return (
    <section className="article-section reveal" data-section={id}>
      <div className="section-heading">
        <span>{eyebrow}</span>
        <h2>{title}</h2>
      </div>
      <div className="section-body">{children}</div>
    </section>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState('story');
  const [readingTime, setReadingTime] = useState({ minutes: 1, words: 0 });
  const articleRef = useRef(null);

  useEffect(() => {
    const words = articleRef.current?.textContent.trim().match(/\S+/g)?.length ?? 0;
    setReadingTime({ words, minutes: Math.max(1, Math.ceil(words / 225)) });
  }, []);

  const selectTab = (id) => {
    setActiveTab(id);
    window.setTimeout(() => document.querySelector('.article-shell')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 20);
  };

  return (
    <>
      <ProgressBar />
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Between the Lines home">
          <span className="line-mark"><i /><i /><i /></span>
          <span>Between<br />the Lines</span>
        </a>
        <div className="header-meta">
          <span>ENGL 1101 Artifact 1</span>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <img className="hero-image" src="/assets/marta-car.png" alt="Passengers inside an Atlanta train car at sunset" />
          <div className="hero-wash" />
          <div className="route-line" aria-hidden="true"><span /><span /><span /><span /></div>
          <div className="hero-content">
            <h1>What Does <em>Respect</em> Sound Like?</h1>
            {/* <h1>Ride with<br /><em>Respect.</em></h1> */}
            <p className="hero-deck">MARTA’s New Ad Makes You Hear the Answer.</p>
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

        <div className="story-tabs" role="tablist" aria-label="Article sections">
          <span className="tabs-label">Explore the essay</span>
          <div className="tabs-scroll">
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                className={activeTab === tab.id ? 'active' : ''}
                onClick={() => selectTab(tab.id)}
              >
                <span>{String(index + 1).padStart(2, '0')}</span>{tab.label}
              </button>
            ))}
          </div>
        </div>

        <article className="article-shell" ref={articleRef}>
          <header className="article-intro">
            <div className="intro-label"><span /> Ride with Respect</div>
            <div className="section-body intro-body">
            <p className="standfirst">The first thing MARTA’s new Ride with Respect ad asks you to do is be annoyed.</p>
            <p>A rider blasts music through the enclosed space of a bus. People dance awkwardly. Someone leaves trash behind. None of these actions stops the bus from moving, but together they make the ride feel more chaotic and less shared. Then David Banner appears, and the atmosphere changes.</p>
            <p>That change is the point.</p>
            <p>MARTA could have delivered the same message through a poster listing rules. Its website already tells riders to use headphones, avoid talking loudly, throw away trash, and show “basic civility.” <a href="https://itsmarta.com/marta-ride-with-respect.aspx?utm_source=chatgpt.com">MARTA</a> Instead, the video turns those rules into a sensory experience. By making viewers hear the difference between a disruptive ride and a respectful one, MARTA frames transit etiquette as something every passenger can feel.</p>
            </div>
          </header>

          <Section id="sound" eyebrow="01 / Sound & shared space" title="Sound does most of the work." activeTab={activeTab}>
            <p className="drop-cap">The music at the beginning is not simply a soundtrack. It behaves like the problem MARTA is trying to address: it takes over a space that everyone has to share. That matters on public transit. You can look away from another passenger. You can avoid a conversation. But in the narrow interior of a bus, you cannot easily opt out of someone else’s speaker.</p>
            <p>Watching the video, I found that irritation familiar. I have ridden MARTA buses before, and the setting looks deliberately ordinary: paired seats, a narrow aisle, strangers positioned close to one another. The campaign does not need to explain why one person's noise can become everyone’s problem. The bus already does that.</p>
            <p>MARTA's own Ride with Respect page puts the idea plainly: “MARTA belongs to all of us.” <a href="https://itsmarta.com/marta-ride-with-respect.aspx?utm_source=chatgpt.com">MARTA</a> The video gives that sentence a sound. At first, the bus feels like a collection of individuals acting as if the space were theirs alone. The noise makes their private choices public.</p>
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
              <figcaption>Caption: David Banner enters the MARTA bus midway through the campaign video. His positioning in the aisle and the camera's upward angle reinforce the authority already created by his voice.</figcaption>
              <a className="video-link" href="https://www.youtube.com/watch?v=3d8JPAbC93I" target="_blank" rel="noopener noreferrer">Watch on YouTube <ArrowUpRight size={14} /></a>
            </figure>
          </Section>

          <Section id="banner" eyebrow="02 / David Banner" title="Then Banner enters." activeTab={activeTab}>
            <p>Around the middle of the video, he is framed standing in the aisle, shot from a lower angle. His body occupies the center of the bus, and his deep, controlled voice cuts across the silliness and noise that came before him. The campaign moves from scattered movement to attention.</p>
            <p>That shift gives Banner a role bigger than celebrity spokesperson. He becomes the person who restores order to the shared space.</p>
            <p>MARTA says it chose Banner for his “authenticity, strength, and credibility.” <a href="https://itsmarta.com/marta-partners-with-david-banner.aspx?utm_source=chatgpt.com">MARTA</a> The choice is especially useful in Atlanta. Banner was born in Mississippi, but he has described Atlanta as the city that adopted and embraced him. He also became part of the Southern hip-hop culture closely associated with the city. <a href="https://www.atlutd.com/news/how-atlanta-embraced-david-banner-hip-hop-golden-spike-hitter">atlutd</a> He therefore gives MARTA something an automated announcement cannot: a recognizable human voice with cultural weight.</p>
            <p>The campaign is not saying, “Follow this rule because MARTA says so.” Its tone is closer to, “Look around. Other people are here too.”</p>
          </Section>

          <Section id="city" eyebrow="03 / A shared Atlanta" title="The most interesting choice, though, may be the setting itself." activeTab={activeTab}>
            <p>Atlanta is often advertised through skylines, stadiums, restaurants, music venues, and major events. Ride with Respect shows something much less glamorous: strangers sitting together on a city bus.</p>
            <p>Yet that may be exactly why it works.</p>
            <p>A MARTA bus is one of the places where Atlanta becomes physically shared. Riders who may live in different neighborhoods, have different routines, and never otherwise meet still occupy the same aisle for a few stops. In that space, one rider's music, trash, voice, or courtesy becomes part of another rider's experience of the city.</p>
            <p>The campaign therefore presents Atlanta not simply as a place people move through, but as a place people continually negotiate with one another.</p>
            <p>That framing also helps explain the timing. MARTA launched this phase after its public-awareness efforts during the 2026 FIFA World Cup, and says the campaign will appear across its digital platforms, stations, trains, buses, and social media. <a href="https://itsmarta.com/marta-partners-with-david-banner.aspx?utm_source=chatgpt.com">MARTA</a> The message follows riders into the same spaces whose behavior it is trying to shape.</p>
            <p>There is also a limit to this version of Atlanta.</p>
            <p>Ride with Respect focuses almost entirely on what riders can control. It does not address delays, service frequency, infrastructure, or other frustrations that might shape someone's experience of public transit. That omission does not make the campaign ineffective, but it clarifies its purpose.</p>
            <p>MARTA is isolating one part of the transit experience that passengers produce themselves: the social atmosphere.</p>
            <p>That is why the campaign's sensory strategy matters. A written code of conduct can tell riders what behavior is prohibited. This video tries to make them notice what that behavior feels like to everyone else.</p>
          </Section>

          <section className="closing-note">
            <div><span>Last stop</span><h2>The bus keeps moving either way. The question is what kind of shared space moves with it.</h2></div>
            <p>And in MARTA's version of Atlanta, respect is not just something riders are asked to read on a sign. It is something they are supposed to hear, see, and practice together.</p>
          </section>
        </article>

      </main>

      <footer>
        <div className="wordmark footer-mark"><span className="line-mark"><i /><i /><i /></span><span>Between<br />the Lines</span></div>
        <p>An English 1101 digital artifact exploring behavior, identity, and public space in Atlanta.</p>
        <a href="#top">Back to top <ArrowUpRight size={15} /></a>
      </footer>

    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
