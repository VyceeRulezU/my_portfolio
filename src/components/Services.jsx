import { motion } from 'framer-motion';
import { PenTool, Code2, Palette, Layers } from 'lucide-react';

const SERVICES = [
  {
    icon: <PenTool size={32} />,
    title: "UI/UX Design",
    desc: "End-to-end design from user research to high-fidelity prototypes. Creating intuitive interfaces that users love."
  },
  {
    icon: <Code2 size={32} />,
    title: "Front-End Development",
    desc: "Translating designs into pixel-perfect, responsive code using React, HTML/CSS, and modern frameworks."
  },
  {
    icon: <Palette size={32} />,
    title: "Design Systems",
    desc: "Building scalable component libraries and design tokens that ensure consistency across products."
  },
  {
    icon: <Layers size={32} />,
    title: "Product Strategy",
    desc: "Bridging business goals with user needs through wireframes, roadmaps, and iterative design thinking."
  }
];

export default function Services() {
  return (
    <section id="services" className="section" style={{ background: 'var(--bg-secondary)' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ marginBottom: '1rem' }}
        >
          What I Do
        </motion.h2>
        
        <p style={{ marginBottom: '4rem', fontSize: '1.125rem', color: 'var(--text-secondary)' }}>
          Comprehensive design and development services to bring your product vision to life.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem'
        }}>
          {SERVICES.map((service, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              className="glass-panel"
              style={{
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}
            >
              <div style={{ color: 'var(--text-tertiary)' }}>
                {service.icon}
              </div>
              <h3 style={{ fontSize: '1.25rem', margin: 0 }}>{service.title}</h3>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
                {service.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
