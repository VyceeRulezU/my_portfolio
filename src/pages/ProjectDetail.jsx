import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getAssetUrl } from '../utils/assetHelper';
import { ALL_PROJECTS } from '../data/projectsData';
import { ChevronLeft, ChevronRight, X, ArrowLeft, Lock, Mail, Trash2 } from 'lucide-react';
import { PortableText } from '@portabletext/react';
import { client, urlFor, deleteProject } from '../utils/sanity';

const GATED_EMAIL = "ironaliv@gmail.com";


const GALLERY_API = import.meta.env.VITE_GALLERY_API_URL;

const SECTIONS = [
  { id: 'snapshot', label: 'Project Snapshot' },
  { id: 'overview', label: 'Project Overview', subtitle: 'Context & Brief' },
  { id: 'problem', label: 'The Problem', subtitle: 'Problem Space' },
  { id: 'solution', label: 'The Solution', subtitle: 'Design Approach' },
  { id: 'impact', label: 'Results & Impact', subtitle: 'Outcomes & Impact' },
  { id: 'gallery', label: 'Process Gallery', subtitle: 'Process & Artifacts' }
];

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [activeSection, setActiveSection] = useState('');
  const [selectedImgIdx, setSelectedImgIdx] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [allProjects, setAllProjects] = useState([]);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [galleryLoading, setGalleryLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);


  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (project?.password && passwordInput === project.password) {
      setIsUnlocked(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  const handleDeleteProject = async () => {
    if (!project || !project._id) {
      alert('Cannot delete: Project ID not found');
      return;
    }

    setIsDeleting(true);
    try {
      await deleteProject(project._id);
      alert('Project deleted successfully!');
      navigate('/#projects', { replace: true });
    } catch (error) {
      console.error('Delete error:', error);
      alert(`Failed to delete project: ${error.message}`);
      setIsDeleting(false);
    }
  };

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
    const fetchAllProjects = async () => {
      try {
        const data = await client.fetch(`*[_type == "project"] | order(num asc)`);
        const formatted = data.map(p => ({
          ...p,
          id: p.slug?.current || p._id,
          img: p.img?.asset ? urlFor(p.img).url() : p.img,
        }));
        
        // Merge with local fallback
        const merged = [...formatted];
        ALL_PROJECTS.forEach(local => {
          if (!merged.find(p => p.id === local.id)) {
            merged.push(local);
          }
        });
        setAllProjects(merged);
      } catch (err) {
        console.error('Fetch all projects error:', err);
      }
    };
    fetchAllProjects();
  }, []);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const sanityData = await client.fetch(`*[_type == "project" && slug.current == $slug][0]`, { slug: id });
        console.log("Sanity Project Data:", sanityData);
        
        if (sanityData) {
          const formatted = {
            ...sanityData,
            id: sanityData.slug.current,
            isPrivate: sanityData.isPrivate || false,
            password: sanityData.password || null,
            img: sanityData.img?.asset ? urlFor(sanityData.img).url() : null,
            processImages: sanityData.processImages?.filter(img => img?.asset).map(img => urlFor(img).url()) || [],
            problemImages: sanityData.problemImages?.filter(img => img?.asset).map(img => urlFor(img).url()) || [],
            solutionImages: sanityData.solutionImages?.filter(img => img?.asset).map(img => urlFor(img).url()) || [],
            overviewImages: sanityData.overviewImages?.filter(img => img?.asset).map(img => urlFor(img).url()) || [],
            impactImages: sanityData.impactImages?.filter(img => img?.asset).map(img => urlFor(img).url()) || []
          };
          setProject(formatted);
          setGalleryImages(formatted.processImages);
          setGalleryLoading(false);
          return;
        }

      } catch (err) {
        console.error('Sanity detail fetch error:', err);
      }
      // 2. Fallback to local
      const found = ALL_PROJECTS.find(p => p.id === id);
      if (found) {
        // Force salongrid to be private if it's falling back to local
        if (id === 'salongrid') {
          found.isPrivate = true;
          found.password = "victor"; // Default fallback password
        }
        setProject(found);
      }

      
      if (id && GALLERY_API) {
        setGalleryLoading(true);
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
    };

    fetchProject();
    window.scrollTo(0, 0);
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

  useEffect(() => {
    if (!project || (project.isPrivate && !isUnlocked)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -60% 0px' }
    );

    const timeoutId = setTimeout(() => {
      SECTIONS.forEach((sec) => {
        const el = document.getElementById(sec.id);
        if (el) observer.observe(el);
      });
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [project, isUnlocked]);

  if (!project) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)' }}>
      Project not found. <Link to="/" style={{ color: 'var(--text-primary)', marginLeft: '1rem' }}>Back home</Link>
    </div>
  );

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
        .section-images { display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 1.5rem; margin-top: 3rem; }
        .section-image-card { border-radius: 24px; overflow: hidden; background: var(--bg-secondary); border: 1px solid var(--border-color); }
        .section-image-card img { width: 100%; height: auto; display: block; }
        
        .project-header { display: flex; justify-content: space-between; align-items: flex-end; gap: 2rem; margin-bottom: 6rem; flex-wrap: wrap; }
        .live-btn { background: var(--text-primary); color: var(--bg-primary); padding: 1rem 2rem; border-radius: 99px; text-decoration: none; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; transition: all 0.3s; }
        .live-btn:hover { opacity: 0.9; transform: translateY(-3px); box-shadow: 0 10px 30px rgba(0,0,0,0.1); }

        .snapshot-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2.5rem; padding: 3rem 0; border-top: 1px solid var(--border-color); border-bottom: 1px solid var(--border-color); margin-bottom: 6rem; }
        
        .back-to-work-link { display: inline-flex; align-items: center; gap: 0.5rem; color: var(--text-tertiary); font-size: 0.65rem; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; text-decoration: none; transition: color 0.3s ease; }
        .back-to-work-link:hover { color: var(--text-primary); }

        .section-text-content ul { list-style-type: disc; margin-left: 1.5rem; margin-bottom: 1.5rem; }
        .section-text-content ol { list-style-type: decimal; margin-left: 1.5rem; margin-bottom: 1.5rem; }
        .section-text-content li { margin-bottom: 0.5rem; }

        .other-works-section { margin-top: 15rem; padding-top: 8rem; border-top: 1px solid var(--border-color); }
        .other-works-header { display: flex; justify-content: space-between; align-items: center; marginBottom: 5rem; margin-bottom: 4rem; }
        .other-works-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2.5rem; }
        .work-card { text-decoration: none; color: inherit; group: hover; }
        .work-card-img { width: 100%; aspect-ratio: 16/10; border-radius: 20px; overflow: hidden; background: var(--bg-secondary); margin-bottom: 1.5rem; border: 1px solid var(--border-color); }
        .work-card-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
        .work-card:hover .work-card-img img { transform: scale(1.05); }
        .work-card-tag { color: #ff3e3e; font-size: 0.65rem; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 0.5rem; display: block; }
        .work-card-title { font-size: 1.5rem; font-weight: 600; font-family: 'Space Grotesk', sans-serif; display: flex; justify-content: space-between; align-items: center; }
        .work-card-arrow { width: 32px; height: 32px; border-radius: 50%; border: 1px solid var(--border-color); display: flex; alignItems: center; justify-content: center; opacity: 0.3; transition: all 0.3s; }
        .work-card:hover .work-card-arrow { opacity: 1; background: var(--text-primary); color: var(--bg-primary); transform: rotate(-45deg); }

        @media (max-width: 1024px) {
          .other-works-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
          .other-works-grid { grid-template-columns: 1fr; }
          .other-works-section { margin-top: 10rem; }
        }

        @media (max-width: 1200px) {
          .case-study-layout { flex-direction: column; gap: 4rem; }
          .case-study-sidebar { display: none; }
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
                 {project.headline}
              </motion.h1>
           </div>
           
           <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
             {project.url && project.url !== "#" && (
               <motion.a 
                 href={project.url} target="_blank" rel="noopener noreferrer" className="live-btn"
                 initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}
               >
                  View Live Project ↗
               </motion.a>
             )}
             <motion.button
               onClick={() => setShowDeleteModal(true)}
               initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}
               style={{
                 background: 'transparent',
                 border: '1px solid var(--border-color)',
                 color: 'var(--text-tertiary)',
                 padding: '1rem 1.5rem',
                 borderRadius: '99px',
                 cursor: 'pointer',
                 fontSize: '0.7rem',
                 fontWeight: '700',
                 letterSpacing: '0.1em',
                 textTransform: 'uppercase',
                 display: 'flex',
                 alignItems: 'center',
                 gap: '0.5rem',
                 transition: 'all 0.3s',
               }}
               onMouseEnter={(e) => {
                 e.target.style.borderColor = '#ff3e3e';
                 e.target.style.color = '#ff3e3e';
               }}
               onMouseLeave={(e) => {
                 e.target.style.borderColor = 'var(--border-color)';
                 e.target.style.color = 'var(--text-tertiary)';
               }}
             >
               <Trash2 size={16} /> Delete
             </motion.button>
           </div>
        </div>


        {/* Gated Access Lock Screen */}
        {project.isPrivate && !isUnlocked ? (
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
              
              {project.password && (
                <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
                  <input 
                    type="password" 
                    placeholder="Enter Password" 
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    style={{ 
                      background: 'var(--bg-primary)', border: `1px solid ${passwordError ? '#ff4d4d' : 'var(--border-color)'}`, 
                      padding: '0 1.5rem', borderRadius: '99px', fontSize: '0.8rem', color: 'var(--text-primary)', outline: 'none'
                    }}
                  />
                  <button type="submit" className="live-btn" style={{ background: 'var(--text-secondary)' }}>Unlock</button>
                </form>
              )}
            </div>
            {passwordError && <div style={{ color: '#ff4d4d', fontSize: '0.7rem', marginTop: '1rem', fontWeight: '600' }}>Incorrect password. Please try again.</div>}
          </motion.div>
        ) : (
          <>
            {/* Hero Image */}
            <div style={{ width: '100%', marginBottom: '10rem', borderRadius: '32px', overflow: 'hidden', background: 'var(--border-color)' }}>
               <img src={getAssetUrl(project.img)} alt={project.title} style={{ width: '100%', height: 'auto', display: 'block' }} />
            </div>

        <div className="case-study-layout">
          {/* Main Content */}
          <div className="case-study-content">
            {SECTIONS.map((sec) => {
              if (sec.id === 'snapshot') return (
                <div key={sec.id} id={sec.id} className="snapshot-grid">
                  <div>
                    <div style={{ fontSize: '0.6rem', fontWeight: '700', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.1em' }}>ROLE</div>
                    <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{project.role}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.6rem', fontWeight: '700', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.1em' }}>YEAR</div>
                    <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{project.year}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.6rem', fontWeight: '700', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.1em' }}>TYPE</div>
                    <div style={{ fontWeight: '600', fontSize: '0.9rem', textTransform: 'capitalize' }}>{project.type === 'case' ? 'Case Study' : project.type}</div>
                  </div>
                </div>
              );

              const content = project[sec.id];
              const images = project[`${sec.id}Images`];
              
              if (sec.id === 'gallery') return (
                <div key={sec.id} id={sec.id} className="section-block">
                  <h2 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '1rem', fontFamily: "'Space Grotesk', sans-serif" }}>{sec.label}</h2>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginBottom: '3rem', letterSpacing: '0.05em' }}>{sec.subtitle}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {galleryImages.map((img, idx) => (
                      <motion.div key={idx} whileHover={{ scale: 1.02 }} onClick={() => setSelectedImgIdx(idx)} style={{ borderRadius: '16px', overflow: 'hidden', cursor: 'pointer', aspectRatio: '16/9', background: 'var(--bg-secondary)' }}>
                        <img src={img} alt={`Process ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </motion.div>
                    ))}
                  </div>
                </div>
              );

              return (
                <div key={sec.id} id={sec.id} className="section-block">
                  <h2 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '1rem', fontFamily: "'Space Grotesk', sans-serif" }}>{sec.label}</h2>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginBottom: '2.5rem', letterSpacing: '0.05em' }}>{sec.subtitle}</div>
                  
                  <div className="section-text-content" style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', lineHeight: '1.8', maxWidth: '900px' }}>
                    {Array.isArray(content) ? (
                      <PortableText value={content} />
                    ) : (
                      <p>{content}</p>
                    )}
                  </div>
                  
                  {images && images.length > 0 && (
                    <div className="section-images">
                      {images.map((img, idx) => (
                        <div key={idx} className="section-image-card">
                          <img src={img} alt={`${sec.label} image ${idx + 1}`} />
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
            <div className="sticky-toc">
              <div style={{ fontSize: '0.6rem', fontWeight: '800', color: 'var(--text-tertiary)', letterSpacing: '0.2em', marginBottom: '1.5rem' }}>CONTENTS</div>
              {SECTIONS.map(sec => (
                <a key={sec.id} href={`#${sec.id}`} className={`toc-link ${activeSection === sec.id ? 'active' : ''}`}>
                  <span className="toc-label">{sec.label}</span>
                  {sec.subtitle && <span className="toc-subtitle">{sec.subtitle}</span>}
                </a>
              ))}
            </div>
          </aside>
          </div>
        </>
      )}


        {/* View Other Works Section */}
        <section className="other-works-section">
          <div className="other-works-header">
            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: '700', fontFamily: "'Space Grotesk', sans-serif" }}>View other works</h2>
            <Link to="/#projects" className="live-btn" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', fontSize: '0.6rem' }}>
              Goto works
            </Link>
          </div>

          <div className="other-works-grid">
            {allProjects
              .filter(p => p.id !== id)
              .slice(0, 3)
              .map((p, idx) => (
                <motion.div key={p.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
                  <Link to={`/work/${p.id}`} className="work-card">
                    <div className="work-card-img">
                      <img src={getAssetUrl(p.img)} alt={p.title} />
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



        {/* Lightbox - keeping existing functionality */}
        {createPortal(
          <AnimatePresence>
            {selectedImgIdx !== null && galleryImages.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0, 0, 0, 0.88)', backdropFilter: 'blur(16px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}
                onClick={() => setSelectedImgIdx(null)}
              >
                <button onClick={(e) => { e.stopPropagation(); setSelectedImgIdx(null); }} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: '50%', width: '44px', height: '44px', cursor: 'pointer' }}><X size={18} /></button>
                <img src={galleryImages[selectedImgIdx]} style={{ maxHeight: '85%', maxWidth: '85%', objectFit: 'contain', borderRadius: '12px' }} />
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}

        {/* Delete Confirmation Modal */}
        {createPortal(
          <AnimatePresence>
            {showDeleteModal && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9998 }}
                onClick={() => !isDeleting && setShowDeleteModal(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                  style={{ background: 'var(--bg-secondary)', borderRadius: '24px', border: '1px solid var(--border-color)', padding: '2.5rem', maxWidth: '500px', width: '90%', textAlign: 'center' }}
                >
                  <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(255, 62, 62, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', border: '1px solid rgba(255, 62, 62, 0.3)' }}>
                    <Trash2 size={28} color="#ff3e3e" />
                  </div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', fontFamily: "'Space Grotesk', sans-serif" }}>Delete Project?</h3>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem', fontSize: '0.95rem' }}>
                    Are you sure you want to delete <strong>{project?.title}</strong>? This action cannot be undone.
                  </p>
                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <button
                      onClick={() => setShowDeleteModal(false)}
                      disabled={isDeleting}
                      style={{
                        padding: '0.75rem 1.5rem',
                        borderRadius: '99px',
                        border: '1px solid var(--border-color)',
                        background: 'transparent',
                        color: 'var(--text-primary)',
                        cursor: isDeleting ? 'not-allowed' : 'pointer',
                        fontSize: '0.7rem',
                        fontWeight: '700',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        transition: 'all 0.3s',
                        opacity: isDeleting ? 0.5 : 1,
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteProject}
                      disabled={isDeleting}
                      style={{
                        padding: '0.75rem 1.5rem',
                        borderRadius: '99px',
                        border: 'none',
                        background: '#ff3e3e',
                        color: 'white',
                        cursor: isDeleting ? 'not-allowed' : 'pointer',
                        fontSize: '0.7rem',
                        fontWeight: '700',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        transition: 'all 0.3s',
                        opacity: isDeleting ? 0.7 : 1,
                      }}
                    >
                      {isDeleting ? 'Deleting...' : 'Delete Project'}
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
      </div>
    </section>
  );
}

