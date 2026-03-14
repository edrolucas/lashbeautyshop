'use client';

import Link from 'next/link';
import { MapPin, Clock, Instagram, Send } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-green text-brand-nude">
      {/* Main Footer Grid */}
      <div className="container mx-auto px-6 py-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16">

          {/* Column 1: Brand & About */}
          <div className="flex flex-col">
            <Link href="/" className="flex flex-col mb-8 group">
              <span className="text-2xl font-serif font-bold tracking-tighter text-white transition-opacity group-hover:opacity-80">
                LASH BEAUTY
              </span>
              <span className="text-[10px] tracking-[0.3em] font-sans font-medium text-brand-gold uppercase -mt-1">
                Shop
              </span>
            </Link>
            <p className="text-brand-nude/60 text-sm leading-relaxed mb-10 max-w-xs">
              Sua boutique premium para cílios e sobrancelhas. Sofisticação e qualidade em cada detalhe para realçar seu olhar.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3 text-xs text-brand-nude/80 tracking-wide">
                <MapPin className="w-4 h-4 text-brand-gold mt-0.5 flex-shrink-0" />
                <span>Rua Dinamérica Correia, 12 - Campina Grande/PB</span>
              </div>
              <div className="flex items-start gap-3 text-xs text-brand-nude/80 tracking-wide">
                <Clock className="w-4 h-4 text-brand-gold mt-0.5 flex-shrink-0" />
                <div>
                  <p>Seg a Sex: 08:00 às 17:00</p>
                  <p>Sábado: 08:00 às 13:00</p>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Social Media */}
          <div>
            <h4 className="font-serif font-bold text-white mb-10 text-lg">Conecte-se</h4>
            <div className="flex flex-col gap-6">
              <a
                href="https://www.instagram.com/lashbeautyshopcg/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 transition-all"
              >
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-brand-gold group-hover:border-brand-gold transition-all duration-500">
                  <Instagram className="w-5 h-5 text-brand-gold group-hover:text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white tracking-widest uppercase">Instagram</p>
                  <p className="text-[11px] text-brand-nude/40">@lashbeautyshopcg</p>
                </div>
              </a>

              <a
                href="https://wa.me/5583993238255"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 transition-all"
              >
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-brand-gold group-hover:border-brand-gold transition-all duration-500">
                  <WhatsAppIcon className="w-5 h-5 text-brand-gold group-hover:text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white tracking-widest uppercase">WhatsApp</p>
                  <p className="text-[11px] text-brand-nude/40">+55 83 9.9323-8255</p>
                </div>
              </a>
            </div>
          </div>

          {/* Column 3: Quick Navigation */}
          <div>
            <h4 className="font-serif font-bold text-white mb-10 text-lg">Menu</h4>
            <ul className="space-y-4">
              {[
                { label: 'Início', href: '/' },
                { label: 'Produtos', href: '/produtos' },
                { label: 'Termos & Privacidade', href: '#' },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-brand-nude/50 hover:text-brand-gold transition-colors text-xs tracking-widest uppercase font-bold flex items-center gap-3 group"
                  >
                    <span className="w-1.5 h-[1px] bg-brand-gold scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5 mx-6">
        <div className="container mx-auto py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-brand-nude/30 text-[10px] tracking-widest uppercase font-medium">
            © {currentYear} Lash Beauty Shop. Feito com amor por Profissionais.
          </p>
          <div className="flex items-center gap-8">
            <span className="text-[10px] text-brand-nude/20 tracking-[0.2em] font-bold uppercase">Cartões Aceitos:</span>
            <div className="flex gap-3 opacity-30 grayscale brightness-200">
               {/* Simplified card icons could go here */}
               <div className="w-8 h-5 bg-white/20 rounded-sm" />
               <div className="w-8 h-5 bg-white/20 rounded-sm" />
               <div className="w-8 h-5 bg-white/20 rounded-sm" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}
