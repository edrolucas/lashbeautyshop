import { getCategories, getProducts } from '@/lib/db';
import { ProductCard } from '@/components/ProductCard';
import { Filter, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default async function ProductsPage({
  searchParams: searchParamsPromise,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  const searchParams = await searchParamsPromise;
  const selectedCategoryId = searchParams.categoria;
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(selectedCategoryId)
  ]);

  const activeCategory = categories.find(c => c.id === selectedCategoryId);

  return (
    <div className="bg-white min-h-screen">
      {/* Header / Breadcrumbs */}
      <section className="bg-gray-50 py-12 border-b border-gray-100 mt-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-xs text-gray-400 uppercase tracking-widest mb-4">
            <Link href="/" className="hover:text-emerald-900 transition-colors">Início</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-emerald-900 font-bold">Produtos</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-serif font-bold text-gray-900">
            {activeCategory ? activeCategory.name : 'Todos os Produtos'}
          </h1>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Sidebar Filters */}
            <aside className="w-full lg:w-64 flex-shrink-0">
              <div className="sticky top-32">
                <div className="flex items-center gap-2 mb-8">
                  <Filter className="w-4 h-4 text-emerald-900" />
                  <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-900">Filtrar por</h2>
                </div>

                <div className="space-y-2">
                  <Link
                    href="/produtos"
                    className={cn(
                      "block px-4 py-3 rounded-xl text-sm transition-all",
                      !selectedCategoryId 
                        ? "bg-emerald-900 text-white font-bold shadow-lg shadow-emerald-900/10" 
                        : "text-gray-500 hover:bg-gray-50"
                    )}
                  >
                    Todos os Produtos
                  </Link>
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/produtos?categoria=${cat.id}`}
                      className={cn(
                        "block px-4 py-3 rounded-xl text-sm transition-all",
                        selectedCategoryId === cat.id
                          ? "bg-emerald-900 text-white font-bold shadow-lg shadow-emerald-900/10" 
                          : "text-gray-500 hover:bg-gray-50"
                      )}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            </aside>

            {/* Product Grid */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-8">
                <p className="text-sm text-gray-400">
                  Mostrando <span className="text-gray-900 font-medium">{products.length}</span> produtos
                </p>
              </div>

              {products.length === 0 ? (
                <div className="py-20 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                  <p className="text-gray-500">Nenhum produto encontrado nesta categoria.</p>
                  <Link 
                    href="/produtos"
                    className="mt-4 inline-block text-emerald-900 font-bold underline"
                  >
                    Ver todos os produtos
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                  {products.map((product) => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      categoryName={categories.find(c => c.id === product.category_id)?.name} 
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
