'use client';

import { useState, useEffect } from 'react';
import { ShoppingBag, Tag, ClipboardList, TrendingUp, Download, CheckCircle, Clock, Loader2, RefreshCw, Settings, Trash2, X, Filter } from 'lucide-react';
import { getDashboardStats, getOrders, getProducts, getCategories, Order, resetDashboardData } from '@/lib/db';
import { cn } from '@/lib/utils';
import ExcelJS from 'exceljs';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalSales: 0,
    monthlyApprovedSales: 0,
    pendingOrders: 0,
    confirmedOrders: 0,
    totalOrders: 0
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [productCount, setProductCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);

  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsData, ordersData, productsData, categoriesData] = await Promise.all([
        getDashboardStats(),
        getOrders(),
        getProducts(),
        getCategories()
      ]);
      setStats(statsData);
      setRecentOrders(ordersData.slice(0, 5));
      setProductCount(productsData.length);
      setCategoryCount(categoriesData.length);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateExcelReport = async () => {
    try {
      // Fetch all orders and sort by most recent
      const allOrders = await getOrders();
      const approvedOrders = allOrders
        .filter(o => o.status === 'confirmed')
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      if (approvedOrders.length === 0) {
        alert('Não há vendas aprovadas para gerar relatório.');
        return;
      }

      // Create workbook and worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Relatório de Vendas');

      // Define columns
      worksheet.columns = [
        { header: 'Pedido', key: 'id', width: 15 },
        { header: 'Data/Hora', key: 'date', width: 20 },
        { header: 'Cliente', key: 'client', width: 25 },
        { header: 'Produtos', key: 'products', width: 50 },
        { header: 'Total', key: 'total', width: 15 },
      ];

      // Style header row
      const headerRow = worksheet.getRow(1);
      headerRow.font = { bold: true };
      headerRow.alignment = { vertical: 'middle', horizontal: 'center' };

      // Add data rows
      let totalGeneral = 0;
      approvedOrders.forEach(order => {
        const total = Number(order.total_price);
        totalGeneral += total;

        const row = worksheet.addRow({
          id: `#${order.id.split('-')[0].toUpperCase()}`,
          date: new Date(order.created_at).toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          }).replace(',', ' -'),
          client: order.customer_name,
          products: order.products.map(p => `• ${p.quantity}x ${p.name}`).join('\n'), // Use actual line breaks
          total: `R$ ${total.toFixed(2).replace('.', ',')}`
        });

        // Style cells
        row.getCell('client').font = { bold: true }; // Client name in BOLD
        row.getCell('products').alignment = { wrapText: true, vertical: 'top' }; // Multi-line PRODUCTS
        row.getCell('total').alignment = { horizontal: 'right' };
      });

      // Add summary row (Total Geral)
      const footerRow = worksheet.addRow({
        id: '',
        date: '',
        client: 'TOTAL GERAL',
        products: '',
        total: `R$ ${totalGeneral.toFixed(2).replace('.', ',')}`
      });

      // Style summary row
      footerRow.font = { bold: true };
      footerRow.getCell('total').alignment = { horizontal: 'right' };
      footerRow.getCell('client').alignment = { horizontal: 'right' };

      // Generate buffer and trigger download
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Relatorio_Vendas_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating excel:', error);
      alert('Erro ao gerar relatório Excel.');
    }
  };

  const handleResetDashboard = async () => {
    if (!confirm('AVISO CRÍTICO: Issole apagará PERMANENTEMENTE todos os pedidos aprovados do histórico para zerar o dashboard. Deseja continuar?')) return;
    
    setResetLoading(true);
    try {
      await resetDashboardData();
      await fetchDashboardData();
      setIsResetModalOpen(false);
      alert('Dashboard resetado com sucesso.');
    } catch (error) {
      console.error(error);
      alert('Erro ao resetar dashboard.');
    } finally {
      setResetLoading(false);
    }
  };

  const dashboardStats = [
    { 
      name: 'Vendas Totais (Aprovadas)', 
      value: `R$ ${stats.totalSales.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 
      icon: TrendingUp, 
      color: 'emerald' 
    },
    { 
      name: 'Vendas do Mês (Aprovadas)', 
      value: `R$ ${stats.monthlyApprovedSales.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 
      icon: CheckCircle, 
      color: 'blue' 
    },
    { 
      name: 'Pedidos Pendentes', 
      value: stats.pendingOrders.toString(), 
      icon: Clock, 
      color: 'amber' 
    },
    { 
      name: 'Pedidos Aprovados', 
      value: stats.confirmedOrders.toString(), 
      icon: ClipboardList, 
      color: 'emerald' 
    },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-12 h-12 text-emerald-900 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Carregando painel...</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Acompanhe o desempenho da sua loja em tempo real.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsResetModalOpen(true)}
            className="bg-white text-gray-600 border border-gray-100 p-3 rounded-xl hover:bg-gray-50 transition-all shadow-sm group"
            title="Configurações do Dashboard"
          >
            <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
          </button>
          <button
            onClick={generateExcelReport}
            className="bg-emerald-900 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-800 transition-all active:scale-95 shadow-lg shadow-emerald-900/20"
          >
            <Download className="w-5 h-5" />
            Gerar Relatório .xlsx
          </button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {dashboardStats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                stat.color === 'emerald' ? 'bg-emerald-50' : 
                stat.color === 'amber' ? 'bg-amber-50' : 'bg-blue-50'
              }`}>
                <stat.icon className={`w-5 h-5 ${
                  stat.color === 'emerald' ? 'text-emerald-900' : 
                  stat.color === 'amber' ? 'text-amber-600' : 'text-blue-600'
                }`} />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400">{stat.name}</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-xl font-serif font-bold text-gray-900">Pedidos Recentes</h2>
            <a href="/admin/pedidos" className="text-sm text-emerald-900 font-bold hover:underline">Ver todos</a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Cliente</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Data</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-900">{order.customer_name}</p>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">
                      {new Date(order.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        order.status === 'confirmed' ? 'bg-emerald-100 text-emerald-900' :
                        order.status === 'deleted' ? 'bg-red-100 text-red-900' : 'bg-amber-100 text-amber-900'
                      }`}>
                        {order.status === 'confirmed' ? 'Aprovado' :
                         order.status === 'deleted' ? 'Cancelado' : 'Pendente'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900 text-right">
                      R$ {Number(order.total_price).toFixed(2).replace('.', ',')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Info Cards */}
        <div className="space-y-6">
          <div className="bg-emerald-900 text-white p-8 rounded-3xl shadow-lg relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-emerald-300 text-xs font-bold uppercase tracking-widest mb-2">Produtos no Catálogo</p>
              <h3 className="text-4xl font-serif font-bold">{productCount}</h3>
              <a href="/admin/produtos" className="inline-flex items-center gap-2 mt-6 text-sm font-bold hover:gap-3 transition-all">
                Gerenciar produtos <ShoppingBag className="w-4 h-4" />
              </a>
            </div>
            <ShoppingBag className="absolute -bottom-4 -right-4 w-32 h-32 text-emerald-800 opacity-20 group-hover:scale-110 transition-transform duration-500" />
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group">
             <div className="relative z-10">
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Categorias Ativas</p>
              <h3 className="text-4xl font-serif font-bold text-gray-900">{categoryCount}</h3>
              <a href="/admin/categorias" className="inline-flex items-center gap-2 mt-6 text-sm font-bold text-emerald-900 hover:gap-3 transition-all">
                Ver categorias <Tag className="w-4 h-4" />
              </a>
            </div>
            <Tag className="absolute -bottom-4 -right-4 w-32 h-32 text-gray-50 opacity-10 group-hover:scale-110 transition-transform duration-500" />
          </div>
        </div>
      </div>
      {/* Reset Modal */}
      {isResetModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-emerald-950/20 backdrop-blur-sm" onClick={() => setIsResetModalOpen(false)} />
          <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 overflow-hidden animate-in zoom-in duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-serif font-bold text-emerald-900">Configurações</h3>
              <button onClick={() => setIsResetModalOpen(false)} className="text-gray-400 hover:text-gray-900">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                <h4 className="flex items-center gap-2 text-amber-800 font-bold text-sm mb-2">
                  <RefreshCw className="w-4 h-4" /> Resetar Dashboard
                </h4>
                <p className="text-xs text-amber-700/80 leading-relaxed mb-4">
                  Isso apagará todos os pedidos "Aprovados" para recomeçar o contador do zero. Pedidos pendentes e cancelados não serão afetados.
                </p>
                <button
                  onClick={handleResetDashboard}
                  disabled={resetLoading}
                  className="w-full bg-amber-100 text-amber-800 py-3 rounded-xl text-xs font-bold hover:bg-amber-200 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  {resetLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  LIMPAR DADOS AGORA
                </button>
              </div>

              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                <h4 className="flex items-center gap-2 text-emerald-800 font-bold text-sm mb-2">
                  <Filter className="w-4 h-4" /> Visualização Mensal
                </h4>
                <p className="text-xs text-emerald-700/80 leading-relaxed">
                  O dashboard já prioriza as vendas do mês vigente automaticamente nos indicadores principais.
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsResetModalOpen(false)}
              className="w-full mt-8 py-4 bg-gray-50 text-gray-500 font-bold rounded-2xl hover:bg-gray-100 transition-all"
            >
              FECHAR
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
