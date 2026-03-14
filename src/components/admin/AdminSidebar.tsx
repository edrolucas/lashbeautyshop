'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Tag, ShoppingBag, ClipboardList, LogOut, ChevronLeft, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AdminSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Categorias', href: '/admin/categorias', icon: Tag },
    { name: 'Produtos', href: '/admin/produtos', icon: ShoppingBag },
    { name: 'Destaques', href: '/admin/destaques', icon: Star },
    { name: 'Pedidos', href: '/admin/pedidos', icon: ClipboardList },
  ];

  return (
    <aside className="w-64 bg-emerald-900 text-white flex flex-col h-screen fixed left-0 top-0 z-[100]">
      <div className="p-8 border-b border-emerald-800 flex items-center gap-3">
        <div className="w-8 h-8 bg-mint-400 rounded-lg flex items-center justify-center">
           <span className="text-emerald-900 font-bold text-xs">LB</span>
        </div>
        <div>
          <h1 className="font-serif font-bold text-lg leading-tight">Admin</h1>
          <p className="text-[10px] uppercase tracking-widest text-emerald-300">Lash Beauty Shop</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-8 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all group",
              pathname === item.href 
                ? "bg-white text-emerald-900 font-bold shadow-lg shadow-black/10" 
                : "text-emerald-100/60 hover:bg-emerald-800/50 hover:text-white"
            )}
          >
            <item.icon className={cn("w-5 h-5", pathname === item.href ? "text-emerald-900" : "text-emerald-300/50 group-hover:text-emerald-300")} />
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-emerald-800">
        <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-emerald-300 hover:text-white transition-colors">
          <ChevronLeft className="w-4 h-4" />
          Voltar para a Loja
        </Link>
        <button 
          onClick={() => {
            import('@/lib/supabase').then(({ supabase }) => supabase.auth.signOut());
          }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-300 hover:bg-red-500/10 hover:text-red-400 transition-colors mt-2 text-left"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      </div>
    </aside>
  );
}
