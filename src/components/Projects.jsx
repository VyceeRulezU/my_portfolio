import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getAssetUrl } from '../utils/assetHelper';
import { ALL_PROJECTS } from '../data/projectsData';

const TABS = [
  { id: 'all', label: 'All Projects' },
  { id: 'live', label: 'Live Projects' },
  { id: 'case', label: 'Case Studies' },
  { id: 'other', label: 'Other Work' }
];

export default function Projects() {
  const [activeTab, setActiveTab] = useState('all');

  const filteredProjects = activeTab === 'all' 
    ? ALL_PROJECTS 
    : ALL_PROJECTS.filter(p => p.type === activeTab);

  return (
    <section id="projects" style={{ 
      paddingTop: '8rem', 
      paddingBottom: '8rem',
      color: 'var(--text-primary)'
    }}>
      <style>{`
        .projects-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }
        @media (max-width: 1024px) {
          .projects-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 768px) {
          .projects-grid {
            grid-template-columns: 1fr;
          }
        }
        .tab-btn {
          background: transparent;
          border: none;
          color: var(--text-tertiary);
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          padding: 0.5rem 1rem;
          position: relative;
          transition: color 0.2s;
        }
        .tab-btn.active {
          color: var(--text-primary);
        }
        .tab-underline {
          position: absolute;
          bottom: 0;
          left: 1rem;
          right: 1rem;
          height: 2px;
          background: var(--text-primary);
        }
      `}</style>
      
      <div style={{ maxWidth: '1800px', margin: '0 auto', padding: '0 5vw' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '5rem',
          flexWrap: 'wrap',
          gap: '2rem'
        }}>
          <div>
            <div style={{ color: 'var(--text-tertiary)', fontSize: '0.65rem', fontWeight: '700', letterSpacing: '0.2rem', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
               / SELECTED WORK
            </div>
            <motion.h2 
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              style={{ 
                fontSize: 'clamp(3.5rem, 8vw, 6.5rem)', 
                fontWeight: '700', 
                lineHeight: '0.9', 
                letterSpacing: '-0.04em',
                fontFamily: "'Space Grotesk', sans-serif"
              }}
            >
              Case<br/>Studies
            </motion.h2>
          </div>

          {/* Tabs Filter — horizontally scrollable on mobile */}
          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
            <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-line)', paddingBottom: '0.5rem', minWidth: 'max-content' }}>
               {TABS.map(tab => (
                 <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                 >
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div layoutId="tab-underline" className="tab-underline" />
                  )}
                 </button>
               ))}
            </div>
          </div>
        </div>

        <motion.div layout className="projects-grid">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, idx) => (
              <motion.div 
                key={project.id}
                layout
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, delay: idx * 0.15, ease: "easeOut" }}
                style={{ display: 'flex', flexDirection: 'column' }}
              >
                <Link to={`/work/${project.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  {/* Image Container */}
                  <div style={{
                    width: '100%',
                    aspectRatio: '5/4',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    marginBottom: '1.5rem',
                    backgroundColor: 'var(--border-color)',
                  }}>
                    <motion.img 
                      whileHover={{ scale: 1.03 }}
                      transition={{ duration: 0.4 }}
                      src={getAssetUrl(project.img)} 
                      alt={project.title}
                      loading="lazy"
                      decoding="async"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                </Link>

                {/* Top metadata */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  color: 'var(--text-tertiary)', 
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  marginBottom: '0.5rem'
                }}>
                  <span>{project.num}</span>
                  <span>{project.year}</span>
                </div>

                {/* Title & Role */}
                <h3 style={{ 
                  fontSize: '2rem', 
                  marginBottom: '0.25rem', 
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: '700',
                  letterSpacing: '-0.02em',
                  lineHeight: '1.1'
                }}>
                  {project.title}
                </h3>
                <div style={{ 
                  color: 'var(--text-secondary)', 
                  fontSize: '0.6rem', 
                  fontWeight: '600', 
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  marginBottom: '1rem'
                }}>
                  {project.role}
                </div>

                {/* Description */}
                <p style={{ 
                  margin: '0 0 1.5rem 0', 
                  fontSize: '0.95rem', 
                  lineHeight: '1.6', 
                  color: 'var(--text-secondary)',
                  fontWeight: '400'
                }}>
                  {project.desc}
                </p>

                <div style={{ display: 'flex', gap: '1.5rem', marginTop: 'auto', alignItems: 'center', flexWrap: 'wrap' }}>
                  <Link to={`/work/${project.id}`} style={{
                    color: 'var(--text-primary)',
                    textDecoration: 'none',
                    fontSize: '0.65rem',
                    fontWeight: '700',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase'
                  }}>
                    View Case Study
                  </Link>
                  {project.url && project.url !== '#' && (
                    <a href={project.url} target="_blank" rel="noopener noreferrer" style={{
                      color: 'var(--text-tertiary)',
                      textDecoration: 'none',
                      fontSize: '0.65rem',
                      fontWeight: '700',
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      transition: 'color 0.2s',
                      borderBottom: '1px solid transparent'
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderBottom = '1px solid var(--text-primary)'; }}
                    onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-tertiary)'; e.currentTarget.style.borderBottom = '1px solid transparent'; }}
                    >
                      {project.type === 'case' || project.type === 'other' ? 'View Prototype ↗' : 'Visit Site ↗'}
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
