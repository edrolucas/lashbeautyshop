'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Check, Image as ImageIcon, Loader2 } from 'lucide-react';
import { getProducts, getCategories, createProduct, updateProduct, deleteProduct, Product, Category } from '@/lib/db';
import Image from 'next/image';

export default function ProductsAdmin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    image_url: '',
    category_id: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsData, categoriesData] = await Promise.all([
        getProducts(),
        getCategories()
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
      if (categoriesData.length > 0) {
        setFormData(prev => ({ ...prev, category_id: categoriesData[0].id }));
      }
    } catch (error) {
      console.error(error);
      alert('Erro ao carregar dados.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product: Product | null = null) => {
    setEditingProduct(product);
    if (product) {
       setFormData({
          name: product.name,
          price: product.price.toString(),
          description: product.description,
          image_url: product.image_url,
          category_id: product.category_id
       });
    } else {
       setFormData({
          name: '',
          price: '',
          description: '',
          image_url: '',
          category_id: categories[0]?.id || ''
       });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.price || !formData.category_id) return;
    setActionLoading(true);

    const priceNum = parseFloat(formData.price);
    const updatedData = {
       name: formData.name,
       price: priceNum,
       description: formData.description,
       image_url: formData.image_url,
       category_id: formData.category_id
    };

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, updatedData);
      } else {
        await createProduct(updatedData);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar produto.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await deleteProduct(id);
        fetchData();
      } catch (error) {
        console.error(error);
        alert('Erro ao excluir produto.');
      }
    }
  };

  return (
    <div>
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900">Gerenciar Produtos</h1>
          <p className="text-gray-500">Adicione, edite ou remova produtos do seu catálogo.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-emerald-900 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-800 transition-all active:scale-95 shadow-lg shadow-emerald-900/20"
        >
          <Plus className="w-5 h-5" />
          Novo Produto
        </button>
      </header>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-emerald-900 animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="py-20 text-center text-gray-400 text-sm">Nenhum produto cadastrado.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-gray-400">Produto</th>
                  <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-gray-400">Categoria</th>
                  <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-gray-400">Preço</th>
                  <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-gray-400 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-gray-50 rounded-lg overflow-hidden relative flex-shrink-0 flex items-center justify-center border border-gray-100">
                            {product.image_url ? (
                               <Image src={product.image_url} alt={product.name} fill className="object-cover" />
                            ) : (
                               <ImageIcon className="w-5 h-5 text-gray-300" />
                            )}
                         </div>
                         <div>
                            <p className="text-sm font-bold text-gray-900">{product.name}</p>
                            <p className="text-[10px] text-gray-400 font-mono uppercase">#{product.id.slice(0, 8)}</p>
                         </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm">
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-900 rounded-lg text-xs font-bold">
                        {categories.find(c => c.id === product.category_id)?.name || 'N/A'}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-sm font-bold text-gray-900">R$ {Number(product.price).toFixed(2)}</td>
                    <td className="px-8 py-5 text-right space-x-2">
                      <button 
                        onClick={() => handleOpenModal(product)}
                        className="p-2 text-gray-400 hover:text-emerald-900 hover:bg-emerald-50 rounded-lg transition-all"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
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

      {/* Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-emerald-950/20 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl p-8 overflow-hidden max-h-[90vh] overflow-y-auto">
             <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-serif font-bold text-emerald-900">
                   {editingProduct ? 'Editar Produto' : 'Novo Produto'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-900">
                   <X className="w-6 h-6" />
                </button>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                   <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Nome do Produto</label>
                   <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-900/10 focus:border-emerald-900 outline-none transition-all text-gray-900 font-medium"
                   />
                </div>
                
                <div>
                   <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Preço (R$)</label>
                   <input 
                      type="number" 
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-900/10 focus:border-emerald-900 outline-none transition-all text-gray-900 font-medium"
                   />
                </div>
                
                <div>
                   <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Categoria</label>
                   <select 
                      value={formData.category_id}
                      onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-900/10 focus:border-emerald-900 outline-none transition-all text-gray-900 font-medium"
                   >
                      <option value="">Selecione uma categoria</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                   </select>
                </div>

                <div className="md:col-span-2">
                   <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">URL da Imagem</label>
                   <input 
                      type="text" 
                      value={formData.image_url}
                      onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-900/10 focus:border-emerald-900 outline-none transition-all text-gray-900 font-medium"
                   />
                </div>

                <div className="md:col-span-2">
                   <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Descrição</label>
                   <textarea 
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-900/10 focus:border-emerald-900 outline-none resize-none transition-all text-gray-900 font-medium"
                   />
                </div>
                
                <div className="md:col-span-2 pt-4">
                   <button 
                      onClick={handleSave}
                      disabled={actionLoading}
                      className="w-full bg-emerald-900 text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-2 hover:bg-emerald-800 transition-all shadow-xl shadow-emerald-900/20 disabled:opacity-70 active:scale-[0.98]"
                   >
                      {actionLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Check className="w-6 h-6" />}
                      {editingProduct ? 'Salvar Alterações' : 'Criar Produto'}
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
