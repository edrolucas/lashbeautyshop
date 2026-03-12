'use client';

import { ShoppingBag, Tag, ClipboardList, TrendingUp, Users } from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    { name: 'Vendas Totais', value: 'R$ 2.450,00', icon: TrendingUp, color: 'emerald' },
    { name: 'Pedidos Pendentes', value: '12', icon: ClipboardList, color: 'amber' },
    { name: 'Produtos Ativos', value: '24', icon: ShoppingBag, color: 'blue' },
    { name: 'Categorias', value: '5', icon: Tag, color: 'purple' },
  ];

  return (
    <div>
      <header className="mb-10">
        <h1 className="text-3xl font-serif font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Bem-vinda de volta ao seu painel de controle.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-emerald-900" />
              </div>
              <span className="text-sm font-medium text-gray-400">{stat.name}</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Recent Orders Placeholder */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-serif font-bold text-gray-900">Pedidos Recentes</h2>
          <button className="text-sm text-emerald-900 font-bold hover:underline">Ver todos</button>
        </div>
        <div className="p-8">
           <p className="text-center text-gray-400 py-10">Carregando dados dos pedidos...</p>
        </div>
      </div>
    </div>
  );
}
