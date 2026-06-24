import { useState, useEffect, useRef } from 'react';
import { incrementVisitor, subscribeToCount } from './firebase';
import './App.css';

// ── Data ────────────────────────────────────────────────────────────────────
const NAV_LINKS = ['About', 'Experience', 'Projects', 'Skills', 'Beyond Code', 'Contact'];

const ROLES = ['CS Student.', 'ML Builder.', 'Athlete.', 'Leader.', 'All-Rounder.'];

const PROJECTS = [
  {
    name: 'ShareLine',
    stack: ['React', 'FastAPI', 'Supabase', 'TypeScript'],
    desc: 'Full-stack community resource-sharing platform enabling donors to list and affected individuals to request essential items during crises. Real-time updates, auth, and row-level security.',
    github: 'https://github.com/Kshah965',
    highlight: 'Full Stack',
  },
  {
    name: 'Fatigue Detection Helmet',
    stack: ['Python', 'C', 'ESP32', 'SVM', 'KNN'],
    desc: 'Research project: scoped end-to-end hardware-to-ML pipeline. 95%+ classification accuracy with live inference every 0.5s on a batteryless wearable using interrupt-driven firmware.',
    github: 'https://github.com/Kshah965',
    highlight: 'Research',
  },
  {
    name: 'Cloud Storage Shell',
    stack: ['C', 'C++', 'POSIX', 'pthreads', 'GoogleTest'],
    desc: 'Unix-like shell with multi-stage pipelines and a multithreaded cloud storage system over TCP sockets. 370 ops/sec, 2ms upload latency, zero race conditions across 8+ concurrent clients.',
    github: 'https://github.com/Kshah965',
    highlight: 'Systems',
  },
  {
    name: 'Neural Network from Scratch',
    stack: ['Python', 'NumPy'],
    desc: 'Fully connected feedforward neural network in pure NumPy. Implements forward pass, backpropagation, cross-entropy loss, L2 regularization, and gradient descent — no ML frameworks.',
    github: 'https://github.com/Kshah965/neural_network',
    highlight: 'ML from Scratch',
  },
  {
    name: 'Random Forest from Scratch',
    stack: ['Python', 'NumPy', 'Pandas'],
    desc: 'Ensemble of custom Decision Trees with bootstrap sampling, sqrt feature subsampling, stratified k-fold CV, and macro-averaged precision/recall/F1. 96% accuracy on Wisconsin Breast Cancer dataset.',
    github: 'https://github.com/Kshah965/random_forest',
    highlight: 'ML from Scratch',
  },
  {
    name: 'Multinomial Naive Bayes from Scratch',
    stack: ['Python'],
    desc: 'Text sentiment classifier using log-space arithmetic and Laplace smoothing — standard library only. Implements prior/conditional probabilities, confusion matrix, precision, and recall.',
    github: 'https://github.com/Kshah965/naive_bayes',
    highlight: 'ML from Scratch',
  },
];

const SKILLS = {
  'Languages': ['Python', 'C', 'C++', 'Java', 'JavaScript', 'TypeScript', 'HTML', 'CSS'],
  'AI / ML': ['PyTorch', 'TensorFlow', 'NumPy', 'Pandas', 'Matplotlib', 'Scikit-learn'],
  'Systems & Backend': ['POSIX/Linux', 'TCP Sockets', 'pthreads', 'FastAPI', 'PostgreSQL', 'Supabase', 'MongoDB', 'Firebase'],
  'Tools': ['Git', 'Docker', 'VS Code', 'gdb', 'GoogleTest'],
};

const BEYOND = [
  {
    icon: '🎨',
    category: 'Creative',
    tagColor: { bg: '#E6F1FB', text: '#185FA5' },
    title: 'Painting & Guitar',
    desc: 'Creative outlets that keep me grounded and thinking differently. Painting and music teach the same patience and intentionality that engineering demands.',
  },
  {
    icon: '🏃',
    category: 'Sports',
    tagColor: { bg: '#EAF3DE', text: '#3B6D11' },
    title: 'Athlete',
    desc: 'Competitive field hockey from middle school through high school, gym, running, and football. Sport built the discipline and team instinct I bring to engineering.',
  },
  {
    icon: '🤝',
    category: 'Leadership',
    tagColor: { bg: '#EEEDFE', text: '#534AB7' },
    title: 'Community & Clubs',
    desc: 'Rewriting the Code, CodePath, and Events Coordinator for a cultural club at UMass. Community keeps me connected to something bigger than just writing code.',
  },
];

