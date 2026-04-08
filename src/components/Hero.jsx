import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getAssetUrl } from '../utils/assetHelper';
import ProfileImage from '../assets/hero.png';
import Ironali2 from '../assets/ironali-2.png';

// Helper for letter-by-letter scroll animation
const AnimatedLetter = ({ char, index, scrollYProgress }) => {
  // Staggered range for each character:
  // Each letter starts its animation slightly later than the previous one
  const start = index * 0.01;
  const end = start + 0.3;
  
  const opacity = useTransform(scrollYProgress, [start, end], [1, 0]);
  const rotateX = useTransform(scrollYProgress, [start, end], [0, -45]);
  const skewX = useTransform(scrollYProgress, [start, end], [0, -15]);
  const y = useTransform(scrollYProgress, [start, end], [0, -40]);

  return (
    <motion.span
      style={{
        display: 'inline-block',
        opacity,
        rotateX,
        skewX,
        y,
        transformOrigin: 'top',
        whiteSpace: char === ' ' ? 'pre' : 'normal'
      }}
    >
      {char}
    </motion.span>
  );
};

export default function Hero({ openCV }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const localProfileImg = ProfileImage; // Left image
  const r2Image = Ironali2; // Right image (93KB optimized)

  const renderSplitText = (text, startIdx = 0) => {
    return text.split('').map((char, i) => (
      <AnimatedLetter 
        key={`${char}-${startIdx + i}`} 
        char={char} 
        index={startIdx + i} 
        scrollYProgress={scrollYProgress} 
      />
    ));
  };

  return (
    <section id="about" ref={containerRef} style={{ 
      position: 'relative',
      minHeight: '100vh', 
      width: '100%',
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'flex-end', // Aligned content to bottom
      paddingTop: '8rem',
      paddingBottom: '4rem', // Requested spacing from bottom
      paddingLeft: '5vw',
      paddingRight: '5vw',
      overflow: 'hidden'
    }}>
      {/* Background Split Images */}
      <div className="hero-background-split" style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        display: 'flex',
        zIndex: 0,
        pointerEvents: 'none'
      }}>
        {/* Left Image (Local Profile) - Hidden on mobile */}
        <div className="hero-left-img" style={{ position: 'relative', width: '50%', height: '100%' }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(to right, var(--bg-primary) 0%, transparent 20%, transparent 80%, var(--bg-primary) 100%)',
            zIndex: 1
          }} />
          <img
            src={localProfileImg}
            alt="Victor Ironali Left"
            loading="eager"
            fetchpriority="high"
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.08, willChange: 'transform' }}
          />
        </div>
        
        {/* Right Image (Optimized Ironali) - Full width on mobile */}
        <div className="hero-right-img" style={{ position: 'relative', width: '50%', height: '100%' }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(to right, var(--bg-primary) 0%, transparent 20%, transparent 80%, var(--bg-primary) 100%)',
            zIndex: 1
          }} />
          <img
            src={r2Image}
            alt="Victor Ironali Right"
            loading="eager"
            fetchpriority="high"
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.15, willChange: 'transform' }}
          />
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hero-left-img {
            display: none !important;
          }
          .hero-right-img {
            width: 100% !important;
          }
          #about {
            justify-content: flex-end !important;
            padding-bottom: 4rem !important;
          }
        }
      `}</style>
      
      {/* Content Container */}
      <div style={{ 
        position: 'relative', 
        zIndex: 10, 
        maxWidth: '1800px', 
        margin: '0 auto', 
        width: '100%', 
        marginBottom: '4rem',
        perspective: '1000px' // Enable 3D space
      }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
             <a 
               href="#projects" 
               style={{ 
                 display: 'inline-flex',
                 alignItems: 'center',
                 justifyContent: 'center',
                 background: 'var(--text-primary)', 
                 color: 'var(--bg-primary)', 
                 border: '1px solid var(--text-primary)', 
                 borderRadius: '999px', 
                 padding: '0.7rem 1.8rem', 
                 fontSize: '0.75rem', 
                 fontWeight: 700, 
                 letterSpacing: '0.1em', 
                 textTransform: 'uppercase',
                 textDecoration: 'none',
                 fontFamily: "'Space Grotesk', sans-serif",
                 transition: 'all 0.2s ease'
               }}
               onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
               onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
             >
                 VIEW PROJECTS
             </a>
             <button 
               onClick={openCV} 
               style={{ 
                 display: 'inline-flex',
                 alignItems: 'center',
                 justifyContent: 'center',
                 background: 'transparent', 
                 color: 'var(--text-primary)', 
                 border: '1px solid var(--border-color)', 
                 borderRadius: '999px', 
                 padding: '0.7rem 1.8rem', 
                 fontSize: '0.75rem', 
                 fontWeight: 700, 
                 letterSpacing: '0.1em', 
                 textTransform: 'uppercase',
                 textDecoration: 'none',
                 fontFamily: "'Space Grotesk', sans-serif",
                 transition: 'all 0.2s ease',
                 backdropFilter: 'blur(10px)',
                 cursor: 'pointer'
               }}
               onMouseOver={(e) => { e.currentTarget.style.background = 'var(--text-primary)'; e.currentTarget.style.color = 'var(--bg-primary)'; }}
               onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-primary)'; }}
             >
                 VIEW CV
             </button>
          </div>

          {/* Subtitle location / intro */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ width: '40px', height: '1px', backgroundColor: 'var(--text-tertiary)' }}></div>
            <p style={{ 
              margin: 0, 
              fontSize: '0.7rem', 
              fontWeight: '700', 
              letterSpacing: '0.2em', 
              textTransform: 'uppercase', 
              color: 'var(--text-secondary)' 
            }}>
              VICTOR IRONALI &bull; DUBLIN, IRELAND
            </p>
          </div>

          {/* Main Huge Typography */}
          <motion.h1 
            style={{ 
              margin: 0, 
              fontSize: 'clamp(2.5rem, 8vw, 7rem)', 
              fontWeight: '700', 
              lineHeight: '1.1', 
              letterSpacing: '-0.001em',
              textTransform: 'uppercase',
              fontFamily: "'Space Grotesk', sans-serif",
              wordBreak: 'break-word',
              maxWidth: '100%',
            }}
          >
            <div style={{ display: 'block' }}>
              {renderSplitText("SENIOR")}
            </div>
            <div style={{ display: 'block' }}>
              {renderSplitText("PRODUCT DESIGNER", 7)}
            </div>
            <div style={{ display: 'block', fontSize: '0.9em', opacity: 0.8 }}>
              {renderSplitText("& UX ENGINEER", 24)}
            </div>
          </motion.h1>

          {/* Paragraph content */}
          <p style={{ 
            marginTop: '3rem', 
            maxWidth: '650px', 
            fontSize: '1.1rem', 
            color: 'var(--text-secondary)', 
            lineHeight: '1.8',
            fontWeight: '400'
          }}>
            I design and build intuitive digital experiences with 6+ years in SaaS, fintech, and EdTech. 
            Currently shaping the future of recruitment at Jobin.cloud.
          </p>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', color: 'var(--text-tertiary)', fontSize: '0.65rem', fontWeight: '700', letterSpacing: '0.2rem' }}
      >
        SCROLL &darr;
      </motion.div>
    </section>
  );
}
