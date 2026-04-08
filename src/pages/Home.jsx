import Hero from '../components/Hero';
import Experience from '../components/Experience';
import Projects from '../components/Projects';
import AboutSection from '../components/AboutSection';
import Skills from '../components/Skills';

export default function Home({ openCV }) {
  return (
    <>
      <Hero openCV={openCV} />
      <Experience />
      <Projects />
      <AboutSection />
      <Skills />
    </>
  );
}
