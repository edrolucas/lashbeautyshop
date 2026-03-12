'use client';

import { X, Minus, Plus, ShoppingBag, Send } from 'lucide-react';
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
        className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity" 
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md pointer-events-auto">
          <div className="h-full flex flex-col bg-white shadow-2xl">
            {/* Header */}
            <div className="px-6 py-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-serif font-bold text-emerald-900">Meu Carrinho</h2>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="p-2 text-gray-400 hover:text-emerald-900 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
                  <ShoppingBag className="w-16 h-16 mb-4 text-gray-300" />
                  <p className="text-gray-500">Seu carrinho está vazio.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="relative w-24 h-24 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                        {item.image_url ? (
                          <Image
                            src={item.image_url}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">Sem Imagem</div>
                        )}
                      </div>
                      <div className="flex-1 flex flex-col">
                        <div className="flex justify-between">
                          <h3 className="text-sm font-medium text-gray-900 leading-tight">{item.name}</h3>
                          <p className="text-sm font-bold text-emerald-900 ml-2">R$ {item.price.toFixed(2)}</p>
                        </div>
                        <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">Ref: {item.id.slice(0, 8)}</p>
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center border border-gray-200 rounded-md">
                            <button 
                              className="p-1 hover:bg-gray-50 text-gray-500"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-xs font-medium">{item.quantity}</span>
                            <button 
                              className="p-1 hover:bg-gray-50 text-gray-500"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <button 
                            className="text-xs text-red-400 hover:text-red-600 transition-colors underline underline-offset-2"
                            onClick={() => removeFromCart(item.id)}
                          >
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
              <div className="px-6 py-8 border-t border-gray-100 bg-gray-50/50">
                <div className="mb-6">
                  <label htmlFor="customerName" className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
                    Seu Nome *
                  </label>
                  <input
                    type="text"
                    id="customerName"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Como podemos te chamar?"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-900/10 focus:border-emerald-900 transition-all"
                  />
                </div>
                <div className="flex items-center justify-between mb-8">
                  <span className="text-sm text-gray-500">Valor Total</span>
                  <span className="text-2xl font-serif font-bold text-emerald-900">R$ {totalPrice.toFixed(2)}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-mint-400 hover:bg-mint-500 text-emerald-900 font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all transform active:scale-95 shadow-lg shadow-mint-400/20"
                >
                  <Send className="w-5 h-5" />
                  FINALIZAR NO WHATSAPP
                </button>
                <p className="mt-4 text-center text-[10px] text-gray-400 leading-relaxed">
                  Ao clicar em finalizar, você será redirecionado para o WhatsApp para confirmar seu pedido.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
