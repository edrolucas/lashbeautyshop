'use client';

import Image from 'next/image';
import { ImageIcon } from 'lucide-react';

interface ProductGalleryProps {
  image: string;
  name: string;
}

export function ProductGallery({ image, name }: ProductGalleryProps) {
  return (
    <div className="space-y-4">
      <div className="aspect-square relative bg-gray-50 rounded-[40px] overflow-hidden border border-gray-100 shadow-xl shadow-emerald-900/5 group">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-110"
            priority
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-4">
            <ImageIcon className="w-16 h-16 stroke-[1]" />
            <span className="text-xs font-bold uppercase tracking-widest">Sem Imagem</span>
          </div>
        )}
      </div>
    </div>
  );
}
