'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, ShoppingBag, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { cn } from '@/lib/utils';

export function Header() {
  const pathname = usePathname();
  const { totalItems, setIsCartOpen, cartAnimating } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: 'INÍCIO', href: '/' },
    { name: 'PRODUTOS', href: '/produtos' },
  ];

  return (
    <>
      <header
        className={cn(
          'fixed top-0 z-50 w-full transition-all duration-500 py-4',
          scrolled
            ? 'glass-nav shadow-sm py-3'
            : 'bg-transparent'
        )}
      >
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          {/* Mobile Menu Button - Left on mobile */}
          <button
            className="lg:hidden p-2 text-brand-green hover:opacity-70 transition-opacity"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Abrir menu"
          >
            <Menu className="w-6 h-6 stroke-[1.5]" />
          </button>

          {/* Logo - Elegant Typography */}
          <Link href="/" className="flex flex-col items-center group">
            <span className="text-2xl font-serif font-bold tracking-tighter text-brand-green group-hover:opacity-80 transition-opacity">
              LASH BEAUTY
            </span>
            <span className="text-[10px] tracking-[0.3em] font-sans font-medium text-brand-gold uppercase -mt-1">
              Shop
            </span>
          </Link>

          {/* Desktop Navigation - Centered */}
          <nav className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  'text-xs tracking-[0.2em] transition-all hover:text-brand-gold relative group font-bold px-2 py-1',
                  pathname === link.href ? 'text-brand-green' : 'text-gray-500'
                )}
              >
                {link.name}
                <span
                  className={cn(
                    'absolute -bottom-1 left-0 h-[1.5px] bg-brand-gold transition-all duration-300',
                    pathname === link.href ? 'w-full' : 'w-0 group-hover:w-full'
                  )}
                />
              </Link>
            ))}
          </nav>

          {/* Icons - Right */}
          <div className="flex items-center gap-2 sm:gap-6">
            <Link 
              href="/produtos" 
              className="p-2 text-brand-green hover:text-brand-gold transition-colors hidden sm:inline-flex"
              aria-label="Pesquisar"
            >
              <Search className="w-5 h-5 stroke-[1.5]" />
            </Link>
            <button
              className={cn(
                'p-2 text-brand-green hover:text-brand-gold transition-colors relative',
                cartAnimating && 'animate-cart-ring'
              )}
              onClick={() => setIsCartOpen(true)}
              aria-label="Abrir carrinho"
            >
              <ShoppingBag
                className={cn(
                  'w-5 h-5 stroke-[1.5] transition-transform',
                  cartAnimating && 'animate-cart-bounce'
                )}
              />
              {totalItems > 0 && (
                <span
                  className={cn(
                    'absolute -top-0 -right-0 bg-brand-gold text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-sm',
                    cartAnimating && 'animate-cart-bounce'
                  )}
                >
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden animate-fade-in">
          <div
            className="absolute inset-0 bg-brand-green/20 backdrop-blur-md"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <div className="absolute top-0 left-0 h-full w-[80vw] bg-brand-nude shadow-2xl animate-slide-in-right flex flex-col origin-left">
            <div className="flex items-center justify-between p-8 border-b border-brand-green/5">
              <div className="flex flex-col">
                <span className="text-xl font-serif font-bold tracking-tighter text-brand-green">
                  LASH BEAUTY
                </span>
                <span className="text-[9px] tracking-[0.3em] font-sans font-medium text-brand-gold uppercase -mt-1">
                  Shop
                </span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-brand-green hover:opacity-50 transition-opacity"
              >
                <X className="w-6 h-6 stroke-[1.5]" />
              </button>
            </div>

            <nav className="flex flex-col gap-2 p-6 flex-1 pt-12">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    'px-6 py-5 rounded-2xl text-lg font-serif transition-all flex items-center justify-between group',
                    pathname === link.href
                      ? 'bg-brand-green text-white shadow-xl shadow-brand-green/20'
                      : 'text-brand-green hover:bg-brand-green/5'
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                  {pathname !== link.href && <span className="w-1.5 h-1.5 bg-brand-gold rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />}
                </Link>
              ))}
            </nav>

            <div className="p-8 border-t border-brand-green/5">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsCartOpen(true);
                }}
                className="w-full flex items-center justify-center gap-3 bg-brand-gold text-white px-6 py-5 rounded-2xl font-bold transition-all hover:bg-brand-gold/90 shadow-lg shadow-brand-gold/20"
              >
                <ShoppingBag className="w-5 h-5 stroke-[2]" />
                Carrinho {totalItems > 0 && `(${totalItems})`}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
