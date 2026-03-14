'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Star, GripVertical, Loader2, Save, Check, X, Filter, ChevronDown, ChevronRight, Search, Tag } from 'lucide-react';
import { getProducts, getCategories, updateProductFeatured, Product, Category } from '@/lib/db';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const BADGE_OPTIONS = [
  { value: '', label: 'Sem selo' },
  { value: 'destaque', label: '⭐ Destaque' },
  { value: 'mais_vendido', label: '🔥 Mais Vendido' },
  { value: 'promocao', label: '💰 Promoção' },
];

export default function DestaquesAdmin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [needsMigration, setNeedsMigration] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [p, c] = await Promise.all([getProducts(), getCategories()]);
      // Sort: featured first by order, then by name
      const sorted = [...p].sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return (a.featured_order ?? 0) - (b.featured_order ?? 0);
      });
      setProducts(sorted);
      setCategories(c);
      
      // Expand all categories initially
      const expanded: Record<string, boolean> = {};
      c.forEach(cat => expanded[cat.id] = true);
      setExpandedCategories(expanded);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (id: string) => {
    setExpandedCategories(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleFeatured = useCallback((id: string) => {
    setProducts(prev => prev.map(p =>
      p.id === id ? { ...p, featured: !p.featured, modified: true } : p
    ));
  }, []);

  const changeBadge = useCallback((id: string, badge: Product['badge']) => {
    setProducts(prev => prev.map(p =>
      p.id === id ? { ...p, badge, modified: true } : p
    ));
  }, []);

  const changeSalePrice = useCallback((id: string, sale_price: number | null) => {
    setProducts(prev => prev.map(p =>
      p.id === id ? { ...p, sale_price, modified: true } : p
    ));
  }, []);

  // Drag and drop handlers
  const handleDragStart = (id: string) => setDraggedId(id);
  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (id !== draggedId) setDragOverId(id);
  };
  const handleDrop = (targetId: string) => {
    if (!draggedId || draggedId === targetId) return;
    setProducts(prev => {
      const items = [...prev];
      const fromIdx = items.findIndex(p => p.id === draggedId);
      const toIdx = items.findIndex(p => p.id === targetId);
      const [moved] = items.splice(fromIdx, 1);
      items.splice(toIdx, 0, moved);
      // Mark all items between from and to as modified because order changed
      return items.map((p, idx) => ({ ...p, modified: true }));
    });
    setDraggedId(null);
    setDragOverId(null);
  };
  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverId(null);
  };

  const saveAll = async () => {
    setSaving(true);
    setNeedsMigration(false);
    try {
      const featured = products.filter(p => p.featured);
      const toUpdate = (products as any[]).filter(p => p.modified);
      
      if (toUpdate.length === 0) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
        setSaving(false);
        return;
      }

      const results = await Promise.allSettled(
        toUpdate.map((p) =>
          updateProductFeatured(
            p.id,
            !!p.featured,
            p.badge ?? null,
            featured.indexOf(p) >= 0 ? featured.indexOf(p) : 0,
            p.badge === 'promocao' ? p.sale_price : null
          )
        )
      );

      const rejected = results.filter(r => r.status === 'rejected');
      if (rejected.length > 0) {
        const error = (rejected[0] as PromiseRejectedResult).reason;
        if (error?.code === '42703' || error?.message?.includes('column')) {
          setNeedsMigration(true);
          return;
        }
        throw error;
      }

      setProducts(prev => prev.map(p => ({ ...p, modified: false })));
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      console.error(e);
      alert('Erro ao salvar destaques. Verifique o console ou a mensagem de migração.');
    } finally {
      setSaving(false);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const productsByCategory = useMemo(() => {
    const grouped: Record<string, Product[]> = {};
    categories.forEach(cat => {
      grouped[cat.id] = filteredProducts.filter(p => p.category_id === cat.id);
    });
    // Add a group for products without category if any
    const uncategorized = filteredProducts.filter(p => !p.category_id);
    if (uncategorized.length > 0) {
      grouped['uncategorized'] = uncategorized;
    }
    return grouped;
  }, [filteredProducts, categories]);

  const featuredCount = products.filter(p => p.featured).length;

  return (
    <div className="animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900">Produtos em Destaque</h1>
          <p className="text-gray-500 mt-1">
            Reorganize os produtos por categoria e selecione os destaques da vitrine.
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold">
              {featuredCount} selecionado{featuredCount !== 1 ? 's' : ''}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={saveAll}
            disabled={saving}
            className="bg-emerald-900 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-800 transition-all active:scale-95 shadow-lg shadow-emerald-900/20 disabled:opacity-70"
          >
            {saving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : saved ? (
              <Check className="w-5 h-5" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            {saved ? 'Salvo!' : 'Salvar Ordem'}
          </button>
        </div>
      </header>

      {/* Migration warning banner */}
      {needsMigration && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-bold text-red-800 mb-2">⚠️ Migração SQL necessária</h3>
              <p className="text-sm text-red-700 mb-4">
                As colunas de destaque ainda não existem no banco de dados. Execute o SQL abaixo no <strong>Supabase → SQL Editor</strong>:
              </p>
              <pre className="bg-red-900 text-green-300 text-xs p-4 rounded-xl overflow-x-auto whitespace-pre-wrap">
{`ALTER TABLE products
  ADD COLUMN IF NOT EXISTS badge TEXT
    CHECK (badge IN ('destaque', 'mais_vendido', 'promocao')),
  ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS featured_order INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS sale_price NUMERIC;`}
              </pre>
              <p className="text-xs text-red-600 mt-3">Para ver as mudanças, execute o SQL e recarregue a página.</p>
            </div>
            <button onClick={() => setNeedsMigration(false)} className="text-red-400 hover:text-red-600">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-emerald-900 animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
             <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Buscar produto pelo nome..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-6 py-3 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-900/10 focus:border-emerald-900 outline-none w-full transition-all shadow-sm"
              />
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-[10px] text-amber-800 flex items-center gap-2 font-bold uppercase tracking-widest">
              <GripVertical className="w-4 h-4 flex-shrink-0" />
              Arraste para reordenar
            </div>
          </div>

          {/* Grouped Products */}
          <div className="space-y-4">
            {categories.map((cat) => {
              const categoryProducts = productsByCategory[cat.id] || [];
              if (searchTerm && categoryProducts.length === 0) return null;
              const isExpanded = expandedCategories[cat.id];

              return (
                <div key={cat.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                  <button 
                    onClick={() => toggleCategory(cat.id)}
                    className="w-full px-8 py-4 flex items-center justify-between bg-gray-50/50 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Tag className="w-4 h-4 text-emerald-900" />
                      <h2 className="font-serif font-bold text-gray-900">{cat.name}</h2>
                      <span className="text-xs text-gray-400 font-mono">({categoryProducts.length})</span>
                    </div>
                    {isExpanded ? <ChevronDown className="w-5 h-5 text-gray-400" /> : <ChevronRight className="w-5 h-5 text-gray-400" />}
                  </button>

                  {isExpanded && (
                    <div className="divide-y divide-gray-50">
                      {categoryProducts.length === 0 ? (
                        <div className="p-8 text-center text-gray-400 text-sm">Nenhum produto nesta categoria.</div>
                      ) : (
                        categoryProducts.map((product) => {
                          const isDragging = draggedId === product.id;
                          const isDragOver = dragOverId === product.id;

                          return (
                            <div
                              key={product.id}
                              draggable
                              onDragStart={() => handleDragStart(product.id)}
                              onDragOver={(e) => handleDragOver(e, product.id)}
                              onDrop={() => handleDrop(product.id)}
                              onDragEnd={handleDragEnd}
                              className={cn(
                                'flex items-center gap-4 px-8 py-3 transition-all select-none',
                                'hover:bg-gray-50/50',
                                isDragging && 'opacity-40 scale-[0.98]',
                                isDragOver && 'border-t-2 border-t-emerald-900 bg-emerald-50/30',
                                product.featured && 'bg-emerald-50/20'
                              )}
                            >
                              {/* Drag handle */}
                              <GripVertical className="w-5 h-5 text-gray-300 cursor-grab active:cursor-grabbing flex-shrink-0" />

                              {/* Image */}
                              <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100">
                                {product.image_url ? (
                                  <Image src={product.image_url} alt={product.name} fill className="object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs pt-1">?</div>
                                )}
                              </div>

                              {/* Info */}
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-sm text-gray-900 truncate">{product.name}</p>
                                <p className="text-xs text-gray-400">R$ {Number(product.price).toFixed(2).replace('.', ',')}</p>
                              </div>

                              {/* Sale Price Input (only for promocao) */}
                              {product.badge === 'promocao' && (
                                <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 hidden sm:flex">
                                  <span className="text-[10px] font-bold text-emerald-800 uppercase">Preço Promo:</span>
                                  <input
                                    type="number"
                                    step="0.01"
                                    value={product.sale_price ?? ''}
                                    onChange={(e) => changeSalePrice(product.id, e.target.value ? Number(e.target.value) : null)}
                                    placeholder="0,00"
                                    className="w-20 bg-transparent border-none p-0 text-sm font-bold text-emerald-900 focus:ring-0 outline-none"
                                  />
                                </div>
                              )}

                              {/* Badge select */}
                              <select
                                value={product.badge ?? ''}
                                onChange={(e) => changeBadge(product.id, (e.target.value || null) as Product['badge'])}
                                className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-900/10 focus:border-emerald-900 hidden sm:block"
                              >
                                {BADGE_OPTIONS.map(opt => (
                                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                              </select>

                              {/* Starred toggle */}
                              <button
                                onClick={() => toggleFeatured(product.id)}
                                className={cn(
                                  'w-10 h-10 rounded-xl flex items-center justify-center transition-all flex-shrink-0 border',
                                  product.featured
                                    ? 'bg-amber-100 border-amber-200 text-amber-600 hover:bg-amber-200'
                                    : 'bg-gray-50 border-gray-100 text-gray-300 hover:bg-gray-100 hover:text-gray-500'
                                )}
                                title={product.featured ? 'Remover destaque' : 'Marcar como destaque'}
                              >
                                <Star className={cn('w-5 h-5', product.featured && 'fill-amber-500')} />
                              </button>
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
