'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Star, TrendingUp, Tag, Plus } from 'lucide-react';
import { useCart, Product } from '@/context/CartContext';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface ProductCardProps {
  product: Product & { badge?: 'destaque' | 'mais_vendido' | 'promocao' | null };
  categoryName?: string;
}

const BADGE_CONFIG = {
  destaque: { label: 'Destaque', icon: Star, className: 'bg-brand-gold text-white' },
  mais_vendido: { label: 'Mais Querido', icon: TrendingUp, className: 'bg-brand-green text-white' },
  promocao: { label: 'Oferta', icon: Tag, className: 'bg-rose-500 text-white' },
};

export function ProductCard({ product, categoryName }: ProductCardProps) {
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);

  const isOutOfStock = product.stock_status === 'out_of_stock';
  const isLowStock = product.stock_status === 'low_stock';

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isOutOfStock) return;
    addToCart(product);
    setAdding(true);
    setTimeout(() => setAdding(false), 400);
  };

  const badge = product.badge ? BADGE_CONFIG[product.badge] : null;

  return (
    <div className={cn(
      "group bg-white rounded-[2rem] overflow-hidden transition-all duration-700 flex flex-col h-full border border-transparent",
      !isOutOfStock && "hover:shadow-[0_20px_50px_-15px_rgba(6,78,59,0.1)] hover:border-brand-green/5",
      isOutOfStock && "opacity-75"
    )}>
      <Link 
        href={`/produtos/${product.id}`} 
        className={cn(
          "block relative aspect-[4/5] overflow-hidden bg-brand-beige flex-shrink-0",
          isOutOfStock && "grayscale cursor-not-allowed"
        )}
      >
        {/* Badge overlay */}
        {badge && (
          <div className={cn(
            'absolute top-4 left-4 z-10 px-3 py-1.5 rounded-full flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.15em] shadow-xl',
            badge.className
          )}>
            <badge.icon className="w-3 h-3" />
            {badge.label}
          </div>
        )}

        {/* Stock Status Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-brand-nude/20 backdrop-blur-[2px]">
            <span className="bg-brand-green text-brand-nude px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] shadow-2xl">
              Indisponível
            </span>
          </div>
        )}

        {isLowStock && !isOutOfStock && (
          <span className="absolute bottom-4 left-4 z-10 px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-white text-brand-green shadow-xl animate-pulse border border-brand-green/5">
            ✨ Últimas Unidades
          </span>
        )}

        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            quality={100}
            className={cn(
              "object-contain p-6 transition-transform duration-1000 ease-out",
              !isOutOfStock && "group-hover:scale-110"
            )}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-brand-green/10 flex-col gap-2">
            <ShoppingBag className="w-10 h-10" />
          </div>
        )}

        {/* Elegant Buy Button Overlay (Mobile optimized) */}
        {!isOutOfStock && (
          <button
            onClick={handleAdd}
            className={cn(
              "absolute bottom-4 right-4 z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl",
              adding ? "bg-brand-green scale-90" : "bg-white hover:bg-brand-gold text-brand-green hover:text-white",
              "sm:opacity-0 sm:translate-y-4 group-hover:opacity-100 group-hover:translate-y-0"
            )}
          >
            {adding ? (
              <ShoppingBag className="w-5 h-5 animate-cart-bounce" />
            ) : (
              <Plus className="w-6 h-6 stroke-[2.5]" />
            )}
          </button>
        )}
      </Link>

      <div className="p-6 sm:p-8 flex flex-col flex-1">
        <div className="flex flex-col gap-1.5 mb-6 flex-1">
          {categoryName && (
            <span className="text-[9px] uppercase tracking-[0.3em] text-brand-gold font-bold">
              {categoryName}
            </span>
          )}
          <Link href={`/produtos/${product.id}`} className={isOutOfStock ? "pointer-events-none" : ""}>
            <h3 className={cn(
              "text-brand-green font-serif font-bold text-lg sm:text-xl line-clamp-2 transition-colors leading-tight",
              !isOutOfStock && "group-hover:opacity-70"
            )}>
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-col">
            {product.sale_price && (
              <span className="text-[10px] text-gray-400 line-through tracking-wider">
                R$ {product.price.toFixed(2)}
              </span>
            )}
            <span className={cn(
              "text-xl sm:text-2xl font-serif font-bold tracking-tighter",
              isOutOfStock ? "text-gray-300" : "text-brand-green"
            )}>
              R$ {(product.sale_price ? product.sale_price : product.price).toFixed(2)}
            </span>
          </div>

          <div className="flex items-center gap-1">
             {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-2.5 h-2.5 text-brand-gold fill-brand-gold" />
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}
