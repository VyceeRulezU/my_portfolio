import { motion } from 'framer-motion';

const BELIEFS = [
  {
    num: "01",
    title: "Don't stay in one lane.",
    desc: "The best products are built by people who can design, manage, and build. I started as a web designer, became a product designer, expanded into PM, and now I build AI-powered systems end-to-end. Each transition wasn't a pivot — it was an accumulation."
  },
  {
    num: "02",
    title: "Strategy is meaningless without execution.",
    desc: "Strategy is meaningless without execution. I run lean — research fast, prototype early, ship often, measure ruthlessly. Kelick went from concept to paying customers without a full engineering team because I refused to separate designing from building."
  },
  {
    num: "03",
    title: "Automate everything repeatable.",
    desc: "If a human is doing something a workflow can handle, that's waste. I build automation layers into every product — not as an add-on, but as a core architectural decision. AI doesn't replace thinking; it eliminates friction so you can think better."
  }
];

const JOURNEY = [
  { year: "2025-Present", title: "Lead Web UX Designer", sub: "JOBIN.CLOUD / AI Recruitment SaaS", desc: "Leading design for an AI-powered recruitment platform. Focusing on complex UX workflows and a unified design system." },
  { year: "2024", title: "SaaS Builder", sub: "GOVERNANCE RESOURCE HUB / EDTECH", desc: "Built and launched governanceresourcehub.com, a comprehensive platform democratizing governance education." },
  { year: "2022-2024", title: "Product Management", sub: "ERCAS / FINTECH / WEB UX", desc: "Managed end-to-end product lifecycles at ERCAS, bridging the gap between business goals and user-facing design." },
  { year: "2020-2022", title: "Product Design", sub: "NALITECH / WEB UX / DESIGN SYSTEMS", desc: "Transitioned fully into Product Design, delivering 40+ high-impact web and mobile interfaces." },
  { year: "2014-2020", title: "Where it began", sub: "VISUAL DESIGN / BRANDING / WEB", desc: "Started the creative journey focusing on visual aesthetics, typography, and foundational web design." }
];

const CREDENTIALS = [
  { title: "UX Design Certificate", org: "DEV AND DESIGN", year: "2022" },
  { title: "Product Management Basics", org: "PENDO", year: "2024" },
  { title: "Certified ScrumMaster®", org: "SCRUM ALLIANCE", year: "2023" },
  { title: "Google UX Design Professional", org: "COURSERA", year: "2021" }
];

