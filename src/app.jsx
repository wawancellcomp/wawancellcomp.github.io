import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import {
  ArrowDown,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Check,
  Code2,
  Database,
  Github,
  Globe,
  Layers3,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  Minus,
  Moon,
  MoveUpRight,
  Plus,
  Send,
  Sun,
  X,
} from 'lucide-react';
import projects from './data/projects.json';
import brands from './data/brands.json';
import showcases from './data/showcases.json';
import { createProjectFilter } from './project-search.js';
import './styles.css';

const ease = [0.22, 1, 0.36, 1];
const filterProjects = createProjectFilter(projects);
const categories = [
  'Semua',
  'Full Stack',
  'Web App',
  'Backend & API',
  'Frontend UI',
  'Sistem Informasi',
  'Operasional',
];

const experience = [
  {
    date: '6 TAHUN · SEKARANG',
    title: 'Kepala Rumah Anak Yatim & Manajer Operasional',
    company: 'Yayasan Markaz Yatim Duafa Qurani',
    description:
      'Memimpin beberapa divisi, menjaga operasional harian tetap terarah, membina tim, dan mendorong digitalisasi administrasi serta pelaporan lembaga.',
    number: '01',
  },
  {
    date: '2012 — 2026',
    title: 'Founder & Full Stack Developer',
    company: 'Wawancellcomp',
    description:
      'Mendirikan dan mengelola usaha teknologi selama 14 tahun. Membangun aplikasi web dan sistem informasi sambil memimpin operasional bisnis dari hulu ke hilir.',
    number: '02',
  },
];

const skills = [
  'React & JavaScript',
  'HTML5 & CSS3',
  'Node.js',
  'PHP & Laravel',
  'RESTful API',
  'MySQL & PostgreSQL',
  'System Analysis',
  'Manajemen Operasional',
  'Kepemimpinan Lintas Divisi',
];

const milestones = [
  { year: '2026', title: 'Sarjana Sistem Komputer', place: 'Universitas Royal' },
  { year: '2026', title: '10+ proyek web & sistem', place: 'Full Stack Web Development' },
  { year: '2020—2026', title: 'Kepemimpinan lintas divisi', place: 'Markaz Yatim Duafa Qurani' },
  { year: '2012—2026', title: 'Founder & praktisi teknologi', place: 'Wawancellcomp' },
  { year: '2012', title: 'Ahli Madya Teknik Komputer', place: 'AMIK Royal Kisaran' },
];

function Reveal({ children, className = '', delay = 0, as = 'div', enabled = true }) {
  const Component = motion[as];
  return (
    <Component
      className={className}
      initial={enabled ? { opacity: 0, y: 30 } : false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: enabled ? 0.72 : 0, delay, ease }}
    >
      {children}
    </Component>
  );
}

function SectionHeading({ index, eyebrow, children, note }) {
  return (
    <div className="section-heading">
      <div>
        <p className="eyebrow"><span>{index}</span> / {eyebrow}</p>
        <h2 className="display section-title">{children}</h2>
      </div>
      {note && <p className="section-note">{note}</p>}
    </div>
  );
}

function ProfilePortrait() {
  return (
    <div className="portrait-art">
      <div className="portrait-halo" />
      <img
        src="./Asset/img/sulistiawan.png"
        alt="Sulistiawan mengenakan pakaian bernuansa krem"
      />
      <span className="portrait-caption"><span /> SULISTIAWAN · KAB. ASAHAN</span>
    </div>
  );
}

