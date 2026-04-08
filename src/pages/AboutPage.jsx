import { motion } from 'framer-motion';

const BELIEFS = [
  {
    num: "01",
    title: "Bridge the gap.",
    desc: "I don't just hand off designs. I implement them. I close the gap between design and engineering so nothing gets lost between Figma and production. I speak both languages fluently."
  },
  {
    num: "02",
    title: "Focus on Impact.",
    desc: "A beautiful design that doesn't convert or solve a user problem is just art. I prioritize functionality, accessibility, and business outcomes in every pixel I place."
  },
  {
    num: "03",
    title: "Continuous Optimization.",
    desc: "Building is just the beginning. I focus on peak performance, SEO, and responsiveness to ensure products shine across all platforms and load instantly for every user."
  }
];

const JOURNEY = [
  { year: "2025-Present", title: "Lead Web UX Designer", sub: "JOBIN.CLOUD \u00B7 AI Recruitment SaaS", desc: "Leading design for an AI-powered recruitment platform. Focusing on complex UX workflows and a unified design system." },
  { year: "2024", title: "SaaS Builder", sub: "GOVERNANCE RESOURCE HUB \u00B7 EDTECH", desc: "Built and launched governanceresourcehub.com, a comprehensive platform democratizing governance education." },
  { year: "2022-2024", title: "Product Management", sub: "ERCAS \u00B7 FINTECH \u00B7 WEB UX", desc: "Managed end-to-end product lifecycles at ERCAS, bridging the gap between business goals and user-facing design." },
  { year: "2020-2022", title: "Product Design", sub: "NALITECH \u00B7 WEB UX \u00B7 DESIGN SYSTEMS", desc: "Transitioned fully into Product Design, delivering 40+ high-impact web and mobile interfaces." },
  { year: "2014-2020", title: "Where it began", sub: "VISUAL DESIGN \u00B7 BRANDING \u00B7 WEB", desc: "Started the creative journey focusing on visual aesthetics, typography, and foundational web design." }
];

const CREDENTIALS = [
  { title: "UX Design Certificate", org: "VERTICAL INSTITUTE", year: "2022" },
  { title: "Product Management Basics", org: "PENDO", year: "2024" },
  { title: "Certified ScrumMaster\u00AE", org: "SCRUM ALLIANCE", year: "2023" },
  { title: "Google UX Design Professional", org: "COURSERA", year: "2021" }
];

export default function AboutPage() {
  return (
    <section className="page-container" style={{ paddingTop: '12rem', paddingBottom: '8rem', color: 'var(--text-primary)' }}>
      <div style={{ maxWidth: '1800px', margin: '0 auto', padding: '0 5vw' }}>
        
        {/* Header Section */}
        <div style={{ marginBottom: '8rem' }}>
          <div style={{ color: 'var(--text-tertiary)', fontSize: '0.65rem', fontWeight: '700', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '2rem' }}>
             \u2014 ABOUT ME
          </div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ 
              fontSize: 'clamp(3.5rem, 7vw, 6.5rem)', 
              fontWeight: '700', 
              lineHeight: '0.95', 
              letterSpacing: '-0.04em',
              fontFamily: "'Space Grotesk', sans-serif",
              maxWidth: '900px'
            }}
          >
            I build what<br/>I design.
          </motion.h1>
          <div style={{ display: 'flex', gap: '4rem', marginTop: '4rem', flexWrap: 'wrap' }}>
             <p style={{ maxWidth: '500px', fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
                I'm a Senior Product Designer and UX Engineer with 6+ years of experience across SaaS, fintech, and EdTech products. 
                I specialize in designing scalable interfaces and translating them into production-ready code.
             </p>
             <p style={{ maxWidth: '500px', fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
                Proficient in Figma, React, and Tailwind, with a strong focus on accessibility, performance, and design systems. 
                I close the gap between design and engineering where most designers stop.
             </p>
          </div>
        </div>

        {/* Belief System */}
        <div style={{ marginBottom: '10rem' }}>
           <div style={{ color: 'var(--text-tertiary)', fontSize: '0.65rem', fontWeight: '700', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '3rem' }}>
             BELIEF SYSTEM
           </div>
           <div style={{ borderTop: '1px solid var(--border-color)' }}>
              {BELIEFS.map((belief, idx) => (
                <div key={idx} style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '80px 1fr', 
                  padding: '3rem 0', 
                  borderBottom: '1px solid var(--border-color)',
                  gap: '2rem'
                }}>
                   <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-tertiary)' }}>{belief.num}</span>
                   <div>
                      <h3 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '1rem', fontFamily: "'Space Grotesk', sans-serif" }}>{belief.title}</h3>
                      <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: '1.6', maxWidth: '800px' }}>{belief.desc}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Timeline Section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '8rem', marginBottom: '10rem' }}>
           <div>
              <div style={{ color: 'var(--text-tertiary)', fontSize: '0.65rem', fontWeight: '700', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '3rem' }}>
                CAREER JOURNEY
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                 {JOURNEY.map((item, idx) => (
                   <div key={idx} style={{ position: 'relative', paddingLeft: '2rem', borderLeft: '1px solid var(--border-color)' }}>
                      <div style={{ position: 'absolute', left: '-5px', top: '0', width: '9px', height: '9px', background: 'var(--text-primary)', borderRadius: '50%' }} />
                      <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-tertiary)', marginBottom: '0.5rem' }}>{item.year}</div>
                      <h4 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.25rem' }}>{item.title}</h4>
                      <div style={{ fontSize: '0.65rem', fontWeight: '700', letterSpacing: '0.1em', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '1rem' }}>{item.sub}</div>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>{item.desc}</p>
                   </div>
                 ))}
              </div>
           </div>

           {/* Stack & Tools */}
           <div>
              <div style={{ color: 'var(--text-tertiary)', fontSize: '0.65rem', fontWeight: '700', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '3rem' }}>
                TECH STACK
              </div>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '3rem' }}>
                 I leverage a modern stack to build performant, scalable, and accessible digital products.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                 {['Figma', 'React', 'Next.js', 'Tailwind CSS', 'Framer Motion', 'Webflow', 'WordPress', 'Design Systems', 'UX Research', 'Prototyping'].map((tech) => (
                   <div key={tech} style={{ padding: '0.75rem 1.25rem', border: '1px solid var(--border-color)', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '600' }}>
                      {tech}
                   </div>
                 ))}
              </div>

              {/* Expertise Section */}
              <div style={{ marginTop: '5rem' }}>
                 <div style={{ color: 'var(--text-tertiary)', fontSize: '0.65rem', fontWeight: '700', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '2rem' }}>
                    EXPERTISE & CREATIVE FOCUS
                 </div>
                 <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '2rem' }}>
                    <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
                       I specialize in designing and building products that balance aesthetic beauty with engineering rigor. 
                       From **scalable design systems** to **production-ready React components**, I ensure every pixel serves a purpose.
                    </p>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </section>
  );
}
