'use client';

import { Search, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useDebounce } from '@/hooks/useDebounce';

export function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get('busca') || '');
  const debouncedValue = useDebounce(value, 500);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (debouncedValue) {
      params.set('busca', debouncedValue);
    } else {
      params.delete('busca');
    }
    router.push(`/produtos?${params.toString()}`, { scroll: false });
  }, [debouncedValue, router, searchParams]);

  return (
    <div className="relative w-full max-w-lg group">
      <div className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-gold transition-transform duration-500 group-focus-within:scale-110">
        <Search className="w-5 h-5 stroke-[2.5]" />
      </div>
      <input
        type="text"
        placeholder="Procure o produto perfeito..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full pl-16 pr-16 py-5 bg-white/5 border border-white/10 rounded-full outline-none focus:ring-1 focus:ring-brand-gold/30 focus:border-brand-gold/50 transition-all font-bold text-xs tracking-widest uppercase text-white placeholder:text-brand-nude/20 shadow-2xl backdrop-blur-sm"
      />
      {value && (
        <button
          onClick={() => setValue('')}
          className="absolute right-6 top-1/2 -translate-y-1/2 text-white/40 hover:text-brand-gold transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
