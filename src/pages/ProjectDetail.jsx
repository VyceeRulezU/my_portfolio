import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, ArrowLeft, Lock, Mail } from 'lucide-react';
import { PortableText } from '@portabletext/react';
import { SITE_IMAGES } from '../utils/assetHelper';
import SmartImg from '../components/SmartImg';
import { PROJECTS, findProject, getProject, getGallery, unlockProject } from '../utils/projects';

const GATED_EMAIL = "ironaliv@gmail.com";

const SECTIONS = [
  { id: 'snapshot', label: 'Project Snapshot' },
  { id: 'overview', label: 'Project Overview', subtitle: 'Context & Brief' },
  { id: 'problem', label: 'The Problem', subtitle: 'Problem Space' },
  { id: 'solution', label: 'The Solution', subtitle: 'Design Approach' },
  { id: 'impact', label: 'Results & Impact', subtitle: 'Outcomes & Impact' },
  { id: 'gallery', label: 'Process Gallery', subtitle: 'Process & Artifacts' }
];

const hasContent = (value) => (Array.isArray(value) ? value.length > 0 : Boolean(value));
const sectionHasText = (project, secId) => Boolean(project.html?.[secId]) || hasContent(project[secId]);

// Keyed by id so all per-project state resets when navigating between case studies.
export default function ProjectDetailPage() {
  const { id } = useParams();
  const local = findProject(id);
  // Old URLs (e.g. a renamed slug) redirect to the canonical one.
  if (local && local.id !== id) return <Navigate to={`/work/${local.id}`} replace />;
  return <ProjectDetail key={id} id={id} />;
}