export default function About() {
  return (
    <section id="about" style={{ paddingTop: '8rem', paddingBottom: '8rem', color: 'var(--text-primary)' }}>
      <div style={{ maxWidth: '1800px', margin: '0 auto', padding: '0 5vw' }}>
        
        {/* Intro Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '8rem' }}>
          <div style={{ color: 'var(--text-tertiary)', fontSize: '0.65rem', fontWeight: '700', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            / HOME / ABOUT
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
              fontFamily: "'Space Grotesk', sans-serif",
              maxWidth: '800px'
            }}
          >
            I build what<br/>I design.
          </motion.h1>

          <p style={{ maxWidth: '800px', fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: '1.6', margin: '1rem 0' }}>
            Product Designer, Product Manager, and Design Systems specialist based in Dublin, Ireland. 
            I design products from concept, manage them to market, and build the systems 
            that make them run.
          </p>

          <a href="#contact" style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--text-primary)',
            color: 'var(--bg-primary)',
            padding: '0.8rem 1.8rem',
            borderRadius: '999px',
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: '600',
            fontSize: '0.75rem',
            letterSpacing: '0.1em',
            textDecoration: 'none',
            alignSelf: 'flex-start',
            transition: 'opacity 0.2s'
          }}>
            GET IN TOUCH
          </a>
        </div>

        {/* Belief System */}
        <div style={{ marginBottom: '8rem' }}>
          <div style={{ color: 'var(--text-tertiary)', fontSize: '0.65rem', fontWeight: '700', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '3rem' }}>
            BELIEF SYSTEM
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {BELIEFS.map((belief, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'minmax(40px, auto) 1fr', 
                  gap: '2rem', 
                  padding: '3rem 0',
                  borderTop: idx === 0 ? '1px solid var(--border-color)' : 'none',
                  borderBottom: '1px solid var(--border-color)'
                }}
              >
                <div style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem', fontWeight: '600', paddingTop: '0.5rem' }}>
                  {belief.num}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.75rem', fontWeight: '700', letterSpacing: '-0.02em', marginBottom: '1rem' }}>
                    {belief.title}
                  </h3>
                  <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '800px' }}>
                    {belief.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Career Journey */}
        <div style={{ marginBottom: '8rem' }}>
          <div style={{ color: 'var(--text-tertiary)', fontSize: '0.65rem', fontWeight: '700', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '4rem' }}>
            CAREER JOURNEY
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', borderLeft: '1px solid var(--border-color)', marginLeft: '10px' }}>
            {JOURNEY.map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                style={{ 
                  position: 'relative',
                  paddingLeft: '3rem',
                  paddingBottom: idx === JOURNEY.length - 1 ? '0' : '4rem'
                }}
              >
                {/* Timeline Dot */}
                <div style={{
                  position: 'absolute',
                  left: '-5px',
                  top: '0',
                  width: '9px',
                  height: '9px',
                  borderRadius: '50%',
                  background: 'var(--text-primary)',
                  boxShadow: '0 0 0 4px var(--bg-primary)'
                }} />

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: '700', fontFamily: "'Space Grotesk', sans-serif" }}>{item.year}</span>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '700', margin: 0 }}>{item.title}</h3>
                  <span style={{ color: 'var(--text-tertiary)', fontSize: '0.6rem', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{item.sub}</span>
                </div>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '700px' }}>
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* The stack I ship with */}
        <div style={{ marginBottom: '8rem' }}>
          <div style={{ color: 'var(--text-tertiary)', fontSize: '0.65rem', fontWeight: '700', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem' }}>
            DAILY TOOLS
          </div>
          <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: '700', letterSpacing: '-0.03em', marginBottom: '3rem' }}>
            The stack I ship with.
          </h2>
          {/* Note: In a real environment, replace these generic pills with actual SVG icons. Using text pills here for layout integrity. */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            {['Figma', 'VS Code', 'React', 'Tailwind', 'Next.js', 'PostgreSQL', 'Webflow', 'Wordpress', 'Framer', 'Claude', 'OpenRouter', 'Retell AI'].map((tool, idx) => (
              <span key={idx} style={{ 
                padding: '0.75rem 1.25rem', 
                border: '1px solid var(--border-color)', 
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: '600',
                color: 'var(--text-primary)',
                background: 'var(--bg-glass)'
              }}>
                {tool}
              </span>
            ))}
          </div>
        </div>

        {/* Credentials */}
        <div>
          <div style={{ color: 'var(--text-tertiary)', fontSize: '0.65rem', fontWeight: '700', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '3rem' }}>
            CREDENTIALS
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
            gap: '1.5rem' 
          }}>
            {CREDENTIALS.map((cred, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                style={{
                  padding: '2rem',
                  border: '1px solid var(--border-color)',
                  borderRadius: '16px',
                  background: 'var(--bg-glass)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem'
                }}
              >
                <div style={{ color: 'var(--text-tertiary)', fontSize: '0.55rem', fontWeight: '700', letterSpacing: '0.15em' }}>CERTIFICATION</div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: '700', margin: 0, lineHeight: '1.3' }}>{cred.title}</h4>
                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', color: 'var(--text-tertiary)', fontSize: '0.65rem', fontWeight: '600', letterSpacing: '0.1em' }}>
                  <span>{cred.org}</span>
                  <span>{cred.year}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
