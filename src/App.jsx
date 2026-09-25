import { useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CVModal from './components/CVModal';
import BackToTop from './components/BackToTop';
import { Analytics } from '@vercel/analytics/react';

// Lazy loading pages for better performance
const Home = lazy(() => import('./pages/Home'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);
  return null;
}

function getInitialTheme() {
  try {
    const savedTheme = localStorage.getItem('portfolio-theme');
    if (savedTheme !== null) return savedTheme;
  } catch {
    // Storage unavailable (private mode etc.) — fall through to system preference.
  }
  return window.matchMedia('(prefers-color-scheme: light)').matches ? '' : 'dark-theme';
}

function App() {
  const [theme, setTheme] = useState(getInitialTheme);
  const [isCVOpen, setIsCVOpen] = useState(false);

  useEffect(() => {
    if (theme === 'dark-theme') {
      document.documentElement.classList.add('dark-theme');
    } else {
      document.documentElement.classList.remove('dark-theme');
    }
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark-theme' ? '' : 'dark-theme';
    setTheme(newTheme);
    try {
      localStorage.setItem('portfolio-theme', newTheme);
    } catch {
      // Preference just won't persist.
    }
  };

  const openCV = () => setIsCVOpen(true);
  const closeCV = () => setIsCVOpen(false);

  return (
    <div className="app-container">
      <ScrollToTop />
      <Navbar theme={theme} toggleTheme={toggleTheme} openCV={openCV} />
      
      <main>
        <Suspense fallback={<div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)' }}>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home openCV={openCV} />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/work/:id" element={<ProjectDetail />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />

      {/* Global In-Page CV Modal */}
      <CVModal isOpen={isCVOpen} onClose={closeCV} />
      
      {/* Scroll to Top Trigger */}
      <BackToTop />

      {/* Vercel Analytics */}
      <Analytics />
    </div>
  );
}

export default App;