// ── Typewriter hook ───────────────────────────────────────────────────────────
function useTypewriter(words, speed = 80, pause = 1800) {
  const [display, setDisplay] = useState('');
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIdx];
    let timeout;
    if (!deleting && charIdx < current.length) {
      timeout = setTimeout(() => setCharIdx(c => c + 1), speed);
    } else if (!deleting && charIdx === current.length) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && charIdx > 0) {
      timeout = setTimeout(() => setCharIdx(c => c - 1), speed / 2);
    } else {
      setDeleting(false);
      setWordIdx(i => (i + 1) % words.length);
    }
    setDisplay(current.slice(0, charIdx));
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, wordIdx, words, speed, pause]);

  return display;
}

// ── Components ────────────────────────────────────────────────────────────────

function Nav({ visitorCount }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id.toLowerCase().replace(' ', '-'))?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <nav className={`nav${scrolled ? ' nav--scrolled' : ''}`}>
      <div className="nav__inner">
        <span className="nav__logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          KS<span className="accent">.</span>
        </span>
        <div className={`nav__links${menuOpen ? ' nav__links--open' : ''}`}>
          {NAV_LINKS.map(l => (
            <button key={l} className="nav__link" onClick={() => scrollTo(l)}>{l}</button>
          ))}
        </div>
        {visitorCount !== null && (
          <span className="nav__visitors" title="Total portfolio visits">
            <span className="accent">●</span> {visitorCount} visits
          </span>
        )}
        <button className="nav__burger" onClick={() => setMenuOpen(m => !m)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
}

function Hero() {
  const typed = useTypewriter(ROLES);
  return (
    <section className="hero" id="about">
      <div className="hero__bg-grid" />
      <div className="hero__content">
        <p className="hero__eyebrow mono">Available for <span className="accent">Fall 2026 and onwards</span> · </p>
        <h1 className="hero__name">Krishna Shah</h1>
        <div className="hero__typewriter mono">
          <span>{typed}</span><span className="cursor">|</span>
        </div>
        <p className="hero__bio">
          CS junior at UMass Amherst (GPA 3.8) building production-quality systems — from batteryless ML wearables
          to real-time cloud storage shells. I bring the same discipline from sport and creative work into every
          engineering problem I tackle.
        </p>
        <div className="hero__cta">
          <a href="mailto:krishnashah00005@gmail.com" className="btn btn--primary">Get in touch</a>
          <a href="https://linkedin.com/in/krishna-shah123" target="_blank" rel="noopener" className="btn btn--ghost">LinkedIn</a>
          <a href="https://github.com/Kshah965" target="_blank" rel="noopener" className="btn btn--ghost">GitHub</a>
        </div>
        <div className="hero__meta">
          <span>📍 Amherst, MA</span>
          <span>🎓 Expected May 2027</span>
        <span>🇺🇸 UNIVERSITY OF MASSACHUSETTS AMHERST🇺🇸 </span>
        </div>
      </div>
    </section>
  );
}

