'use client';

import Image from 'next/image';
import logoPng from '../app/NIXLIN_LOGO.png';

export default function Logo({
  className = "w-28 h-10",
  imageClassName = "object-contain",
  priority = false,
}) {
  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
      <Image
        src={logoPng}
        alt="Nixlin Logo"
        fill
        sizes="(max-width: 768px) 112px, 144px"
        className={imageClassName}
        priority={priority}
      />
    </div>
  );
}
