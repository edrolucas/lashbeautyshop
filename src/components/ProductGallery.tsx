'use client';

import Image from 'next/image';
import { ImageIcon, Expand } from 'lucide-react';

interface ProductGalleryProps {
  image: string;
  name: string;
}

export function ProductGallery({ image, name }: ProductGalleryProps) {
  return (
    <div className="space-y-8">
      <div className="aspect-square relative bg-brand-beige rounded-[3rem] overflow-hidden group cursor-zoom-in border border-brand-beige">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            quality={100}
            className="object-contain p-12 transition-transform duration-[1.5s] ease-out group-hover:scale-110"
            priority
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-brand-green/10 gap-4">
            <ImageIcon className="w-20 h-20 stroke-[1]" />
          </div>
        )}

        {/* Elegant overlay hint */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="flex items-center gap-2 px-5 py-2.5 bg-brand-green/90 text-white rounded-full text-[9px] font-bold uppercase tracking-[0.2em] backdrop-blur-md">
            <Expand className="w-3 h-3 text-brand-gold" />
            Clique para ampliar
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-3">
         {/* Simplified thumbnails if more images were available, branding-consistent spacers for now */}
         <div className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
         <div className="w-1.5 h-1.5 rounded-full bg-brand-beige" />
         <div className="w-1.5 h-1.5 rounded-full bg-brand-beige" />
      </div>
    </div>
  );
}
