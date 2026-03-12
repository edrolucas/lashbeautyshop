'use client';

import Link from 'next/link';
import { Truck, ShieldCheck, Heart } from 'lucide-react';
import Image from 'next/image';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 pt-16 pb-8 border-t border-gray-100">
      <div className="container mx-auto px-4">
        {/* Value Propositions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
              <Truck className="w-6 h-6 text-emerald-900" />
            </div>
            <h3 className="font-serif font-bold text-lg mb-2">Envio Rápido</h3>
            <p className="text-gray-500 text-sm">Entregamos com agilidade em todo o Brasil para sua conveniência.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6 text-emerald-900" />
            </div>
            <h3 className="font-serif font-bold text-lg mb-2">Qualidade Premium</h3>
            <p className="text-gray-500 text-sm">Apenas produtos selecionados e testados pelas melhores profissionais.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
              <Heart className="w-6 h-6 text-emerald-900" />
            </div>
            <h3 className="font-serif font-bold text-lg mb-2">Satisfação Garantida</h3>
            <p className="text-gray-500 text-sm">Sua satisfação é nossa prioridade absoluta em cada compra.</p>
          </div>
        </div>

        {/* Links Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 border-t border-gray-200 pt-12">
          <div className="md:col-span-1">
            <Link href="/" className="relative w-32 h-12 flex items-center mb-4">
              <Image 
                src="/logo_original.png" 
                alt="Lash Beauty Shop Logo" 
                fill 
                className="object-contain" 
              />
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed">
              Especialistas em produtos premium para cílios e sobrancelhas. Elevando sua beleza e autoestima com sofisticação.
            </p>
          </div>
          
          <div>
            <h4 className="font-serif font-bold mb-6">Explorar</h4>
            <ul className="space-y-4">
              <li><Link href="/" className="text-gray-500 hover:text-emerald-900 transition-colors text-sm">Início</Link></li>
              <li><Link href="/produtos" className="text-gray-500 hover:text-emerald-900 transition-colors text-sm">Produtos</Link></li>
              <li><Link href="/produtos?categoria=cilios" className="text-gray-500 hover:text-emerald-900 transition-colors text-sm">Cílios</Link></li>
              <li><Link href="/produtos?categoria=sobrancelhas" className="text-gray-500 hover:text-emerald-900 transition-colors text-sm">Sobrancelhas</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-bold mb-6">Atendimento</h4>
            <ul className="space-y-4 text-sm">
              <li className="text-gray-500">Segunda à Sexta, 08h às 18h</li>
              <li>
                <a href="https://wa.me/5583993238255" target="_blank" className="text-emerald-900 font-medium hover:underline">
                  +55 83 99323-8255
                </a>
              </li>
              <li className="text-gray-500">João Pessoa, Paraíba</li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-bold mb-6">Siga-nos</h4>
            <div className="flex gap-4">
              <Link href="#" className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:border-emerald-900 hover:text-emerald-900 transition-all">
                <span className="sr-only">Instagram</span>
                {/* Social icons could go here */}
                I
              </Link>
              <Link href="#" className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:border-emerald-900 hover:text-emerald-900 transition-all">
                <span className="sr-only">Facebook</span>
                F
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 pt-8 flex flex-col md:row items-center justify-between gap-4">
          <p className="text-gray-400 text-xs">
            © {currentYear} Lash Beauty Shop. Todos os direitos reservados.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-gray-400 hover:text-emerald-900 text-xs">Termos de Uso</Link>
            <Link href="#" className="text-gray-400 hover:text-emerald-900 text-xs">Privacidade</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
