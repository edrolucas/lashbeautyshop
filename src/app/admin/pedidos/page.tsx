'use client';

import { useState, useEffect } from 'react';
import { ClipboardList, CheckCircle, XCircle, Clock, Search, Eye, Loader2, Trash2 } from 'lucide-react';
import { getOrders, updateOrderStatus, deleteOrder, Order } from '@/lib/db';
import { cn } from '@/lib/utils';

export default function OrdersAdmin() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (error) {
      console.error(error);
      alert('Erro ao carregar pedidos.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: 'pending' | 'confirmed' | 'deleted') => {
    try {
      await updateOrderStatus(id, status);
      fetchOrders();
    } catch (error) {
      console.error(error);
      alert('Erro ao atualizar status.');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja apagar este pedido?')) {
      try {
        await deleteOrder(id);
        fetchOrders();
      } catch (error) {
        console.error(error);
        alert('Erro ao apagar pedido.');
      }
    }
  };

  const filteredOrders = orders.filter(order => 
    order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-900 rounded-full text-[10px] font-bold uppercase tracking-wider"><CheckCircle className="w-3 h-3" /> Confirmado</span>;
      case 'deleted':
        return <span className="flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-900 rounded-full text-[10px] font-bold uppercase tracking-wider"><XCircle className="w-3 h-3" /> Cancelado</span>;
      default:
        return <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-[10px] font-bold uppercase tracking-wider"><Clock className="w-3 h-3" /> Pendente</span>;
    }
  };

  return (
    <div>
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900">Gerenciar Pedidos</h1>
          <p className="text-gray-500">Acompanhe e controle todas as vendas da sua loja.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar por cliente ou ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 pr-6 py-3 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-900/10 focus:border-emerald-900 outline-none w-full md:w-80 transition-all shadow-sm"
          />
        </div>
      </header>

      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden min-h-[500px]">
        {loading ? (
          <div className="flex items-center justify-center py-40">
            <Loader2 className="w-10 h-10 text-emerald-900 animate-spin" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-40 text-center">
             <ClipboardList className="w-12 h-12 text-gray-100 mx-auto mb-4" />
             <p className="text-gray-400">Nenhum pedido encontrado.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-gray-400">ID & Data</th>
                  <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-gray-400">Cliente</th>
                  <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-gray-400">Produtos</th>
                  <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-gray-400">Total</th>
                  <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-gray-400">Status</th>
                  <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-gray-400 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <p className="text-xs font-mono text-gray-400 uppercase leading-none mb-1">#{order.id.slice(0, 8)}</p>
                      <p className="text-xs text-gray-500 font-medium">{new Date(order.created_at).toLocaleDateString('pt-BR')} às {new Date(order.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                    </td>
                    <td className="px-8 py-6">
                      <p className="font-bold text-gray-900">{order.customer_name}</p>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex flex-col gap-1 max-w-[200px]">
                          {order.products.map((item, idx) => (
                             <p key={idx} className="text-[11px] text-gray-500 truncate">
                                <span className="font-bold text-emerald-900">{item.quantity}x</span> {item.name}
                             </p>
                          ))}
                       </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="font-bold text-emerald-900">R$ {Number(order.total_price).toFixed(2).replace('.', ',')}</p>
                    </td>
                    <td className="px-8 py-6">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-8 py-6 text-right">
                       <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         {order.status !== 'confirmed' && (
                           <button 
                             onClick={() => handleStatusChange(order.id, 'confirmed')}
                             className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all" 
                             title="Confirmar Pedido"
                           >
                             <CheckCircle className="w-5 h-5" />
                           </button>
                         )}
                         {order.status !== 'deleted' && (
                           <button 
                             onClick={() => handleStatusChange(order.id, 'deleted')}
                             className="p-2 text-amber-600 hover:bg-amber-50 rounded-xl transition-all" 
                             title="Cancelar Pedido"
                           >
                             <XCircle className="w-5 h-5" />
                           </button>
                         )}
                         <button 
                           onClick={() => handleDelete(order.id)}
                           className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-all" 
                           title="Excluir Definitivamente"
                         >
                           <Trash2 className="w-5 h-5" />
                         </button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
