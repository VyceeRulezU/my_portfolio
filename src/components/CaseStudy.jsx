import { motion } from 'framer-motion';

export default function CaseStudy() {
  return (
    <section style={{ paddingTop: '10rem', paddingBottom: '8rem', color: 'var(--text-primary)' }}>
      <div style={{ maxWidth: '1800px', margin: '0 auto', padding: '0 5vw' }}>
        
        {/* Intro */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '8rem' }}>
          <div style={{ color: 'var(--text-tertiary)', fontSize: '0.65rem', fontWeight: '700', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            / HOME / CASE STUDY / CRAFTBIT PRO
          </div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ 
              fontSize: 'clamp(3.5rem, 7vw, 6.5rem)', 
              fontWeight: '700', 
              lineHeight: '0.95', 
              letterSpacing: '-0.04em',
              fontFamily: "'Space Grotesk', sans-serif"
            }}
          >
            Crafting a robust<br/>design language.
          </motion.h1>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginTop: '3rem', borderTop: '1px solid var(--border-color)', paddingTop: '2rem' }}>
            <div>
               <div style={{ color: 'var(--text-tertiary)', fontSize: '0.65rem', fontWeight: '700', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>ROLE</div>
               <div style={{ fontWeight: '500' }}>UI/UX DESIGN &bull; DESIGN SYSTEMS</div>
            </div>
            <div>
               <div style={{ color: 'var(--text-tertiary)', fontSize: '0.65rem', fontWeight: '700', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>TIMELINE</div>
               <div style={{ fontWeight: '500' }}>3 MONTHS</div>
            </div>
            <div>
               <div style={{ color: 'var(--text-tertiary)', fontSize: '0.65rem', fontWeight: '700', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>IMPACT</div>
               <div style={{ fontWeight: '500' }}>40% FASTER DESIGN TO DEV</div>
            </div>
          </div>
        </div>

        {/* Hero Image */}
        <div style={{ 
          width: '100%', 
          aspectRatio: '16/9', 
          backgroundColor: 'var(--border-color)',
          borderRadius: '24px',
          overflow: 'hidden',
          marginBottom: '8rem'
        }}>
           <img 
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop" 
              alt="Craftbit Pro Hero" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
           />
        </div>

      </div>
    </section>
  );
}