function DashboardPreview({ project, compact = false }) {
  return (
    <div className={`dashboard-preview preview-${project.visual}${compact ? ' compact' : ''}`} aria-hidden="true">
      <div className="preview-chrome">
        <span className="preview-brand-mark">S.</span>
        <span className="preview-address" />
        <span className="preview-dots">•••</span>
      </div>
      <div className="preview-layout">
        <div className="preview-sidebar">
          <i /><i /><i /><i />
        </div>
        <div className="preview-content">
          <div className="preview-heading">
            <span className="preview-kicker" />
            <span className="preview-action" />
          </div>
          <div className="preview-metrics"><i /><i /><i /></div>
          <div className="preview-chart">
            <div className="chart-bars">
              {[34, 57, 43, 74, 51, 84, 65, 92, 68, 78, 55, 88].map((height, index) => (
                <i key={index} style={{ height: `${height}%` }} />
              ))}
            </div>
          </div>
          <div className="preview-table"><i /><i /><i /></div>
        </div>
      </div>
      {!compact && <span className="preview-stamp">SYSTEM / 0{projects.indexOf(project) + 1}</span>}
    </div>
  );
}

function ProjectCard({ project, index, onOpen, featured = false }) {
  return (
    <motion.article
      className={`project-card${featured ? ' project-featured' : ''}`}
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.35, delay: Math.min(index % 4, 3) * 0.04, ease }}
    >
      <button className="project-card-button" onClick={() => onOpen(project)} aria-label={`Lihat detail ${project.title}`}>
        <div className="project-art">
          <DashboardPreview project={project} />
          <span className="project-index">0{index + 1}</span>
          <span className="project-open"><ArrowUpRight size={17} /></span>
        </div>
        <div className="project-meta"><span>{project.category}</span><span>{project.year}</span></div>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <div className="project-footer">
          <span>{project.stack.slice(0, 3).join(' · ')}</span>
          <span className="text-link">LIHAT PROYEK <ArrowUpRight size={13} /></span>
        </div>
      </button>
    </motion.article>
  );
}

