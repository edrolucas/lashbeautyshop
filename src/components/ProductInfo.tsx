'use client';

import { useState } from 'react';
import { Minus, Plus, ShoppingBag, Check, ShieldCheck, Truck } from 'lucide-react';
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
      <h1 className="text-4xl lg:text-5xl font-serif font-bold text-gray-900 mb-4">{product.name}</h1>
      
      <div className="flex items-center gap-4 mb-8">
        <span className="text-3xl font-serif font-bold text-emerald-900">
          R$ {product.price.toFixed(2).replace('.', ',')}
        </span>
        <div className="px-3 py-1 bg-emerald-50 text-emerald-900 rounded-full text-[10px] font-bold uppercase tracking-wider">
          Em Estoque
        </div>
      </div>

      <p className="text-gray-500 leading-relaxed mb-10 text-lg">
        {product.description || 'Nenhuma descrição disponível para este produto premium.'}
      </p>

      {/* Quantity & Add to Cart */}
      <div className="flex flex-col sm:flex-row gap-4 mb-12">
        <div className="flex items-center border border-gray-200 rounded-2xl h-16 px-4 bg-gray-50/50">
          <button 
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-emerald-900 transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-12 text-center font-bold text-lg text-gray-900">{quantity}</span>
          <button 
            onClick={() => setQuantity(quantity + 1)}
            className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-emerald-900 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={handleAddToCart}
          className={cn(
            "flex-1 h-16 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all transform active:scale-95 shadow-xl shadow-emerald-900/10",
            isAdded ? "bg-emerald-600 text-white" : "bg-emerald-900 text-white hover:bg-emerald-800"
          )}
        >
          {isAdded ? (
            <>
              <Check className="w-5 h-5" />
              ADICIONADO!
            </>
          ) : (
            <>
              <ShoppingBag className="w-5 h-5" />
              ADICIONAR AO CARRINHO
            </>
          )}
        </button>
      </div>

      {/* Trust Elements */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-10 border-t border-gray-100">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center shrink-0">
            <Truck className="w-5 h-5 text-emerald-900" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900">Envio Rápido</h4>
            <p className="text-[11px] text-gray-400">Entrega em todo o Brasil</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-emerald-900" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900">Compra Segura</h4>
            <p className="text-[11px] text-gray-400">Garantia total de qualidade</p>
          </div>
        </div>
      </div>
    </div>
  );
}
