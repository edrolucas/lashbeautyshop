'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart, Product } from '@/context/CartContext';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  categoryName?: string;
}

export function ProductCard({ product, categoryName }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-emerald-900/10 hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-500">
      <Link href={`/produtos/${product.id}`} className="block relative aspect-[4/5] overflow-hidden bg-gray-50">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-100 flex-col gap-2">
             <ShoppingBag className="w-8 h-8 opacity-20" />
             <span className="text-[10px] uppercase tracking-widest opacity-50 font-sans">Sem imagem</span>
          </div>
        )}
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-emerald-900/0 group-hover:bg-emerald-900/5 transition-all duration-500" />
      </Link>

      <div className="p-6">
        <div className="flex flex-col gap-1 mb-3">
          {categoryName && (
            <span className="text-[10px] uppercase tracking-[0.2em] text-emerald-900/40 font-bold">
              {categoryName}
            </span>
          )}
          <Link href={`/produtos/${product.id}`}>
            <h3 className="text-gray-900 font-serif font-bold text-lg line-clamp-1 group-hover:text-emerald-900 transition-colors">
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 font-sans">A partir de</span>
            <span className="text-xl font-serif font-bold text-emerald-900">
              R$ {product.price.toFixed(2)}
            </span>
          </div>
          
          <button
            onClick={() => addToCart(product)}
            className="w-10 h-10 bg-emerald-900 text-white rounded-full flex items-center justify-center transition-all hover:bg-emerald-800 active:scale-90 shadow-lg shadow-emerald-900/20"
            aria-label="Adicionar ao carrinho"
          >
            <PlusIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}