function Experience() {
  return (
    <section className="section" id="experience">
      <div className="container">
        <h2 className="section__title">Experience</h2>
        <div className="timeline">
          <div className="timeline__item">
            <div className="timeline__dot" />
            <div className="timeline__card card">
              <div className="timeline__header">
                <div>
                  <h3>Software Development Intern</h3>
                  <p className="muted">Syner-med Pharmaceuticals · Nairobi, Kenya</p>
                </div>
                <span className="badge">June – Aug 2022</span>
              </div>
              <ul className="timeline__bullets">
                <li>Built and maintained user-facing web apps in <strong>React</strong> for pharmaceutical logistics workflows</li>
                <li>Collaborated with UX/UI designers; gathered direct feedback from warehousing & accounting teams to reduce tracking errors</li>
              </ul>
            </div>
          </div>
          <div className="timeline__item">
            <div className="timeline__dot" />
            <div className="timeline__card card">
              <div className="timeline__header">
                <div>
                  <h3>Orientation & Transitions Leader</h3>
                  <p className="muted">University of Massachusetts Amherst</p>
                </div>
                <span className="badge">May 2024 – Jan 2025</span>
              </div>
              <ul className="timeline__bullets">
                <li>Served as a primary point of contact for <strong>thousands of incoming students and families</strong>, communicating university resources, policies, and processes clearly under high-volume conditions</li>
                <li>Collaborated within a <strong>team of 30 leaders</strong> to plan and facilitate orientation icebreakers, group activities, and check-in logistics — coordinating moving parts across large groups with tight schedules</li>
                <li>Strengthened cross-functional communication and teamwork skills directly applicable to engineering team environments — translating complex information to diverse audiences quickly and clearly</li>
              </ul>
            </div>
          </div>
          <div className="timeline__item">
            <div className="timeline__dot timeline__dot--edu" />
            <div className="timeline__card card">
              <div className="timeline__header">
                <div>
                  <h3>B.S. Computer Science</h3>
                  <p className="muted">University of Massachusetts Amherst</p>
                </div>
                <span className="badge">Expected May 2027</span>
              </div>
              <ul className="timeline__bullets">
                <li>GPA 3.8 · Chancellor's Award (Merit Scholarship) · Dean's List all semesters</li>
                <li>Coursework: Machine Learning, Operating Systems, Algorithms, NLP, Software Engineering, Database Management</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Projects() {
  const [active, setActive] = useState(null);
  return (
    <section className="section" id="projects">
      <div className="container">
        <h2 className="section__title">Projects</h2>
        <div className="projects__grid">
          {PROJECTS.map((p, i) => (
            <div
              key={p.name}
              className={`project-card card${active === i ? ' project-card--active' : ''}`}
              onClick={() => setActive(active === i ? null : i)}
            >
              <div className="project-card__top">
                <span className="badge badge--accent">{p.highlight}</span>
                <a href={p.github} target="_blank" rel="noopener" onClick={e => e.stopPropagation()}
                   className="project-card__github" aria-label="GitHub">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                </a>
              </div>
              <h3 className="project-card__name">{p.name}</h3>
              <p className="project-card__desc">{p.desc}</p>
              <div className="project-card__stack">
                {p.stack.map(s => <span key={s} className="tag">{s}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Skills() {
  return (
    <section className="section section--alt" id="skills">
      <div className="container">
        <h2 className="section__title">Technical Skills</h2>
        <div className="skills__grid">
          {Object.entries(SKILLS).map(([cat, items]) => (
            <div key={cat} className="card skills__card">
              <h3 className="skills__cat">{cat}</h3>
              <div className="skills__tags">
                {items.map(s => <span key={s} className="tag">{s}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BeyondCode() {
  return (
    <section className="section" id="beyond-code">
      <div className="container">
        <h2 className="section__title">Beyond Code</h2>
        <p className="section__sub">Engineering is my craft. Here's what makes me a well-rounded human.</p>
        <div className="beyond__grid">
          {BEYOND.map(b => (
            <div key={b.category} className="card beyond__card">
              <span className="beyond__icon">{b.icon}</span>
              <h3 className="beyond__title">{b.title}</h3>
              <span className="beyond__tag" style={{ background: b.tagColor.bg, color: b.tagColor.text }}>
                {b.category}
              </span>
              <p className="beyond__desc">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section className="section section--alt" id="contact">
      <div className="container contact">
        <h2 className="section__title">Let's Talk</h2>
        <p className="contact__sub">
          I'm actively looking for <strong>Summer 2026 internships</strong> and <strong>full-time roles starting May 2027</strong> in the US.
          STEM OPT means no H-1B sponsorship needed for the first 3 years.
        </p>
        <div className="contact__links">
          <a href="mailto:krishnashah00005@gmail.com" className="btn btn--primary">krishnashah00005@gmail.com</a>
          <a href="tel:4134661814" className="btn btn--ghost">413-466-1814</a>
          <a href="https://linkedin.com/in/krishna-shah123" target="_blank" rel="noopener" className="btn btn--ghost">LinkedIn</a>
          <a href="https://github.com/Kshah965" target="_blank" rel="noopener" className="btn btn--ghost">GitHub</a>
        </div>
      </div>
    </section>
  );
}

function Footer({ visitorCount }) {
  return (
    <footer className="footer">
      <span className="mono muted">Built by Krishna Shah · React + Vite + Firebase</span>
      {visitorCount !== null && (
        <span className="mono muted footer__count">
          <span className="accent">◆</span> {visitorCount} recruiters visited
        </span>
      )}
    </footer>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [visitorCount, setVisitorCount] = useState(null);

  useEffect(() => {
    incrementVisitor();
    const unsub = subscribeToCount(setVisitorCount);
    return unsub;
  }, []);

  return (
    <>
      <Nav visitorCount={visitorCount} />
      <main>
        <Hero />
        <Experience />
        <Projects />
        <Skills />
        <BeyondCode />
        <Contact />
      </main>
      <Footer visitorCount={visitorCount} />
    </>
  );
}
