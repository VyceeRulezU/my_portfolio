import { useState } from 'react';
import { optimizedSrc } from '../utils/assetHelper';

// <img> that prefers the resized R2 copy and falls back to the original if that copy is missing.
export default function SmartImg({ src, width = 800, alt = '', ...props }) {
  const [failedSrc, setFailedSrc] = useState(null);
  const optimized = optimizedSrc(src, width);
  const useOriginal = failedSrc === src || optimized === src;

  return (
    <img
      src={useOriginal ? src : optimized}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={useOriginal ? undefined : () => setFailedSrc(src)}
      {...props}
    />
  );
}
