import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Copy } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [copied, setCopied] = useState(false);
  const email = "ironaliv@gmail.com";

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const openCalendly = () => {
    // Standard Calendly Popup
    if (window.Calendly) {
      window.Calendly.initPopupWidget({ url: 'https://calendly.com/ironali/45mins' });
    } else {
      window.open('https://calendly.com/ironali/45mins', '_blank');
    }
  };

  return (
    <footer id="contact" style={{ 
      position: 'relative',
      paddingTop: '10rem', 
      paddingBottom: '4rem',
      backgroundColor: 'var(--bg-primary)', 
      color: 'var(--text-primary)',
      overflow: 'hidden',
      borderTop: '1px solid var(--border-color)'
    }}>
      <div style={{ maxWidth: '1800px', margin: '0 auto', padding: '0 5vw', position: 'relative', zIndex: 10 }}>
        
        {/* Let's Connect */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
          <div style={{ width: '30px', height: '1px', backgroundColor: 'var(--text-tertiary)' }}></div>
          <div style={{ color: 'var(--text-tertiary)', fontSize: '0.7rem', fontWeight: '700', letterSpacing: '0.2rem', textTransform: 'uppercase' }}>
            GET IN TOUCH
          </div>
        </div>

        {/* Huge Heading */}
        <motion.h2 
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{ 
            fontSize: 'clamp(3.5rem, 9vw, 7.5rem)', 
            fontWeight: '700', 
            lineHeight: '0.9', 
            letterSpacing: '-0.05em',
            fontFamily: "'Space Grotesk', sans-serif",
            maxWidth: '100%',
            marginBottom: '3rem',
            wordBreak: 'break-word'
          }}
        >
          Let's build<br/>something great.
        </motion.h2>

        {/* Rephrased Blurb */}
        <p style={{ 
          maxWidth: '550px', 
          fontSize: '1.15rem', 
          color: 'var(--text-secondary)', 
          lineHeight: '1.7', 
          marginBottom: '5rem',
          fontWeight: '400'
        }}>
          Currently seeking new challenges where design meets high-performance engineering. 
          Expert in SaaS, Fintech, and complex digital ecosystems. Available for full-time roles or strategic partnerships.
        </p>

        {/* Email & Copy */}
        <div style={{ marginBottom: '4rem', display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <a href={`mailto:${email}`} style={{ 
            fontSize: 'clamp(1.8rem, 5vw, 3.5rem)',
            fontWeight: '700',
            fontFamily: "'Space Grotesk', sans-serif",
            color: 'var(--text-primary)',
            textDecoration: 'none',
            borderBottom: '2px solid var(--border-color)',
            paddingBottom: '0.2rem',
            transition: 'border-color 0.3s ease',
            wordBreak: 'break-all',
            maxWidth: '100%'
          }}
          onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--text-primary)'}
          onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}>
            {email}
          </a>
          
          <div style={{ position: 'relative' }}>
            <button 
              onClick={handleCopy}
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                borderRadius: '50%',
                width: '50px',
                height: '50px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--text-primary)'}
              onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
            >
              {copied ? <Check size={20} /> : <Copy size={20} />}
            </button>
            
            {/* Success Notification */}
            <AnimatePresence>
              {copied && (
                <motion.div
                  initial={{ opacity: 0, y: 10, x: '-50%' }}
                  animate={{ opacity: 1, y: 0, x: '-50%' }}
                  exit={{ opacity: 0, y: 5, x: '-50%' }}
                  style={{
                    position: 'absolute',
                    bottom: '70px',
                    left: '50%',
                    background: 'var(--text-primary)',
                    color: 'var(--bg-primary)',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    fontSize: '0.65rem',
                    fontWeight: '700',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                  }}
                >
                  EMAIL COPIED!
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '12rem', flexWrap: 'wrap' }}>
          <button 
            onClick={openCalendly}
            style={{
              background: 'var(--text-primary)',
              color: 'var(--bg-primary)',
              padding: '1.2rem 2.5rem',
              borderRadius: '999px',
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: '700',
              fontSize: '0.8rem',
              letterSpacing: '0.15em',
              border: 'none',
              cursor: 'pointer',
              transition: 'transform 0.2s ease',
              textTransform: 'uppercase'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            BOOK A CALL
          </button>
          
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginLeft: 'auto', flexWrap: 'wrap' }}>
            <a href="https://github.com/vyceerulezu" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.1em' }}>GITHUB</a>
            <a href="https://linkedin.com/in/ironali" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.1em' }}>LINKEDIN</a>
            <a href="https://www.behance.net/Ironali" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.1em' }}>BEHANCE</a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          color: 'var(--text-tertiary)',
          fontSize: '0.7rem',
          fontWeight: '700',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          borderTop: '1px solid var(--border-color)',
          paddingTop: '3rem',
          flexWrap: 'wrap',
          gap: '2.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
             <span style={{ color: 'var(--text-primary)', fontWeight: '800' }}>VI</span>
             <span>&copy; {currentYear} &bull; BUILT BY VICTOR IRONALI</span>
          </div>
          <div style={{ color: 'var(--text-tertiary)' }}>
             DUBLIN &bull; NIGERIA &bull; REMOTE
          </div>
        </div>

      </div>

      {/* Background Watermark text */}
      <div style={{
        position: 'absolute',
        bottom: '-3rem',
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: 'clamp(10rem, 25vw, 30rem)',
        fontWeight: '700',
        fontFamily: "'Space Grotesk', sans-serif",
        color: 'var(--text-primary)',
        opacity: 0.03,
        pointerEvents: 'none',
        whiteSpace: 'nowrap',
        zIndex: 1,
        lineHeight: 1
      }}>
        IRONALI
      </div>
    </footer>
  );
}
