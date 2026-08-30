'use client';

import Image from 'next/image';
import logoPng from '../app/logo.png';

export default function Logo({ className = "w-7 h-7", priority = false }) {
  return (
    <div className={`relative inline-flex items-center justify-center flex-shrink-0 ${className}`}>
      <Image
        src={logoPng}
        alt="Nixlin Logo"
        fill
        sizes="(max-width: 768px) 32px, 48px"
        className="object-contain"
        priority={priority}
      />
    </div>
  );
}