function ProjectShowcaseGallery({ items, startIndex }) {
  return (
    <div className="showcase-gallery">
      <div className="showcase-grid">
        {items.map((showcase, index) => (
          <figure className="showcase-card" key={showcase.image}>
            <div className="showcase-image">
              <img src={showcase.image} alt={showcase.alt} loading="lazy" decoding="async" />
            </div>
            <figcaption>
              <span>{String(startIndex + index + 1).padStart(2, '0')}</span>
              <strong>{showcase.title}</strong>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

function ProjectDialog({ project, onClose }) {
  useEffect(() => {
    if (!project) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', closeOnEscape);
    document.body.classList.add('modal-open');
    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      document.body.classList.remove('modal-open');
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}
        >
          <motion.section
            className="project-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="dialog-title"
            initial={{ opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.99 }}
            transition={{ type: 'spring', stiffness: 220, damping: 24 }}
          >
            <button className="dialog-close icon-button" onClick={onClose} aria-label="Tutup detail proyek"><X size={19} /></button>
            <div className="dialog-layout">
              <div className="dialog-visual"><DashboardPreview project={project} /></div>
              <div className="dialog-copy">
                <p className="eyebrow"><span>{project.category}</span> · {project.year}</p>
                <h2 className="display" id="dialog-title">{project.title}</h2>
                <p className="dialog-description">{project.description}</p>
                <p className="dialog-role"><span>PERAN</span>{project.role}</p>
                <div className="dialog-stack">{project.stack.map((item) => <span key={item}>{item}</span>)}</div>
                <a className="button button-outline" href={project.media} target="_blank" rel="noreferrer">
                  LIHAT PROFIL GITHUB <ArrowUpRight size={15} />
                </a>
              </div>
            </div>
            <div className="dialog-architecture">
              <div><span>01 / SYSTEM</span><strong>Logika & struktur</strong><small>Data terkelola · Akses bertingkat · Alur kerja</small></div>
              <ArrowRight size={18} />
              <div><span>02 / INTERFACE</span><strong>Pengalaman pengguna</strong><small>Informasi terarah · Antarmuka responsif</small></div>
            </div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function App() {
  const prefersReducedMotion = useReducedMotion();
  const [theme, setTheme] = useState(
    () => window.localStorage.getItem('sulistiawan-theme') === 'light' ? 'light' : 'dark',
  );
  const [motionPreference, setMotionPreference] = useState(
    () => window.localStorage.getItem('sulistiawan-motion') !== 'off',
  );
  const motionEnabled = motionPreference && !prefersReducedMotion;
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('Semua');
  const [query, setQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(6);
  const [selectedProject, setSelectedProject] = useState(null);
  const [openExperience, setOpenExperience] = useState(0);
  const [comparison, setComparison] = useState(52);
  const [activeSection, setActiveSection] = useState('home');
  const heroRef = useRef(null);
  const { scrollYProgress: pageProgress } = useScroll();
  const progressSpring = useSpring(pageProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroY = useTransform(heroProgress, [0, 1], [0, 110]);
  const heroOpacity = useTransform(heroProgress, [0, 0.8], [1, 0.35]);
  const filteredProjects = useMemo(
    () => filterProjects(activeFilter, query),
    [activeFilter, query],
  );

  useEffect(() => {
    window.localStorage.setItem('sulistiawan-motion', motionPreference ? 'on' : 'off');
    document.documentElement.dataset.motion = motionEnabled ? 'on' : 'off';
  }, [motionEnabled, motionPreference]);

  useEffect(() => {
    window.localStorage.setItem('sulistiawan-theme', theme);
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      'content',
      theme === 'light' ? '#f6f2e9' : '#14120f',
    );
  }, [theme]);

  useEffect(() => {
    const sectionIds = ['home', 'work', 'recognition', 'architecture', 'about', 'journey', 'contact'];
    const elements = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort(
          (first, second) => second.intersectionRatio - first.intersectionRatio,
        );
        if (visible[0]) setActiveSection(visible[0].target.id);
      },
      { rootMargin: '-20% 0px -65% 0px', threshold: [0, 0.2, 0.5] },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  const navItems = [
    ['work', 'Karya'],
    ['about', 'Tentang'],
    ['journey', 'Perjalanan'],
    ['contact', 'Kontak'],
  ];

  function selectFilter(category) {
    setActiveFilter(category);
    setVisibleCount(6);
  }

  return (
    <MotionConfig reducedMotion={motionEnabled ? 'user' : 'always'}>
      <motion.div className="reading-progress" style={{ scaleX: motionEnabled ? progressSpring : pageProgress }} />
      <header className="site-header">
        <a className="wordmark" href="#home" aria-label="SULISTIAWAN, ke beranda">SULISTIAWAN<span>®</span></a>
        <nav className={`desktop-nav${menuOpen ? ' is-open' : ''}`} aria-label="Navigasi utama">
          {navItems.map(([id, label]) => (
            <a key={id} href={`#${id}`} className={activeSection === id ? 'active' : ''} onClick={() => setMenuOpen(false)}>{label}</a>
          ))}
        </nav>
        <div className="header-actions">
          <button className="motion-toggle" onClick={() => setMotionPreference((value) => !value)} aria-pressed={!motionEnabled}>
            <span className={`toggle-track${motionEnabled ? ' is-on' : ''}`}><i /></span>
            <span>GERAK {motionEnabled ? 'ON' : 'OFF'}</span>
          </button>
          <button
            className="theme-toggle icon-button"
            onClick={() => setTheme((value) => value === 'dark' ? 'light' : 'dark')}
            aria-label={theme === 'dark' ? 'Aktifkan mode terang' : 'Aktifkan mode gelap'}
            aria-pressed={theme === 'light'}
            title={theme === 'dark' ? 'Mode terang' : 'Mode gelap'}
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <a className="header-cta" href="#contact">Mari terhubung <ArrowUpRight size={14} /></a>
          <button className="menu-toggle icon-button" onClick={() => setMenuOpen((value) => !value)} aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'} aria-expanded={menuOpen}>
            {menuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </header>

      <main id="main">
        <section className="hero" id="home" ref={heroRef}>
          <div className="hero-topline"><span>PORTFOLIO · 2026</span><span className="availability"><i /> TERBUKA UNTUK KOLABORASI</span></div>
          <motion.div className="hero-backdrop" style={motionEnabled ? { y: heroY, opacity: heroOpacity } : undefined} aria-hidden="true">PORTFOLIO</motion.div>
          <div className="hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">FULL STACK DEVELOPER <span>×</span> OPERATIONS MANAGER</p>
              <p className="hero-greeting">Halo, saya</p>
              <h1 className="display">Sulistiawan<span>.</span></h1>
              <p className="hero-role">FULL STACK DEVELOPER<br />&amp; OPERATIONS MANAGER</p>
              <p className="hero-intro">Saya Sulistiawan, S.Kom. Saya merancang arsitektur web yang tangguh dan memimpin operasional yang berjalan nyata.</p>
              <div className="hero-actions">
                <a className="button button-accent" href="#work">JELAJAHI KARYA <ArrowDownRight size={16} /></a>
                <a className="text-link cv-link" href="mailto:sulist.master@gmail.com?subject=Permintaan%20CV">MINTA CV LENGKAP <ArrowUpRight size={14} /></a>
              </div>
            </div>
            <ProfilePortrait />
            <aside className="hero-stats" aria-label="Ringkasan pengalaman">
              <div><strong>14<span>+</span></strong><small>TAHUN BERKARYA</small></div>
              <div><strong>06</strong><small>TAHUN MEMIMPIN</small></div>
              <div><strong>10<span>+</span></strong><small>PROYEK DIGITAL</small></div>
            </aside>
          </div>
          <div className="hero-bottom">
            <span><MapPin size={13} /> KAB. ASAHAN, SUMATERA UTARA</span>
            <span className="hero-bottom-note">Clean code. <i>Solid operations.</i></span>
            <a href="#work" aria-label="Gulir ke karya"><ArrowDown size={16} /></a>
          </div>
        </section>

        <section className="intro-band section-wrap">
          <Reveal enabled={motionEnabled} className="intro-band-inner">
            <span className="intro-mark">“</span>
            <p>Menghubungkan <em>teknologi</em> yang tepat dengan <em>kepemimpinan</em> yang berdampak.</p>
            <span className="intro-signature">Sulistiawan, S.Kom.</span>
          </Reveal>
        </section>

        <section className="work-section section-wrap" id="work">
          <Reveal enabled={motionEnabled}>
            <SectionHeading index="01" eyebrow="SELECTED WORK" note="Sistem digital yang dirancang untuk kebutuhan nyata.">
              Karya <span className="accent">terpilih.</span>
            </SectionHeading>
          </Reveal>
          <ProjectShowcaseGallery
            items={showcases.slice(0, 3)}
            startIndex={0}
          />
          <div className="featured-grid">
            {projects.slice(0, 3).map((project, index) => (
              <ProjectCard key={`featured-${project.title}`} project={project} index={index} featured onOpen={setSelectedProject} />
            ))}
          </div>

          <div className="archive-heading">
            <div><p className="eyebrow"><span>01.2</span> PROJECT ARCHIVE</p><h3 className="display">Eksplorasi <span className="accent">lainnya.</span></h3></div>
            <span className="archive-count">{filteredProjects.length.toString().padStart(2, '0')} KARYA</span>
          </div>
          <ProjectShowcaseGallery
            items={showcases.slice(3)}
            startIndex={3}
          />
          <div className="archive-tools">
            <div className="filter-list" role="group" aria-label="Filter kategori proyek">
              {categories.map((category) => (
                <button key={category} className={activeFilter === category ? 'filter-chip active' : 'filter-chip'} onClick={() => selectFilter(category)} aria-pressed={activeFilter === category}>
                  {category}{activeFilter === category && <span className="filter-indicator" />}
                </button>
              ))}
            </div>
            <label className="search-field">
              <span className="sr-only">Cari proyek</span>
              <input value={query} onChange={(event) => { setQuery(event.target.value); setVisibleCount(6); }} placeholder="Cari proyek..." />
              <span aria-hidden="true">⌕</span>
            </label>
          </div>
          <motion.div className="archive-grid" layout>
            <AnimatePresence mode="popLayout">
              {filteredProjects.slice(0, visibleCount).map((project, index) => (
                <ProjectCard key={project.title} project={project} index={index} onOpen={setSelectedProject} />
              ))}
            </AnimatePresence>
          </motion.div>
          {filteredProjects.length === 0 ? (
            <div className="empty-state"><p>Tidak ada karya yang cocok.</p><button className="text-link" onClick={() => { setQuery(''); selectFilter('Semua'); }}>HAPUS FILTER <ArrowRight size={13} /></button></div>
          ) : filteredProjects.length > visibleCount ? (
            <button className="load-more" onClick={() => setVisibleCount((count) => count + 4)}>MUAT LEBIH BANYAK <Plus size={15} /></button>
          ) : (
            <p className="archive-end"><Check size={14} /> SELURUH KARYA DITAMPILKAN</p>
          )}
        </section>

        <section className="brand-strip" aria-label="Institusi, kolaborator, dan teknologi">
          <span className="brand-label">BERTUMBUH BERSAMA</span>
          <div className="brand-viewport"><div className="brand-rail">
            {[...brands, ...brands].map((brand, index) => <span className="brand-item" key={`${brand}-${index}`}>{brand}<i>✳</i></span>)}
          </div></div>
        </section>

        <section className="recognition-section section-wrap" id="recognition">
          <Reveal enabled={motionEnabled}>
            <SectionHeading index="02" eyebrow="RECOGNITION & MILESTONES" note="Babak perjalanan yang membentuk cara saya bekerja.">
              Jejak <span className="accent">bermakna.</span>
            </SectionHeading>
          </Reveal>
          <div className="milestone-list">
            {milestones.map((item, index) => (
              <Reveal enabled={motionEnabled} as="article" className="milestone-row" delay={index * 0.035} key={item.title}>
                <span className="milestone-year">{item.year}</span>
                <h3>{item.title}</h3>
                <span className="milestone-place">{item.place}</span>
                <ArrowUpRight size={17} />
              </Reveal>
            ))}
          </div>
        </section>

        <section className="architecture-section section-wrap" id="architecture">
          <Reveal enabled={motionEnabled}>
            <SectionHeading index="03" eyebrow="SYSTEM ARCHITECTURE" note="Geser untuk melihat bagaimana fondasi sistem terhubung dengan pengalaman pengguna.">
              Dari logika ke <span className="accent">pengalaman.</span>
            </SectionHeading>
          </Reveal>
          <div className="architecture-showcase" style={{ '--split': `${comparison}%` }}>
            <div className="architecture-layer architecture-backend">
              <div className="architecture-caption"><span>01 / BACKEND ARCHITECTURE</span><strong>Struktur yang <i>terukur.</i></strong></div>
              <div className="architecture-diagram">
                <div className="diagram-node"><Database size={16} /><span>DATABASE</span><small>Users · Records · Reports</small></div>
                <div className="diagram-connectors"><i /><i /><i /></div>
                <div className="diagram-node"><Code2 size={16} /><span>API & LOGIC</span><small>Auth · Services · Workflow</small></div>
                <div className="diagram-connectors"><i /><i /><i /></div>
                <div className="diagram-node"><Layers3 size={16} /><span>FRONTEND</span><small>Dashboard · Forms · Insights</small></div>
              </div>
            </div>
            <div className="architecture-layer architecture-frontend">
              <div className="architecture-caption"><span>02 / FINAL FRONTEND UI</span><strong>Pengalaman yang <i>jelas.</i></strong></div>
              <div className="architecture-ui">
                <div className="ui-sidebar"><b>S.</b><i /><i /><i /><i /></div>
                <div className="ui-main"><div className="ui-topbar"><i /><span>OVERVIEW / 2026</span><b>SW</b></div><h3>Ringkasan <em>aktivitas.</em></h3><div className="ui-metrics"><i /><i /><i /></div><div className="ui-graph"><span /><span /><span /><span /><span /><span /><span /></div></div>
              </div>
            </div>
            <div className="comparison-divider" aria-hidden="true" />
            <label className="comparison-control">
              <span className="sr-only">Geser untuk membandingkan arsitektur backend dan antarmuka</span>
              <input type="range" min="14" max="86" value={comparison} onChange={(event) => setComparison(Number(event.target.value))} aria-valuetext={`Tampilan ${comparison} persen antarmuka`} />
              <span className="comparison-handle"><MoveUpRight size={17} /></span>
            </label>
            <div className="comparison-labels"><span>BACKEND / WIREFRAME</span><span>FINAL UI / FRONTEND</span></div>
          </div>
        </section>

        <section className="about-section section-wrap" id="about">
          <Reveal enabled={motionEnabled}>
            <SectionHeading index="04" eyebrow="BEHIND THE SYSTEM" note="Perspektif teknis yang berpijak pada kebutuhan manusia dan operasional.">
              Tentang <span className="accent">saya.</span>
            </SectionHeading>
          </Reveal>
          <div className="about-grid">
            <div className="about-story">
              <span className="about-big-mark">S.</span>
              <p className="about-lead">Dua dunia. Satu tujuan: <span>membuat semuanya bekerja lebih baik.</span></p>
              <p>Saya Sulistiawan, S.Kom., Full Stack Developer sekaligus Manajer Operasional dari Kabupaten Asahan, Sumatera Utara. Saya menjembatani pengembangan aplikasi web—dari frontend hingga backend—dengan pengalaman memimpin tim dan proses lintas divisi.</p>
              <p>Teknologi terbaik bukan sekadar rapi di kode. Ia membantu orang mengambil keputusan dan menjalankan pekerjaan dengan lebih terarah.</p>
              <span className="handwriting">Build with purpose.</span>
            </div>
            <div className="about-details">
              <div className="education-block">
                <p className="eyebrow">PENDIDIKAN & PRAKTIK</p>
                <article><span>2026</span><div><h3>Universitas Royal</h3><p>S1 Sistem Komputer · S.Kom.</p></div><ArrowUpRight size={15} /></article>
                <article><span>2012</span><div><h3>AMIK Royal Kisaran</h3><p>D3 Teknik Komputer · A.Md.</p></div><ArrowUpRight size={15} /></article>
                <article><span>2012—26</span><div><h3>Pengalaman Industri</h3><p>Wawancellcomp · Markaz Yatim</p></div><ArrowUpRight size={15} /></article>
              </div>
              <div className="skills-block"><p className="eyebrow">KEAHLIAN PILIHAN</p><div className="skill-cloud">{skills.map((skill) => <span key={skill}>{skill}</span>)}</div></div>
            </div>
          </div>
          <div className="process-row">
            {['Pahami kebutuhan', 'Rancang sistem', 'Bangun & uji', 'Evaluasi operasional'].map((step, index) => (
              <div className="process-step" key={step}><span>0{index + 1}</span><strong>{step}</strong>{index < 3 && <ArrowRight size={14} />}</div>
            ))}
          </div>
        </section>

        <section className="journey-section section-wrap" id="journey">
          <Reveal enabled={motionEnabled}>
            <SectionHeading index="05" eyebrow="THE JOURNEY" note="Belajar, memimpin, dan membangun — satu langkah nyata setiap waktu.">
              Perjalanan <span className="accent">saya.</span>
            </SectionHeading>
          </Reveal>
          <div className="journey-grid">
            <div className="experience-list">
              {experience.map((item, index) => (
                <article className={`experience-item${openExperience === index ? ' expanded' : ''}`} key={item.number}>
                  <button className="experience-trigger" onClick={() => setOpenExperience(openExperience === index ? -1 : index)} aria-expanded={openExperience === index}>
                    <span className="experience-number">{item.number}</span>
                    <span className="experience-main"><small>{item.date}</small><strong>{item.title}</strong><em>{item.company}</em></span>
                    <span className="experience-plus">{openExperience === index ? <Minus size={17} /> : <Plus size={17} />}</span>
                  </button>
                  <AnimatePresence initial={false}>
                    {openExperience === index && (
                      <motion.div className="experience-description" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: motionEnabled ? 0.34 : 0 }}>
                        <p>{item.description}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </article>
              ))}
              <a className="button button-outline journey-cv" href="mailto:sulist.master@gmail.com?subject=Permintaan%20CV">MINTA CV LENGKAP <ArrowUpRight size={14} /></a>
            </div>
            <div className="journey-quote">
              <span className="quote-mark">“</span>
              <p>Teknologi adalah alat. <em>Kepemimpinan adalah cara kita mengarahkannya.</em></p>
              <span className="quote-credit">SULISTIAWAN, S.KOM. <i>— 2026</i></span>
              <div className="quote-decoration">S.</div>
            </div>
          </div>
        </section>

        <section className="contact-section section-wrap" id="contact">
          <Reveal enabled={motionEnabled}>
            <p className="eyebrow"><span>06</span> / LET'S BUILD SOMETHING</p>
            <h2 className="display contact-title">Ada ide?<br /><span>Mari wujudkan.</span></h2>
          </Reveal>
          <div className="contact-grid">
            <div className="contact-intro">
              <p>Sedang membangun produk, mengembangkan tim, atau merapikan proses operasional? Saya terbuka untuk percakapan dan kolaborasi yang bermakna.</p>
              <a className="contact-email" href="mailto:sulist.master@gmail.com">sulist.master@gmail.com <ArrowUpRight size={17} /></a>
              <p className="contact-location"><MapPin size={14} /> KAB. ASAHAN, SUMATERA UTARA</p>
            </div>
            <form className="contact-form" onSubmit={(event) => {
              event.preventDefault();
              const form = new FormData(event.currentTarget);
              const name = String(form.get('name') ?? '').trim();
              const message = String(form.get('message') ?? '').trim();
              const text = `Halo Sulistiawan, saya ${name}. ${message}`;
              window.open(`https://wa.me/6285261804096?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
            }}>
              <label>Nama Anda<input name="name" autoComplete="name" required placeholder="Bagaimana saya menyapa Anda?" /></label>
              <label>Ceritakan sedikit tentang ide Anda<textarea name="message" rows="3" required placeholder="Ceritakan kebutuhan atau rencana Anda..." /></label>
              <button className="button button-accent" type="submit">KIRIM VIA WHATSAPP <Send size={14} /></button>
              <span className="form-note">Pesan akan diteruskan ke WhatsApp · +62 852-6180-4096</span>
            </form>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <a className="wordmark footer-wordmark" href="#home">SULISTIAWAN<span>®</span></a>
        <span className="footer-copy">© 2026 · DIBUAT DENGAN KETELITIAN DARI ASAHAN, INDONESIA.</span>
        <div className="social-links">
          <a href="https://www.linkedin.com/in/sulistiawan-s-kom-56215b92" target="_blank" rel="noreferrer" aria-label="LinkedIn Sulistiawan"><Linkedin size={16} /></a>
          <a href="https://github.com/wawancellcomp" target="_blank" rel="noreferrer" aria-label="GitHub Wawancellcomp"><Github size={16} /></a>
          <a href="https://wawancellcomp.github.io/" target="_blank" rel="noreferrer" aria-label="Beranda portfolio Sulistiawan"><Globe size={16} /></a>
          <a href="mailto:sulist.master@gmail.com" aria-label="Email Sulistiawan"><Mail size={16} /></a>
        </div>
      </footer>

      <ProjectDialog project={selectedProject} onClose={() => setSelectedProject(null)} />
    </MotionConfig>
  );
}

createRoot(document.getElementById('root')).render(<App />);
