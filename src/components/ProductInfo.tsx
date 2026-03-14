'use client';

import { useState } from 'react';
import { Minus, Plus, ShoppingBag, Check, ShieldCheck, Truck, Star } from 'lucide-react';
import { useCart, Product } from '@/context/CartContext';
import { cn } from '@/lib/utils';

interface ProductInfoProps {
  product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 mb-6">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-3 h-3 text-brand-gold fill-brand-gold" />
          ))}
        </div>
        <span className="text-[10px] text-brand-green/40 uppercase font-bold tracking-[0.2em]"> (48 Avaliações)</span>
      </div>

      <h1 className="text-5xl lg:text-6xl font-serif font-bold text-brand-green mb-6 leading-[0.9] tracking-tighter">
        {product.name}
      </h1>
      
      <div className="flex items-center gap-6 mb-10">
        <span className="text-4xl font-serif font-bold text-brand-green tracking-tighter">
          R$ {product.price.toFixed(2).replace('.', ',')}
        </span>
        <div className="px-4 py-1.5 bg-brand-beige text-brand-gold rounded-full text-[10px] font-bold uppercase tracking-[0.2em]">
          Disponível
        </div>
      </div>

      <p className="text-brand-green/60 leading-relaxed mb-12 text-base font-medium">
        {product.description || 'Uma seleção exclusiva de excelência e performance para profissionais que exigem o melhor em cada detalhe.'}
      </p>

      {/* Quantity & Add to Cart */}
      <div className="flex flex-col sm:flex-row gap-6 mb-16">
        <div className="flex items-center border border-brand-beige rounded-full h-16 px-6 bg-white/50 backdrop-blur-sm">
          <button 
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-10 h-10 flex items-center justify-center text-brand-green/30 hover:text-brand-gold transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-12 text-center font-bold text-lg text-brand-green">{quantity}</span>
          <button 
            onClick={() => setQuantity(quantity + 1)}
            className="w-10 h-10 flex items-center justify-center text-brand-green/30 hover:text-brand-gold transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={handleAddToCart}
          className={cn(
            "flex-1 h-16 rounded-full font-bold text-xs tracking-[0.2em] flex items-center justify-center gap-3 transition-all transform active:scale-95 shadow-2xl uppercase",
            isAdded 
              ? "bg-brand-gold text-white shadow-brand-gold/20" 
              : "bg-brand-green text-white hover:bg-brand-gold shadow-brand-green/20"
          )}
        >
          {isAdded ? (
            <>
              <Check className="w-5 h-5 stroke-[2.5]" />
              Colocado no Carrinho
            </>
          ) : (
            <>
              <ShoppingBag className="w-5 h-5 stroke-[2.5]" />
              Comprar Agora
            </>
          )}
        </button>
      </div>

      {/* Trust Elements */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-12 border-t border-brand-beige">
        <div className="flex items-start gap-5">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-brand-beige">
            <Truck className="w-6 h-6 text-brand-gold" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-brand-green uppercase tracking-widest mb-1">Envio Expresso</h4>
            <p className="text-[11px] text-brand-green/40 font-medium leading-relaxed">Logística premium para todo o território nacional.</p>
          </div>
        </div>
        <div className="flex items-start gap-5">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-brand-beige">
            <ShieldCheck className="w-6 h-6 text-brand-gold" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-brand-green uppercase tracking-widest mb-1">Qualidade Selada</h4>
            <p className="text-[11px] text-brand-green/40 font-medium leading-relaxed">Garantia absoluta de autenticidade e excelência.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
