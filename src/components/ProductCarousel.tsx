'use client';

import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductCarouselProps {
  children: React.ReactNode;
  className?: string;
  itemCount: number;
}

export function ProductCarousel({ children, className, itemCount }: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const scrollArea = scrollRef.current;
    if (scrollArea) {
      checkScroll();
      scrollArea.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
    }
    return () => {
      if (scrollArea) scrollArea.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [itemCount]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth * 0.8 : clientWidth * 0.8;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className={cn("relative group/carousel", className)}>
      {/* Navigation Arrows (Desktop) */}
      {showLeftArrow && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-[-24px] top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white rounded-full shadow-2xl border border-brand-beige flex items-center justify-center text-brand-green transition-all hover:scale-110 active:scale-95 hidden lg:flex hover:bg-brand-gold hover:text-white hover:border-brand-gold duration-500"
          aria-label="Anterior"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
        </button>
      )}

      {showRightArrow && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-[-24px] top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white rounded-full shadow-2xl border border-brand-beige flex items-center justify-center text-brand-green transition-all hover:scale-110 active:scale-95 hidden lg:flex hover:bg-brand-gold hover:text-white hover:border-brand-gold duration-500"
          aria-label="Próximo"
        >
          <ChevronRight className="w-5 h-5 stroke-[2.5]" />
        </button>
      )}

      {/* Scroll Container */}
      <div
        ref={scrollRef}
        className={cn(
          "flex gap-6 sm:gap-8 lg:gap-10 overflow-x-auto pb-12 pt-4 no-scrollbar scroll-smooth snap-x snap-mandatory px-4 sm:px-0",
          itemCount <= 4 ? "lg:justify-start" : ""
        )}
      >
        {React.Children.map(children, (child) => (
          <div className="flex-shrink-0 w-[260px] sm:w-[320px] lg:w-[calc(25%-1.875rem)] snap-start">
            {child}
          </div>
        ))}
      </div>

      {/* Mobile Scroll Indicator Line */}
      <div className="flex justify-center mt-[-10px] lg:hidden">
        <div className="w-16 h-1 bg-brand-beige rounded-full overflow-hidden">
          <div 
            className="h-full bg-brand-gold rounded-full transition-all duration-300"
            style={{ 
              width: scrollRef.current ? `${(scrollRef.current.clientWidth / scrollRef.current.scrollWidth) * 100}%` : '20%',
              marginLeft: scrollRef.current ? `${(scrollRef.current.scrollLeft / scrollRef.current.scrollWidth) * 100}%` : '0%'
            }}
          />
        </div>
      </div>
    </div>
  );
}
