import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, ExternalLink, Loader2 } from 'lucide-react';
import CVFile from '../assets/Victor Ironali (2).pdf';

export default function CVModal({ isOpen, onClose }) {
  const [isLoading, setIsLoading] = useState(true);
  const cvUrl = CVFile;

  // Prevent scroll when modal is open
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'unset';
      }
    }
  }, [isOpen]);

  // Reset loading state when modal opens
  useEffect(() => {
    if (isOpen) setIsLoading(true);
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem'
        }}>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0,0,0,0.85)',
              backdropFilter: 'blur(10px)',
              cursor: 'pointer'
            }}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '1200px',
              height: '92vh',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: '24px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              border: '1px solid var(--border-color)'
            }}
          >
            {/* Header */}
            <div style={{
              padding: '1.25rem 2rem',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: 'var(--bg-primary)',
              zIndex: 10
            }}>
              <div style={{ color: 'var(--text-primary)', fontWeight: '700', fontSize: '0.8rem', letterSpacing: '0.1em' }}>
                CURRICULUM VITAE
              </div>
              
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <a href={cvUrl} target="_blank" rel="noopener noreferrer" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'transparent',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-color)',
                  padding: '0.5rem 1rem',
                  borderRadius: '999px',
                  fontSize: '0.7rem',
                  fontWeight: '700',
                  textDecoration: 'none',
                  textTransform: 'uppercase'
                }}>
                  <ExternalLink size={14} /> NEW TAB
                </a>

                <a href={cvUrl} download style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'var(--text-primary)',
                  color: 'var(--bg-primary)',
                  padding: '0.5rem 1.25rem',
                  borderRadius: '999px',
                  fontSize: '0.7rem',
                  fontWeight: '700',
                  textDecoration: 'none',
                  textTransform: 'uppercase'
                }}>
                  <Download size={14} /> DOWNLOAD
                </a>
                
                <button 
                  onClick={onClose}
                  style={{
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    marginLeft: '0.5rem'
                  }}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Native Iframe Viewer */}
            <div style={{ 
              flex: 1, 
              position: 'relative',
              backgroundColor: '#1a1a1a',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              {isLoading && (
                <div style={{ 
                  position: 'absolute', 
                  top: 0, left: 0, right: 0, bottom: 0,
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center', 
                  justifyContent: 'center',
                  gap: '1rem',
                  color: '#fff',
                  zIndex: 5
                }}>
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                    <Loader2 size={32} />
                  </motion.div>
                  <p style={{ fontSize: '0.75rem', fontWeight: '600', opacity: 0.7, letterSpacing: '0.1em' }}>INITIALIZING PREVIEW...</p>
                </div>
              )}
              
              <iframe
                src={`${cvUrl}#toolbar=1&navpanes=0&scrollbar=1`}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  zIndex: 2,
                  opacity: isLoading ? 0 : 1,
                  transition: 'opacity 0.3s ease'
                }}
                onLoad={() => setIsLoading(false)}
                title="Victor Ironali CV"
              />
              
              {/* Fallback for very restrictive mobile browsers */}
              <div style={{
                position: 'absolute',
                zIndex: 1,
                padding: '2rem',
                textAlign: 'center',
                color: 'var(--text-secondary)',
                fontSize: '0.9rem'
              }}>
                <p>If the preview is blank, please browse the file on a desktop or download the PDF below.</p>
                <a href={cvUrl} download style={{ color: 'var(--text-primary)', fontWeight: '700', textDecoration: 'underline' }}>Download CV</a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
