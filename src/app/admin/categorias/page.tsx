'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Check, Loader2 } from 'lucide-react';
import { getCategories, createCategory, updateCategory, deleteCategory, Category } from '@/lib/db';

export default function CategoriesAdmin() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error(error);
      alert('Erro ao carregar categorias.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (category: Category | null = null) => {
    setEditingCategory(category);
    setCategoryName(category ? category.name : '');
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!categoryName.trim()) return;
    setActionLoading(true);

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, categoryName);
      } else {
        await createCategory(categoryName);
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar categoria.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta categoria?')) {
      try {
        await deleteCategory(id);
        fetchCategories();
      } catch (error) {
        console.error(error);
        alert('Erro ao excluir categoria. Verifique se existem produtos vinculados a ela.');
      }
    }
  };

  return (
    <div>
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900">Gerenciar Categorias</h1>
          <p className="text-gray-500">Adicione ou edite as categorias de produtos da sua loja.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-emerald-900 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-800 transition-all active:scale-95 shadow-lg shadow-emerald-900/20"
        >
          <Plus className="w-5 h-5" />
          Nova Categoria
        </button>
      </header>

      {/* Categories Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-emerald-900 animate-spin" />
          </div>
        ) : categories.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-gray-400">Nenhuma categoria encontrada.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-gray-400">ID</th>
                  <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-gray-400">Nome</th>
                  <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-gray-400 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-5 text-sm text-gray-400 font-mono">#{cat.id.slice(0, 8)}</td>
                    <td className="px-8 py-5 text-sm font-bold text-gray-900">{cat.name}</td>
                    <td className="px-8 py-5 text-right space-x-2">
                      <button 
                        onClick={() => handleOpenModal(cat)}
                        className="p-2 text-gray-400 hover:text-emerald-900 hover:bg-emerald-50 rounded-lg transition-all"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(cat.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-emerald-950/20 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 overflow-hidden">
             <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-serif font-bold text-emerald-900">
                   {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-900">
                   <X className="w-6 h-6" />
                </button>
             </div>
             
             <div className="space-y-6">
                <div>
                   <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Nome da Categoria</label>
                   <input 
                      type="text" 
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                      placeholder="Ex: Cílios Postiços"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-900/10 focus:border-emerald-900 transition-all font-medium text-gray-900"
                   />
                </div>
                
                <button 
                   onClick={handleSave}
                   disabled={actionLoading}
                   className="w-full bg-emerald-900 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-800 transition-all shadow-lg shadow-emerald-900/20 disabled:opacity-70"
                >
                   {actionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                   {editingCategory ? 'Salvar Alterações' : 'Criar Categoria'}
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
