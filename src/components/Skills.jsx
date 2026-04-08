import { motion } from 'framer-motion';

const COMPETENCIES = [
  { title: "Product Design", tags: "Figma - Design Systems - User Research" },
  { title: "UX Engineering", tags: "React - Framer Motion - Prototyping - Git - HTML - CSS - JavaScript" },
  { title: "Design Systems", tags: "Component Libraries - Documentation" },
  { title: "Web UX", tags: "Responsive Design - Accessibility - SEO" },
  { title: "No-Code / Low-Code", tags: "Webflow - WordPress - Framer - Odoo - Bubble - Shopify - Vibe-Coding" },
  { title: "Product Strategy", tags: "User Journeys - Information Architecture - AI Integration" }
];

export default function Skills() {
  return (
    <section id="skills" style={{ 
      paddingTop: '8rem', 
      paddingBottom: '8rem',
      backgroundColor: 'var(--bg-secondary)', // Give it a slight background pop to stand out
      color: 'var(--text-primary)'
    }}>
      <style>{`
        .competencies-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          overflow: hidden;
        }
        .comp-item {
          padding: 3rem 2rem;
          border-right: 1px solid var(--border-color);
          border-bottom: 1px solid var(--border-color);
          background: var(--bg-primary); /* Stand out from the secondary bg */
        }
        /* Remove inner right borders for every 3rd element */
        .comp-item:nth-child(3n) {
          border-right: none;
        }
        /* Remove bottom border for the last row */
        .comp-item:nth-child(n+4) {
          border-bottom: none;
        }

        @media (max-width: 1024px) {
          .competencies-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .comp-item:nth-child(3n) {
            border-right: 1px solid var(--border-color);
          }
          .comp-item:nth-child(2n) {
            border-right: none;
          }
          .comp-item:nth-child(n+4) {
            border-bottom: 1px solid var(--border-color);
          }
          .comp-item:nth-child(n+5) {
            border-bottom: none;
          }
        }

        @media (max-width: 768px) {
          .competencies-grid {
            grid-template-columns: 1fr;
          }
          .comp-item {
            border-right: none !important;
            border-bottom: 1px solid var(--border-color);
          }
          .comp-item:last-child {
            border-bottom: none;
          }
        }
      `}</style>

      <div style={{ maxWidth: '1800px', margin: '0 auto', padding: '0 5vw' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            color: 'var(--text-tertiary)',
            fontSize: '0.65rem',
            fontWeight: '700',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            marginBottom: '3rem'
          }}
        >
          KEY COMPETENCIES
        </motion.div>

        <motion.div 
          className="competencies-grid"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {COMPETENCIES.map((comp, idx) => (
            <div key={idx} className="comp-item">
              <h3 style={{ 
                fontSize: '1.25rem', 
                marginBottom: '1rem', 
                fontFamily: "'Inter', sans-serif",
                fontWeight: '700',
                letterSpacing: '-0.01em'
              }}>
                {comp.title}
              </h3>
              <div style={{ 
                color: 'var(--text-tertiary)', 
                fontSize: '0.75rem', 
                fontWeight: '600', 
                letterSpacing: '0.05em' 
              }}>
                {comp.tags}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
