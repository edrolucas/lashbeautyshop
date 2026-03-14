'use client';

import { X, Minus, Plus, ShoppingBag, Send, Trash2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useState } from 'react';
import { createOrder } from '@/lib/db';

export function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const [customerName, setCustomerName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCheckout = async () => {
    if (!customerName) {
      alert('Por favor, informe seu nome para finalizar o pedido.');
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Save order to Supabase
      await createOrder({
        customer_name: customerName,
        products: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        total_price: totalPrice,
        status: 'pending'
      });

      // 2. Prepare WhatsApp message
      const itemsList = cart.map(item => `- ${item.name} (${item.quantity}x) - R$ ${(item.price * item.quantity).toFixed(2)}`).join('\n');
      const message = `Olá! Gostaria de finalizar o meu pedido na Lash Beauty Shop:\n\n*Nome:* ${customerName}\n\n*Produtos:*\n${itemsList}\n\n*Total:* R$ ${totalPrice.toFixed(2)}`;
      
      const encodedMessage = encodeURIComponent(message);
      
      // 3. Clear cart and redirect
      clearCart();
      setIsCartOpen(false);
      window.open(`https://wa.me/5583993238255?text=${encodedMessage}`, '_blank');
    } catch (error) {
      console.error(error);
      alert('Erro ao processar seu pedido. Por favor, tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-brand-green/20 backdrop-blur-md transition-opacity duration-700" 
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md pointer-events-auto">
          <div className="h-full flex flex-col bg-brand-nude shadow-[0_0_100px_rgba(6,78,59,0.1)] relative">
            {/* Header */}
            <div className="px-8 py-10 border-b border-brand-beige flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-serif font-bold text-brand-green tracking-tighter">Meu Carrinho</h2>
                <p className="text-[10px] text-brand-gold uppercase tracking-[0.2em] font-bold mt-1">Sua seleção premium</p>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="w-12 h-12 rounded-full border border-brand-beige flex items-center justify-center text-brand-green/40 hover:text-brand-green hover:border-brand-green transition-all duration-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-8 py-8 no-scrollbar">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 rounded-full bg-brand-beige flex items-center justify-center mb-6">
                    <ShoppingBag className="w-8 h-8 text-brand-gold" />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-brand-green mb-2">Está vazio?</h3>
                  <p className="text-brand-green/40 text-xs font-medium max-w-[180px]">Explore nossa coleção e encontre o olhar perfeito.</p>
                </div>
              ) : (
                <div className="space-y-10">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-6 group">
                      <div className="relative w-24 h-24 bg-white rounded-3xl overflow-hidden shadow-sm border border-brand-beige flex-shrink-0 transition-transform duration-500 group-hover:scale-105">
                        {item.image_url ? (
                          <Image
                            src={item.image_url}
                            alt={item.name}
                            fill
                            className="object-contain p-2"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-brand-green/10">
                             <ShoppingBag className="w-8 h-8" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 flex flex-col">
                        <div className="flex justify-between items-start">
                          <h3 className="text-sm font-serif font-bold text-brand-green leading-tight pr-4">{item.name}</h3>
                          <p className="text-sm font-bold text-brand-green tracking-tighter">R$ {item.price.toFixed(2)}</p>
                        </div>
                        <p className="text-[9px] text-brand-gold font-bold uppercase tracking-[0.2em] mt-2 mb-4">Ref: {item.id.slice(0, 8)}</p>
                        
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center bg-white border border-brand-beige rounded-full p-1 shadow-sm">
                            <button 
                              className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-brand-beige text-brand-green/30 hover:text-brand-green transition-all"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-xs font-bold text-brand-green">{item.quantity}</span>
                            <button 
                              className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-brand-beige text-brand-green/30 hover:text-brand-green transition-all"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <button 
                            className="text-[10px] text-brand-green/30 hover:text-rose-500 font-bold uppercase tracking-widest transition-colors flex items-center gap-1"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                            Remover
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer / Checkout */}
            {cart.length > 0 && (
              <div className="px-8 py-10 border-t border-brand-beige bg-white/40 backdrop-blur-sm">
                <div className="mb-10">
                  <label htmlFor="customerName" className="block text-[10px] font-bold text-brand-gold uppercase tracking-[0.3em] mb-4">
                    Seu Nome para o Pedido
                  </label>
                  <input
                    type="text"
                    id="customerName"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Ex: Ismênia Oliveira"
                    className="w-full px-6 py-5 bg-white border border-brand-beige rounded-full text-xs font-bold uppercase tracking-widest text-brand-green placeholder:text-brand-green/20 focus:outline-none focus:border-brand-green transition-all shadow-sm"
                  />
                </div>
                <div className="flex items-center justify-between mb-10">
                  <span className="text-[10px] font-bold text-brand-green/30 uppercase tracking-[0.2em]">Total do Investimento</span>
                  <span className="text-3xl font-serif font-bold text-brand-green tracking-tighter">R$ {totalPrice.toFixed(2).replace('.', ',')}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={isSubmitting}
                  className="w-full bg-brand-green hover:bg-brand-gold text-white font-bold py-5 rounded-full flex items-center justify-center gap-4 transition-all transform active:scale-95 shadow-2xl shadow-brand-green/20 text-xs tracking-[0.2em] uppercase"
                >
                  <Send className="w-5 h-5 stroke-[2.5]" />
                  {isSubmitting ? 'Gerando Pedido...' : 'Finalizar no WhatsApp'}
                </button>
                <p className="mt-6 text-center text-[9px] text-brand-green/30 uppercase tracking-widest leading-relaxed font-bold">
                  Finalize para receber o atendimento exclusivo via chat.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