function ProjectDetail({ id }) {
  // Repo projects are available synchronously; only Sanity fallbacks need a fetch.
  const [project, setProject] = useState(() => findProject(id) ?? null);
  const [loading, setLoading] = useState(() => !findProject(id));
  const [galleryImages, setGalleryImages] = useState([]);
  const [activeSection, setActiveSection] = useState('');
  const [selectedImgIdx, setSelectedImgIdx] = useState(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [unlocking, setUnlocking] = useState(false);

  const isLocked = Boolean(project?.isPrivate && !isUnlocked);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setUnlocking(true);
    const content = await unlockProject(id, passwordInput).catch(() => null);
    setUnlocking(false);
    if (content) {
      setProject(prev => ({ ...prev, ...content }));
      setIsUnlocked(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  const nextImg = useCallback(() => {
    setSelectedImgIdx(prev => prev === null ? prev : (prev + 1) % galleryImages.length);
  }, [galleryImages.length]);

  const prevImg = useCallback(() => {
    setSelectedImgIdx(prev => prev === null ? prev : (prev - 1 + galleryImages.length) % galleryImages.length);
  }, [galleryImages.length]);

  useEffect(() => {
    if (!loading) return;
    let cancelled = false;
    getProject(id).then((data) => {
      if (cancelled) return;
      setProject(data);
      setLoading(false);
    });

    return () => { cancelled = true; };
  }, [id, loading]);

  useEffect(() => {
    if (!project || isLocked) return;
    let cancelled = false;
    getGallery(project).then((images) => {
      if (!cancelled) setGalleryImages(images);
    });
    return () => { cancelled = true; };
  }, [project, isLocked]);

  useEffect(() => {
    if (selectedImgIdx === null) return;
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') nextImg();
      if (e.key === 'ArrowLeft') prevImg();
      if (e.key === 'Escape') setSelectedImgIdx(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImgIdx, nextImg, prevImg]);

  const visibleSections = project ? SECTIONS.filter((sec) => {
    if (sec.id === 'snapshot') return true;
    if (sec.id === 'gallery') return galleryImages.length > 0;
    return sectionHasText(project, sec.id) || hasContent(project[`${sec.id}Images`]);
  }) : [];
  const visibleSectionIds = visibleSections.map((sec) => sec.id).join(',');

  useEffect(() => {
    if (!visibleSectionIds || isLocked) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-20% 0px -60% 0px' }
    );

    visibleSectionIds.split(',').forEach((secId) => {
      const el = document.getElementById(secId);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [visibleSectionIds, isLocked]);

  if (loading) {
    const isDarkTheme = document.documentElement.classList.contains('dark-theme');
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
        <motion.img
          src={isDarkTheme ? SITE_IMAGES.logoWhite : SITE_IMAGES.logoBlack}
          alt="Loading"
          style={{ height: '6rem', width: 'auto' }}
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    );
  }

  if (!project) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)' }}>
      Project not found. <Link to="/" style={{ color: 'var(--text-primary)', marginLeft: '1rem' }}>Back home</Link>
    </div>
  );

  const snapshot = [
    { label: 'ROLE', value: project.role },
    { label: 'YEAR', value: project.year },
    { label: 'TYPE', value: project.type === 'case' ? 'Case Study' : project.type },
  ].filter((item) => item.value);

  return (
    <section className="page-container" style={{ paddingTop: '12rem', paddingBottom: '8rem', color: 'var(--text-primary)' }}>
      <style>{`
        .case-study-layout { display: flex; gap: 8rem; position: relative; align-items: flex-start; }
        .case-study-content { flex: 1; min-width: 0; }
        .case-study-sidebar { width: 320px; flex-shrink: 0; position: sticky; top: 10rem; height: max-content; }
        .sticky-toc { display: flex; flex-direction: column; gap: 1.5rem; }
        .toc-link { color: var(--text-tertiary); text-decoration: none; transition: color 0.2s; display: block; }
        .toc-label { font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; display: block; margin-bottom: 0.2rem; }
        .toc-subtitle { font-size: 0.65rem; opacity: 0.5; font-weight: 400; display: block; }
        .toc-link:hover, .toc-link.active { color: var(--text-primary); }
        .section-block { margin-bottom: 10rem; scroll-margin-top: 10rem; }
        .section-images { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 400px), 1fr)); gap: 1.5rem; margin-top: 3rem; }
        .section-image-card { border-radius: 24px; overflow: hidden; background: var(--bg-secondary); border: 1px solid var(--border-color); }
        .section-image-card img { width: 100%; height: auto; display: block; }

        .project-header { display: flex; justify-content: space-between; align-items: flex-end; gap: 2rem; margin-bottom: 6rem; flex-wrap: wrap; }
        .live-btn { background: var(--text-primary); color: var(--bg-primary); padding: 1rem 2rem; border-radius: 99px; border: none; cursor: pointer; text-decoration: none; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; transition: all 0.3s; }
        .live-btn:hover { opacity: 0.9; transform: translateY(-3px); box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
        .live-btn:disabled { opacity: 0.6; cursor: wait; transform: none; }

        .snapshot-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2.5rem; padding: 3rem 0; border-top: 1px solid var(--border-color); border-bottom: 1px solid var(--border-color); margin-bottom: 6rem; scroll-margin-top: 10rem; }

        .back-to-work-link { display: inline-flex; align-items: center; gap: 0.5rem; color: var(--text-tertiary); font-size: 0.65rem; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; text-decoration: none; transition: color 0.3s ease; }
        .back-to-work-link:hover { color: var(--text-primary); }

        .section-text-content ul { list-style-type: disc; margin-left: 1.5rem; margin-bottom: 1.5rem; }
        .section-text-content ol { list-style-type: decimal; margin-left: 1.5rem; margin-bottom: 1.5rem; }
        .section-text-content li { margin-bottom: 0.5rem; }

        .gallery-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr)); gap: 1.5rem; }
        .gallery-item { border: none; padding: 0; border-radius: 16px; overflow: hidden; cursor: pointer; aspect-ratio: 16/9; background: var(--bg-secondary); }
        .gallery-item img { width: 100%; height: 100%; object-fit: cover; display: block; }

        .lightbox-btn { position: absolute; background: rgba(255,255,255,0.1); border: none; color: white; border-radius: 50%; width: 44px; height: 44px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.2s; }
        .lightbox-btn:hover { background: rgba(255,255,255,0.2); }

        .other-works-section { margin-top: 15rem; padding-top: 8rem; border-top: 1px solid var(--border-color); }
        .other-works-header { display: flex; justify-content: space-between; align-items: center; gap: 1.5rem; flex-wrap: wrap; margin-bottom: 4rem; }
        .other-works-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2.5rem; }
        .work-card { text-decoration: none; color: inherit; }
        .work-card-img { width: 100%; aspect-ratio: 16/10; border-radius: 20px; overflow: hidden; background: var(--bg-secondary); margin-bottom: 1.5rem; border: 1px solid var(--border-color); }
        .work-card-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
        .work-card:hover .work-card-img img { transform: scale(1.05); }
        .work-card-tag { color: #ff3e3e; font-size: 0.65rem; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 0.5rem; display: block; }
        .work-card-title { font-size: 1.5rem; font-weight: 600; font-family: 'Space Grotesk', sans-serif; display: flex; justify-content: space-between; align-items: center; gap: 1rem; }
        .work-card-arrow { width: 32px; height: 32px; flex-shrink: 0; border-radius: 50%; border: 1px solid var(--border-color); display: flex; align-items: center; justify-content: center; opacity: 0.3; transition: all 0.3s; }
        .work-card:hover .work-card-arrow { opacity: 1; background: var(--text-primary); color: var(--bg-primary); transform: rotate(-45deg); }

        @media (max-width: 1200px) {
          .case-study-layout { flex-direction: column; gap: 4rem; }
          .case-study-sidebar { display: none; }
        }
        @media (max-width: 1024px) {
          .other-works-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
          .other-works-grid { grid-template-columns: 1fr; }
          .other-works-section { margin-top: 10rem; }
        }
      `}</style>

      <div style={{ maxWidth: '1800px', margin: '0 auto', padding: '0 5vw' }}>

        {/* Navigation */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '4rem' }}>
          <Link to="/#projects" className="back-to-work-link">
            <ArrowLeft size={14} /> BACK TO WORK
          </Link>
        </motion.div>

        {/* Header with Title and Button */}
        <div className="project-header">
          <div style={{ flex: 1 }}>
            <div style={{ color: 'var(--text-tertiary)', fontSize: '0.65rem', fontWeight: '700', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
              / CASE STUDY / {project.title}
            </div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
              style={{ fontSize: 'clamp(3rem, 7vw, 6rem)', fontWeight: '700', lineHeight: '0.95', letterSpacing: '-0.04em', fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {project.headline || project.title}
            </motion.h1>
          </div>

          {project.url && project.url !== "#" && (
            <motion.a
              href={project.url} target="_blank" rel="noopener noreferrer" className="live-btn"
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}
            >
              View Live Project ↗
            </motion.a>
          )}
        </div>

        {/* Gated Access Lock Screen */}
        {isLocked ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              padding: '8rem 2rem', background: 'var(--bg-secondary)', borderRadius: '32px',
              border: '1px solid var(--border-color)', textAlign: 'center', margin: '4rem 0'
            }}
          >
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem', border: '1px solid var(--border-color)' }}>
              <Lock size={32} color="var(--text-primary)" />
            </div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '1rem', fontFamily: "'Space Grotesk', sans-serif" }}>This Case Study is Private</h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', marginBottom: '3rem', fontSize: '1.1rem' }}>
              Due to the sensitive nature of this project, access is restricted. Please reach out to me for the password or to request a walkthrough.
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <a href={`mailto:${GATED_EMAIL}`} className="live-btn" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Mail size={16} /> Contact for Access
              </a>

              {project.hasPassword && (
                <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="password"
                    placeholder="Enter Password"
                    aria-label="Case study password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    style={{
                      background: 'var(--bg-primary)', border: `1px solid ${passwordError ? '#ff4d4d' : 'var(--border-color)'}`,
                      padding: '0 1.5rem', borderRadius: '99px', fontSize: '0.8rem', color: 'var(--text-primary)', outline: 'none'
                    }}
                  />
                  <button type="submit" className="live-btn" disabled={unlocking || !passwordInput} style={{ background: 'var(--text-secondary)' }}>
                    {unlocking ? 'Checking…' : 'Unlock'}
                  </button>
                </form>
              )}
            </div>
            {passwordError && <div role="alert" style={{ color: '#ff4d4d', fontSize: '0.7rem', marginTop: '1rem', fontWeight: '600' }}>Incorrect password. Please try again.</div>}
          </motion.div>
        ) : (
          <>
            {/* Hero Image */}
            {project.heroImg && (
              <div style={{ width: '100%', marginBottom: '10rem', borderRadius: '32px', overflow: 'hidden', background: 'var(--border-color)' }}>
                <SmartImg src={project.heroImg} width={1920} alt={project.title} loading="eager" fetchPriority="high" style={{ width: '100%', height: 'auto', display: 'block' }} />
              </div>
            )}

            <div className="case-study-layout">
              {/* Main Content */}
              <div className="case-study-content">
                {visibleSections.map((sec) => {
                  if (sec.id === 'snapshot') return (
                    <div key={sec.id} id={sec.id} className="snapshot-grid">
                      {snapshot.map((item) => (
                        <div key={item.label}>
                          <div style={{ fontSize: '0.6rem', fontWeight: '700', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.1em' }}>{item.label}</div>
                          <div style={{ fontWeight: '600', fontSize: '0.9rem', textTransform: item.label === 'TYPE' ? 'capitalize' : 'none' }}>{item.value}</div>
                        </div>
                      ))}
                    </div>
                  );

                  if (sec.id === 'gallery') return (
                    <div key={sec.id} id={sec.id} className="section-block">
                      <h2 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '1rem', fontFamily: "'Space Grotesk', sans-serif" }}>{sec.label}</h2>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginBottom: '3rem', letterSpacing: '0.05em' }}>{sec.subtitle}</div>
                      <div className="gallery-grid">
                        {galleryImages.map((img, idx) => (
                          <motion.button
                            key={img.full}
                            type="button"
                            className="gallery-item"
                            whileHover={{ scale: 1.02 }}
                            onClick={() => setSelectedImgIdx(idx)}
                            aria-label={`Open ${project.title} image ${idx + 1} of ${galleryImages.length}`}
                          >
                            <SmartImg src={img.thumb} width={800} />
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  );

                  const content = project[sec.id];
                  const html = project.html?.[sec.id];
                  const images = project[`${sec.id}Images`];

                  return (
                    <div key={sec.id} id={sec.id} className="section-block">
                      <h2 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '1rem', fontFamily: "'Space Grotesk', sans-serif" }}>{sec.label}</h2>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginBottom: '2.5rem', letterSpacing: '0.05em' }}>{sec.subtitle}</div>

                      {(html || hasContent(content)) && (
                        <div className="section-text-content" style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', lineHeight: '1.8', maxWidth: '900px' }}>
                          {html
                            ? <div dangerouslySetInnerHTML={{ __html: html }} />
                            : Array.isArray(content) ? <PortableText value={content} /> : <p>{content}</p>}
                        </div>
                      )}

                      {images?.length > 0 && (
                        <div className="section-images">
                          {images.map((img, idx) => (
                            <div key={img} className="section-image-card">
                              <img src={img} alt={`${sec.label} ${idx + 1}`} loading="lazy" decoding="async" />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Sidebar TOC */}
              <aside className="case-study-sidebar">
                <nav className="sticky-toc" aria-label="Case study contents">
                  <div style={{ fontSize: '0.6rem', fontWeight: '800', color: 'var(--text-tertiary)', letterSpacing: '0.2em', marginBottom: '1.5rem' }}>CONTENTS</div>
                  {visibleSections.map(sec => (
                    <a key={sec.id} href={`#${sec.id}`} className={`toc-link ${activeSection === sec.id ? 'active' : ''}`}>
                      <span className="toc-label">{sec.label}</span>
                      {sec.subtitle && <span className="toc-subtitle">{sec.subtitle}</span>}
                    </a>
                  ))}
                </nav>
              </aside>
            </div>
          </>
        )}

        {/* View Other Works Section */}
        <section className="other-works-section">
          <div className="other-works-header">
            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: '700', fontFamily: "'Space Grotesk', sans-serif" }}>View other works</h2>
            <Link to="/#projects" className="live-btn" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', fontSize: '0.6rem' }}>
              All works
            </Link>
          </div>

          <div className="other-works-grid">
            {PROJECTS
              .filter(p => p.id !== project.id)
              .slice(0, 3)
              .map((p, idx) => (
                <motion.div key={p.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}>
                  <Link to={`/work/${p.id}`} className="work-card">
                    <div className="work-card-img">
                      <SmartImg src={p.img} width={800} alt={p.title} />
                    </div>
                    <span className="work-card-tag">{p.role || 'Case Study'}</span>
                    <div className="work-card-title">
                      {p.title}
                      <div className="work-card-arrow">
                        <ArrowLeft size={16} style={{ transform: 'rotate(180deg)' }} />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
          </div>
        </section>

        {/* Lightbox */}
        {createPortal(
          <AnimatePresence>
            {selectedImgIdx !== null && galleryImages.length > 0 && (
              <motion.div
                role="dialog" aria-modal="true" aria-label="Image viewer"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.88)', backdropFilter: 'blur(16px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}
                onClick={() => setSelectedImgIdx(null)}
              >
                <button type="button" className="lightbox-btn" aria-label="Close" onClick={(e) => { e.stopPropagation(); setSelectedImgIdx(null); }} style={{ top: '1.5rem', right: '1.5rem' }}><X size={18} /></button>
                {galleryImages.length > 1 && (
                  <>
                    <button type="button" className="lightbox-btn" aria-label="Previous image" onClick={(e) => { e.stopPropagation(); prevImg(); }} style={{ left: '1.5rem', top: '50%', transform: 'translateY(-50%)' }}><ChevronLeft size={22} /></button>
                    <button type="button" className="lightbox-btn" aria-label="Next image" onClick={(e) => { e.stopPropagation(); nextImg(); }} style={{ right: '1.5rem', top: '50%', transform: 'translateY(-50%)' }}><ChevronRight size={22} /></button>
                  </>
                )}
                <SmartImg
                  src={galleryImages[selectedImgIdx].full}
                  width={1920}
                  loading="eager"
                  alt={`${project.title} image ${selectedImgIdx + 1} of ${galleryImages.length}`}
                  onClick={(e) => e.stopPropagation()}
                  style={{ maxHeight: '85%', maxWidth: '85%', objectFit: 'contain', borderRadius: '12px' }}
                />
                <div style={{ position: 'absolute', bottom: '1.5rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em' }}>
                  {selectedImgIdx + 1} / {galleryImages.length}
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}

      </div>
    </section>
  );
}
