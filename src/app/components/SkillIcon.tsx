'use client';
import Image from 'next/image';
import { useState } from 'react';

export default function SkillIcon({
  src,
  alt,
  size = 20,
}: {
  src?: string;
  alt: string;
  size?: number;
}) {
  const [imgSrc, setImgSrc] = useState(src || '/skill-fallback.svg');
  return (
    <Image
      src={imgSrc || '/skill-fallback.svg'}
      alt={alt}
      width={size}
      height={size}
      className="h-5 w-5"
      onError={() => setImgSrc('/skill-fallback.svg')}
    />
  );
}
