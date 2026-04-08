import { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import LogoWhite from '../assets/VI_Logo_White.png';
import LogoBlack from '../assets/VI_Black_Logo.png';
import { Sun, Moon, Menu, X } from 'lucide-react';

export default function Navbar({ theme, toggleTheme, openCV }) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Use appropriate logo based on theme
  const logoSrc = theme === 'dark-theme' ? LogoWhite : LogoBlack;

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { name: 'WORK', path: '/' },
    { name: 'ABOUT', path: '/about' },
  ];

  return (
    <header className="navbar glass-panel" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 5vw',
      zIndex: 100,
      borderRadius: 0,
      borderTop: 'none',
      borderLeft: 'none',
      borderRight: 'none',
      boxSizing: 'border-box'
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', zIndex: 110 }}>
        <img 
          src={logoSrc} 
          alt="Portfolio Logo" 
          style={{ height: '5rem', width: 'auto' }} 
        />
      </Link>
      
      {/* Desktop Navigation */}
      <nav className="desktop-nav" style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
        {navLinks.map((link) => (
          <NavLink 
            key={link.name}
            to={link.path} 
            style={({ isActive }) => ({ 
              color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)', 
              textDecoration: 'none', 
              fontSize: '0.7rem', 
              fontWeight: '600', 
              letterSpacing: '0.1em' 
            })}
          >
            {link.name}
          </NavLink>
        ))}
        <a href="#contact" style={{ 
          color: 'var(--text-secondary)', 
          textDecoration: 'none', 
          fontSize: '0.7rem', 
          fontWeight: '600', 
          letterSpacing: '0.1em' 
        }}>CONTACT</a>
        
        <button 
          onClick={toggleTheme}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0.5rem',
            marginLeft: '0.5rem',
            transition: 'opacity 0.2s',
          }}
          aria-label="Toggle theme"
        >
          {theme === 'dark-theme' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button 
          onClick={openCV} 
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
            color: 'var(--text-primary)',
            padding: '0.6rem 1.25rem',
            borderRadius: '999px',
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: '600',
            fontSize: '0.65rem',
            letterSpacing: '0.1em',
            border: '1px solid var(--border-color)',
            cursor: 'pointer',
            textDecoration: 'none',
            marginLeft: '0.5rem',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'var(--text-primary)';
            e.currentTarget.style.color = 'var(--bg-primary)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = 'var(--text-primary)';
          }}
        >
          VIEW CV
        </button>
      </nav>

      {/* Mobile Hamburger Toggle */}
      <button 
        className="mobile-menu-toggle"
        onClick={toggleMenu}
        style={{
          display: 'none',
          background: 'transparent',
          border: 'none',
          color: 'var(--text-primary)',
          cursor: 'pointer',
          zIndex: 110,
          padding: '0.5rem'
        }}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              width: '80%',
              maxWidth: '400px',
              height: '100dvh',
              background: 'var(--bg-primary)',
              backdropFilter: 'blur(20px)',
              borderLeft: '1px solid var(--border-color)',
              padding: '7rem 10% 3rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              zIndex: 105,
              boxShadow: '-10px 0 30px rgba(0,0,0,0.2)',
              overflowY: 'auto',
              boxSizing: 'border-box'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {navLinks.map((link) => (
                <NavLink 
                  key={link.name}
                  to={link.path} 
                  onClick={() => setIsOpen(false)}
                  style={{ 
                    color: 'var(--text-primary)', 
                    textDecoration: 'none', 
                    fontSize: '1.5rem', 
                    fontWeight: '700', 
                    letterSpacing: '0.05em',
                    fontFamily: "'Space Grotesk', sans-serif"
                  }}
                >
                  {link.name}
                </NavLink>
              ))}
              <a 
                href="#contact" 
                onClick={() => setIsOpen(false)}
                style={{ 
                  color: 'var(--text-primary)', 
                  textDecoration: 'none', 
                  fontSize: '1.5rem', 
                  fontWeight: '700', 
                  letterSpacing: '0.05em',
                  fontFamily: "'Space Grotesk', sans-serif"
                }}
              >
                CONTACT
              </a>
            </div>

            <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-tertiary)' }}>THEME</span>
                <button 
                  onClick={toggleTheme}
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px',
                    color: 'var(--text-primary)',
                    padding: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  {theme === 'dark-theme' ? <Sun size={18} /> : <Moon size={18} />}
                  <span style={{ fontSize: '0.7rem', fontWeight: '700' }}>
                    {theme === 'dark-theme' ? 'LIGHT' : 'DARK'}
                  </span>
                </button>
              </div>

              <button 
                onClick={() => { setIsOpen(false); openCV(); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'var(--text-primary)',
                  color: 'var(--bg-primary)',
                  padding: '1rem',
                  borderRadius: '12px',
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: '700',
                  fontSize: '0.8rem',
                  letterSpacing: '0.1em',
                  textDecoration: 'none',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                VIEW CV
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-menu-toggle {
            display: block !important;
          }
        }
      `}</style>
    </header>
  );
}
