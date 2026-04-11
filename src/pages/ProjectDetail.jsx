import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getAssetUrl } from '../utils/assetHelper';
import { ALL_PROJECTS } from '../data/projectsData';
import { ChevronLeft, ChevronRight, X, ArrowLeft } from 'lucide-react';

const GALLERY_API = import.meta.env.VITE_GALLERY_API_URL;

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [selectedImgIdx, setSelectedImgIdx] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryLoading, setGalleryLoading] = useState(true);

  const nextImg = useCallback(() => {
    setSelectedImgIdx(prev => prev !== null && galleryImages.length > 0
      ? (prev + 1) % galleryImages.length
      : prev
    );
  }, [galleryImages.length]);

  const prevImg = useCallback(() => {
    setSelectedImgIdx(prev => prev !== null && galleryImages.length > 0
      ? (prev - 1 + galleryImages.length) % galleryImages.length
      : prev
    );
  }, [galleryImages.length]);

  useEffect(() => {
    const found = ALL_PROJECTS.find(p => p.id === id);
    setProject(found);
    window.scrollTo(0, 0);

    // Fetch gallery — use folder name from img path if different from id
    if (id && GALLERY_API) {
      setGalleryLoading(true);
      // Extract folder from img path e.g. /portfolio/Osus/... -> Osus
      const folderMatch = found?.img?.match(/\/portfolio\/([^/]+)\//i);
      const folderName = folderMatch ? folderMatch[1] : id;
      fetch(`${GALLERY_API}?project=${folderName}`)
        .then(r => r.json())
        .then(data => {
          setGalleryImages(data.images || []);
        })
        .catch(() => setGalleryImages([]))
        .finally(() => setGalleryLoading(false));
    } else {
      setGalleryLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') nextImg();
      if (e.key === 'ArrowLeft') prevImg();
      if (e.key === 'Escape') setSelectedImgIdx(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextImg, prevImg]);

  if (!project) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)' }}>
      Project not found. <Link to="/" style={{ color: 'var(--text-primary)', marginLeft: '1rem' }}>Back home</Link>
    </div>
  );

  return (
    <section className="page-container" style={{ paddingTop: '12rem', paddingBottom: '8rem', color: 'var(--text-primary)' }}>
      <style>{`
        @media (max-width: 768px) {
          .case-study-grid { grid-template-columns: 1fr !important; gap: 3rem !important; }
        }
      `}</style>
      <div style={{ maxWidth: '1800px', margin: '0 auto', padding: '0 5vw' }}>
        
        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ marginBottom: '4rem' }}
        >
           <Link to="/#projects" style={{ 
             display: 'inline-flex', 
             alignItems: 'center', 
             gap: '0.5rem',
             color: 'var(--text-tertiary)', 
             fontSize: '0.65rem', 
             fontWeight: '700', 
             letterSpacing: '0.15em', 
             textTransform: 'uppercase', 
             textDecoration: 'none' 
           }}>
              <ArrowLeft size={14} /> BACK TO WORK
           </Link>
        </motion.div>

        {/* Title & Headline */}
        <div style={{ marginBottom: '6rem' }}>
           <div style={{ color: 'var(--text-tertiary)', fontSize: '0.65rem', fontWeight: '700', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
              / CASE STUDY / {project.title}
           </div>
           <motion.h1 
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8 }}
             style={{ 
               fontSize: 'clamp(3rem, 7vw, 6rem)', 
               fontWeight: '700', 
               lineHeight: '0.95', 
               letterSpacing: '-0.04em',
               fontFamily: "'Space Grotesk', sans-serif",
               maxWidth: '1000px'
             }}
           >
              {project.headline}
           </motion.h1>
        </div>

        {/* Metadata Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '2.5rem', 
          padding: '3rem 0', 
          borderTop: '1px solid var(--border-color)', 
          borderBottom: '1px solid var(--border-color)',
          marginBottom: '6rem' 
        }}>
           <div>
              <div style={{ fontSize: '0.6rem', fontWeight: '700', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.1em' }}>ROLE</div>
              <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{project.role}</div>
           </div>
           <div>
              <div style={{ fontSize: '0.6rem', fontWeight: '700', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.1em' }}>TIMELINE</div>
              <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{project.year !== "2025" ? project.year : "Ongoing"}</div>
           </div>
           {project.url && project.url !== "#" && (
             <div>
                <div style={{ fontSize: '0.6rem', fontWeight: '700', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.1em' }}>
                  {project.type === 'case' || project.type === 'other' ? 'PROTOTYPE' : 'LIVE PROJECT'}
                </div>
                <div><a href={project.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '0.9rem', textDecoration: 'none', borderBottom: '1px solid currentColor' }}>
                  {project.type === 'case' || project.type === 'other' ? 'View Prototype ↗' : 'Visit Website ↗'}
                </a></div>
             </div>
           )}
        </div>

        {/* Main Hero Image */}
        <div style={{ width: '100%', marginBottom: '8rem', borderRadius: '32px', overflow: 'hidden', background: 'var(--border-color)' }}>
           <img src={getAssetUrl(project.img)} alt={project.title} style={{ width: '100%', height: 'auto', display: 'block' }} />
        </div>

        {/* Case Study Content Sections */}
        <motion.div
          className="case-study-grid"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8rem', marginBottom: '10rem' }}
        >
           <div style={{ display: 'flex', flexDirection: 'column', gap: '6rem' }}>
              <div>
                 <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '2rem', fontFamily: "'Space Grotesk', sans-serif" }}>The Problem</h2>
                 <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: '1.7' }}>{project.problem}</p>
              </div>
              <div>
                 <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '1.5rem', fontFamily: "'Space Grotesk', sans-serif" }}>The Solution</h2>
                 <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: '1.7' }}>{project.solution}</p>
              </div>
           </div>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '6rem' }}>
              <div>
                 <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '1.5rem', fontFamily: "'Space Grotesk', sans-serif" }}>Project Overview</h2>
                 <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: '1.7' }}>{project.overview}</p>
              </div>
              <div>
                 <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '1.5rem', fontFamily: "'Space Grotesk', sans-serif" }}>Results & Impact</h2>
                 <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: '1.7' }}>{project.impact}</p>
               </div>
            </div>
         </motion.div>


        {/* Process Gallery Section */}
        {galleryLoading ? (
          <div style={{ marginBottom: '8rem', display: 'flex', gap: '1.5rem' }}>
            {[1,2,3].map(i => (
              <div key={i} style={{ flex: 1, height: '220px', borderRadius: '16px', background: 'var(--bg-secondary)', animation: 'pulse 1.5s ease infinite' }} />
            ))}
          </div>
        ) : galleryImages.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ marginBottom: '8rem' }}
          >
            <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '3rem', fontFamily: "'Space Grotesk', sans-serif" }}>Process &amp; Iterations</h2>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
              gap: '1.5rem' 
            }}>
              {galleryImages.map((img, idx) => (
                <motion.div 
                  key={idx}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedImgIdx(idx)}
                  style={{ 
                    borderRadius: '16px', 
                    overflow: 'hidden', 
                    cursor: 'pointer',
                    aspectRatio: '16/9',
                    background: 'var(--bg-secondary)'
                  }}
                >
                  <img 
                    src={img}
                    alt={`Process ${idx + 1}`} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Lightbox / Modal — rendered via portal to escape stacking contexts */}
        {createPortal(
          <AnimatePresence>
            {selectedImgIdx !== null && galleryImages.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                  background: 'rgba(0, 0, 0, 0.88)',
                  backdropFilter: 'blur(16px)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  zIndex: 9999,
                }}
                onClick={() => setSelectedImgIdx(null)}
              >
                {/* Top Controls */}
                <div style={{
                  position: 'absolute', top: '1.5rem', left: '1.5rem', right: '1.5rem',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  color: 'white', zIndex: 10000
                }}>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.85rem', fontWeight: '500', opacity: 0.7, letterSpacing: '0.05em' }}>
                    {String(selectedImgIdx + 1).padStart(2, '0')} / {String(galleryImages.length).padStart(2, '0')}
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setSelectedImgIdx(null); }}
                    style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', color: 'white', cursor: 'pointer', borderRadius: '50%', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', flexShrink: 0 }}
                    onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Prev Arrow */}
                <button
                  onClick={(e) => { e.stopPropagation(); prevImg(); }}
                  style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: 'white', cursor: 'pointer', borderRadius: '50%', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', zIndex: 10000 }}
                  onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                ><ChevronLeft size={22} /></button>

                {/* Next Arrow */}
                <button
                  onClick={(e) => { e.stopPropagation(); nextImg(); }}
                  style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: 'white', cursor: 'pointer', borderRadius: '50%', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', zIndex: 10000 }}
                  onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                ><ChevronRight size={22} /></button>

                {/* Image */}
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '5rem 5rem 8rem' }}>
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={selectedImgIdx}
                      initial={{ x: 30, opacity: 0, scale: 0.97 }}
                      animate={{ x: 0, opacity: 1, scale: 1 }}
                      exit={{ x: -30, opacity: 0, scale: 0.97 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      src={galleryImages[selectedImgIdx]}
                      style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', borderRadius: '12px', boxShadow: '0 30px 80px rgba(0,0,0,0.6)' }}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </AnimatePresence>
                </div>

                {/* Thumbnail Strip */}
                <div
                  style={{
                    position: 'absolute', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)',
                    display: 'flex', gap: '0.6rem', padding: '0.6rem',
                    background: 'rgba(255,255,255,0.06)', borderRadius: '16px',
                    backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)',
                    zIndex: 10000, maxWidth: '80vw', overflowX: 'auto'
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {galleryImages.map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedImgIdx(idx)}
                      style={{
                        width: '46px', height: '46px', borderRadius: '8px', overflow: 'hidden',
                        cursor: 'pointer', flexShrink: 0,
                        border: selectedImgIdx === idx ? '2px solid white' : '2px solid transparent',
                        opacity: selectedImgIdx === idx ? 1 : 0.45,
                        transition: 'all 0.2s'
                      }}
                    >
                      <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ))}
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
