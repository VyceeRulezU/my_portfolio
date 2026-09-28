import { useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import SmartImg from './SmartImg';
import { optimizedSrc } from '../utils/assetHelper';

const SWIPE_PX = 50;

/**
 * Full-screen image viewer with previous/next navigation.
 * images: [{ src, caption }]; index: open image (null = closed).
 */
export default function ImageViewer({ images, index, onIndexChange, onClose }) {
  const isOpen = index !== null && images.length > 0;
  const count = images.length;
  const closeRef = useRef(null);
  const touchX = useRef(null);

  const go = useCallback((step) => onIndexChange((index + step + count) % count), [index, count, onIndexChange]);

  // Keyboard navigation.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, go, onClose]);

  // Lock page scroll and move focus into the viewer; restore both on close.
  useEffect(() => {
    if (!isOpen) return;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus?.();
    };
  }, [isOpen]);

  // Preload neighbours so next/previous feel instant.
  useEffect(() => {
    if (!isOpen || count < 2) return;
    [index + 1, index - 1].forEach((i) => {
      const img = new Image();
      img.src = optimizedSrc(images[(i + count) % count].src, 1920);
    });
  }, [isOpen, index, count, images]);

  const onTouchStart = (e) => { touchX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touchX.current === null || count < 2) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) > SWIPE_PX) go(dx < 0 ? 1 : -1);
  };

  const current = isOpen ? images[index] : null;
  const stop = (fn) => (e) => { e.stopPropagation(); fn(); };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="image-viewer"
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <style>{`
            .image-viewer { position: fixed; inset: 0; z-index: 9999; display: flex; align-items: center; justify-content: center; background: rgba(0, 0, 0, 0.9); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); touch-action: pan-y; }
            .image-viewer-btn { position: absolute; z-index: 2; width: 44px; height: 44px; border: none; border-radius: 50%; background: rgba(255,255,255,0.1); color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.2s; }
            .image-viewer-btn:hover, .image-viewer-btn:focus-visible { background: rgba(255,255,255,0.22); outline: none; }
            .image-viewer-prev { left: 1.5rem; top: 50%; transform: translateY(-50%); }
            .image-viewer-next { right: 1.5rem; top: 50%; transform: translateY(-50%); }
            .image-viewer-close { top: 1.5rem; right: 1.5rem; }
            .image-viewer-img { max-width: min(88vw, 1600px); max-height: 82vh; object-fit: contain; border-radius: 12px; user-select: none; }
            .image-viewer-meta { position: absolute; bottom: 1.5rem; left: 0; right: 0; text-align: center; color: rgba(255,255,255,0.7); font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; pointer-events: none; }
            @media (max-width: 768px) {
              .image-viewer-prev, .image-viewer-next { top: auto; bottom: 1rem; transform: none; }
              .image-viewer-prev { left: 1rem; }
              .image-viewer-next { right: 1rem; }
              .image-viewer-img { max-width: 94vw; max-height: 74vh; }
              .image-viewer-meta { bottom: 1.9rem; }
            }
          `}</style>

          <button ref={closeRef} type="button" className="image-viewer-btn image-viewer-close" aria-label="Close" onClick={stop(onClose)}>
            <X size={18} />
          </button>
          {count > 1 && (
            <>
              <button type="button" className="image-viewer-btn image-viewer-prev" aria-label="Previous image" onClick={stop(() => go(-1))}>
                <ChevronLeft size={22} />
              </button>
              <button type="button" className="image-viewer-btn image-viewer-next" aria-label="Next image" onClick={stop(() => go(1))}>
                <ChevronRight size={22} />
              </button>
            </>
          )}

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current.src}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={(e) => e.stopPropagation()}
            >
              <SmartImg
                src={current.src}
                width={1920}
                loading="eager"
                className="image-viewer-img"
                alt={current.caption || `Image ${index + 1} of ${count}`}
                draggable={false}
              />
            </motion.div>
          </AnimatePresence>

          <div className="image-viewer-meta" aria-live="polite">
            {current.caption ? `${current.caption} · ` : ''}{index + 1} / {count}
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
