import { motion } from 'framer-motion';

const EXPERIENCES = [
  {
    num: "01",
    company: "Jobin.cloud",
    role: "Lead UX / Product Designer",
    period: "JAN 2024 \u2014 PRESENT",
    desc: "Drove a 25% increase in user activation by leading the end-to-end redesign of the core SaaS dashboard \u2014 validated through stakeholder feedback and iterative usability testing. Architected a design system of 5,000+ components in Figma, significantly cutting design iteration time and established a single source of truth across design and engineering.",
    pills: ["25% ACTIVATION BI", "5K+ COMPONENTS", "SAAS DASHBOARD"],
    tags: ["FIGMA", "REACT", "TAILWIND", "DESIGN SYSTEMS", "UX RESEARCH"],
    link: "JOBIN.CLOUD \u2192",
    url: "https://jobin.cloud"
  },
  {
    num: "02",
    company: "ERCAS",
    role: "Product Designer",
    period: "AUG 2015 \u2014 MAR 2024",
    desc: "Designed interfaces for ERCAS Pay, Collect, POS, and USSD payment platforms, serving over 10 million users across 7 Nigerian state governments. Led UX for enterprise onboarding and delivered WCAG-compliant front-end designs in close collaboration with developers, ensuring accessibility and scalability across all government-facing platforms.",
    pills: ["10M+ USERS", "PAYMENT SYSTEMS", "ENTERPRISE UX"],
    tags: ["UX DESIGN", "WCAG", "REACT", "E-SERVICES", "USSD"],
    link: "ERCAS.COM \u2192",
    url: "https://ercas.com"
  },
  {
    num: "03",
    company: "NaliTech Consults",
    role: "Web Designer",
    period: "APR 2020 \u2014 DEC 2023",
    desc: "Delivered 40+ client projects (Salongrid, Manueltech, etc.) from wireframe to deployment. Introduced component-based design workflows that reduced delivery time by an estimated 30%. Built and customised websites using WordPress, Webflow, Framer, and custom HTML/CSS/JS.",
    pills: ["40+ PROJECTS", "30% FASTER DELIVERY", "WEBFLOW / WORDPRESS"],
    tags: ["WEB DESIGN", "BRANDING", "WORDPRESS", "WEBFLOW", "HTML/CSS/JS"],
    link: "NALITECH.PRO \u2192",
    url: "https://nalitech.pro"
  }
];

export default function Experience() {
  return (
    <section id="experience" style={{ 
      background: 'var(--bg-primary)', 
      paddingTop: '8rem', 
      paddingBottom: '8rem',
      color: 'var(--text-primary)'
  
    }}>
      <style>{`
        .experience-container {
          box-sizing: border-box;
          max-width: 1800px;
          margin: 0 auto;
          padding: 0 5vw;
        }
        .experience-header {
          box-sizing: border-box;
        }
        .experience-row {
          box-sizing: border-box;
          display: grid;
          grid-template-columns: 50px 1.5fr 2fr 1fr;
          gap: 2rem;
          padding: 4rem 0;
          border-top: 1px solid var(--border-color);
        }
        @media (max-width: 1024px) {
          .experience-row {
            grid-template-columns: 1fr;
            gap: 1.5rem;
            padding: 3rem 0;
          }
          .exp-date-col { text-align: left !important; }
          .exp-link-col { text-align: left !important; margin-top: 1rem !important; }
        }
        @media (max-width: 768px) {
          #experience {
            width: 100%;
            overflow: hidden;
          }
          .experience-container {
            padding: 0;
          }
          .experience-header {
            padding: 0 5vw;
          }
          .experience-row {
            padding-left: 5vw;
            padding-right: 5vw;
          }
        }
      `}</style>
      
      <div className="experience-container">
        <motion.h2 
          className="experience-header"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{ 
            fontSize: 'clamp(3rem, 10vw, 7rem)', 
            fontWeight: '700', 
            lineHeight: '0.9', 
            letterSpacing: '-0.04em',
            marginBottom: '6rem',
            fontFamily: "'Space Grotesk', sans-serif",
            wordBreak: 'break-word',
            maxWidth: '100%'
          }}
        >
          Work<br/>Experience
        </motion.h2>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {EXPERIENCES.map((exp, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: idx * 0.15, ease: "easeOut" }}
              className="experience-row"
            >
              {/* Number */}
              <div style={{ 
                color: 'var(--text-tertiary)', 
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '0.8rem',
                fontWeight: '600',
                paddingTop: '0.8rem'
              }}>
                {exp.num}
              </div>

              {/* Company & Role */}
              <div>
                <h3 style={{ 
                  fontSize: 'clamp(2rem, 4vw, 3rem)', 
                  marginBottom: '0.5rem', 
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: '700',
                  letterSpacing: '-0.03em',
                  lineHeight: '1.1'
                }}>
                  {exp.company}
                </h3>
                <div style={{ 
                  color: 'var(--text-secondary)', 
                  fontSize: '0.65rem', 
                  fontWeight: '600', 
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase'
                }}>
                  {exp.role}
                </div>
              </div>

              {/* Description & Tags */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingTop: '0.5rem' }}>
                <p style={{ 
                  margin: 0, 
                  fontSize: '0.95rem', 
                  lineHeight: '1.6', 
                  color: 'var(--text-secondary)',
                  fontWeight: '400'
                }}>
                  {exp.desc}
                </p>
                
                {/* Pills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                  {exp.pills.map((pill, i) => (
                    <span key={i} style={{ 
                      display: 'inline-block',
                      padding: '0.35rem 0.8rem', 
                      borderRadius: '999px',
                      border: '1px solid var(--border-color)',
                      fontSize: '0.55rem',
                      fontWeight: '700',
                      letterSpacing: '0.1em',
                      color: 'var(--text-secondary)',
                      textTransform: 'uppercase'
                    }}>
                      {pill}
                    </span>
                  ))}
                </div>

                {/* Tags */}
                <div style={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: '1rem',
                  fontSize: '0.6rem',
                  fontWeight: '700',
                  letterSpacing: '0.1em',
                  color: 'var(--text-primary)',
                  marginTop: '0.5rem'
                }}>
                  {exp.tags.map((tag, i) => (
                    <span key={i}>{tag}</span>
                  ))}
                </div>
              </div>

              {/* Date & Link */}
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                height: '100%',
                paddingTop: '0.5rem'
              }}>
                <div className="exp-date-col" style={{ 
                  textAlign: 'right',
                  color: 'var(--text-tertiary)',
                  fontSize: '0.65rem',
                  fontWeight: '600',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase'
                }}>
                  {exp.period}
                </div>
                
                <div className="exp-link-col" style={{ 
                  textAlign: 'right',
                  marginTop: 'auto'
                }}>
                  <a href={exp.url} style={{
                    color: 'var(--text-primary)',
                    textDecoration: 'none',
                    fontSize: '0.65rem',
                    fontWeight: '700',
                    letterSpacing: '0.15em',
                  }}>
                    {exp.link}
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
