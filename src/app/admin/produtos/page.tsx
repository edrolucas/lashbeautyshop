'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Check, Image as ImageIcon, Loader2, Star, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { getProducts, getCategories, createProduct, updateProduct, deleteProduct, uploadProductImage, Product, Category } from '@/lib/db';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const BADGE_OPTIONS = [
  { value: '', label: 'Sem selo' },
  { value: 'destaque', label: '⭐ Destaque' },
  { value: 'mais_vendido', label: '🔥 Mais Vendido' },
  { value: 'promocao', label: '💰 Promoção' },
];

const STOCK_STATUS_OPTIONS = [
  { value: 'in_stock', label: '✅ Em Estoque', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
  { value: 'low_stock', label: '⚠️ Estoque Baixo', color: 'bg-amber-50 text-amber-700 border-amber-100' },
  { value: 'out_of_stock', label: '❌ Sem Estoque', color: 'bg-rose-50 text-rose-700 border-rose-100' },
];

const STOCK_LABELSRound: Record<string, string> = {
  in_stock: 'Em estoque',
  low_stock: 'Estoque baixo',
  out_of_stock: 'Sem estoque',
};

export default function ProductsAdmin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    image_url: '',
    category_id: '',
    badge: '' as string,
    featured: false,
    stock_status: 'in_stock' as Product['stock_status'],
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
      if (categoriesData.length > 0 && !formData.category_id) {
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
        category_id: product.category_id,
        badge: product.badge ?? '',
        featured: product.featured ?? false,
        stock_status: product.stock_status ?? 'in_stock',
      });
      setImagePreview(product.image_url);
    } else {
      setFormData({
        name: '',
        price: '',
        description: '',
        image_url: '',
        category_id: categories[0]?.id || '',
        badge: '',
        featured: false,
        stock_status: 'in_stock',
      });
      setImagePreview(null);
    }
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.price || !formData.category_id) return;
    setActionLoading(true);

    try {
      let finalImageUrl = formData.image_url;

      // Upload image if a new file was selected
      if (selectedFile) {
        finalImageUrl = await uploadProductImage(selectedFile);
      }

      const updatedData = {
        name: formData.name,
        price: parseFloat(formData.price),
        description: formData.description,
        image_url: finalImageUrl,
        category_id: formData.category_id,
        badge: (formData.badge || null) as Product['badge'],
        featured: formData.featured,
        featured_order: editingProduct?.featured_order ?? 0,
        stock_status: formData.stock_status,
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, updatedData);
      } else {
        await createProduct(updatedData);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error: any) {
      console.error('Error saving product:', error);
      alert(`Erro ao salvar produto: ${error.message || 'Erro desconhecido'}`);
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

  // Filter and Paginate Logic
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div>
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900">Gerenciar Produtos</h1>
          <p className="text-gray-500">Adicione, edite ou remova produtos do seu catálogo.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Pesquisar produto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-900/10 focus:border-emerald-900 outline-none transition-all shadow-sm"
            />
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="w-full sm:w-auto bg-emerald-900 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-800 transition-all active:scale-95 shadow-lg shadow-emerald-900/20"
          >
            <Plus className="w-5 h-5" />
            Novo Produto
          </button>
        </div>
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
                  <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-gray-400">Produto</th>
                  <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-gray-400">Categoria</th>
                  <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-gray-400">Preço</th>
                  <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-gray-400">Estoque</th>
                  <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-gray-400 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginatedProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
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
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <p className="text-[10px] text-gray-400 font-mono uppercase">#{product.id.slice(0, 8)}</p>
                            {product.featured && (
                              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-900 rounded-lg text-xs font-bold">
                        {categories.find(c => c.id === product.category_id)?.name || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">R$ {Number(product.price).toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm">
                      {(() => {
                        const status = STOCK_STATUS_OPTIONS.find(opt => opt.value === (product.stock_status || 'in_stock'));
                        return (
                          <span className={cn(
                            "px-2 py-1 rounded-full text-[10px] font-bold uppercase border",
                            status?.color
                          )}>
                            {status?.label.split(' ')[1]}
                          </span>
                        );
                      })()}
                    </td>
                    <td className="px-6 py-4 text-right space-x-1">
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

      {/* Pagination Controls */}
      {!loading && filteredProducts.length > itemsPerPage && (
        <div className="mt-8 flex items-center justify-between bg-white px-6 py-4 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-500 font-medium">
            Mostrando <span className="text-gray-900 font-bold">{Math.min(filteredProducts.length, (currentPage - 1) * itemsPerPage + 1)}</span>-
            <span className="text-gray-900 font-bold">{Math.min(filteredProducts.length, currentPage * itemsPerPage)}</span> de 
            <span className="text-gray-900 font-bold">{filteredProducts.length}</span> produtos
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 border border-gray-100 rounded-lg hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={cn(
                    "w-8 h-8 rounded-lg text-xs font-bold transition-all",
                    currentPage === page 
                      ? "bg-emerald-900 text-white shadow-md shadow-emerald-900/20" 
                      : "text-gray-400 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-2 border border-gray-100 rounded-lg hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

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
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-900/10 focus:border-emerald-900 outline-none transition-all text-gray-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Preço (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-900/10 focus:border-emerald-900 outline-none transition-all text-gray-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Categoria</label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-900/10 focus:border-emerald-900 outline-none transition-all text-gray-900 font-medium"
                >
                  <option value="">Selecione uma categoria</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Selo / Badge</label>
                <select
                  value={formData.badge}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-900/10 focus:border-emerald-900 outline-none transition-all text-gray-900 font-medium"
                >
                  {BADGE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Status de Estoque</label>
                <select
                  value={formData.stock_status || 'in_stock'}
                  onChange={(e) => setFormData({ ...formData, stock_status: e.target.value as Product['stock_status'] })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-900/10 focus:border-emerald-900 outline-none transition-all text-gray-900 font-medium"
                >
                  {STOCK_STATUS_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>

              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-6 bg-gray-200 rounded-full peer peer-checked:bg-emerald-900 transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-4 after:shadow-sm" />
                </label>
                <span className="text-sm font-medium text-gray-700">Produto em destaque</span>
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Imagem do Produto</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-100 border-dashed rounded-2xl bg-gray-50/50 hover:bg-gray-50 transition-colors relative overflow-hidden group">
                  {imagePreview ? (
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden">
                      <Image src={imagePreview} alt="Preview" fill className="object-contain" />
                      <button 
                        onClick={() => { setSelectedFile(null); setImagePreview(null); setFormData({...formData, image_url: ''}); }}
                        className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur shadow-sm rounded-full text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1 text-center">
                      <ImageIcon className="mx-auto h-12 w-12 text-gray-300" />
                      <div className="flex text-sm text-gray-600">
                        <label className="relative cursor-pointer bg-white rounded-md font-bold text-emerald-900 hover:text-emerald-800 focus-within:outline-none px-2 underline">
                          <span>Fazer upload de foto</span>
                          <input 
                            type="file" 
                            className="sr-only" 
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setSelectedFile(file);
                                setImagePreview(URL.createObjectURL(file));
                              }
                            }}
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-400 font-medium">PNG, JPG, WEBP até 5MB</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Descrição</label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
