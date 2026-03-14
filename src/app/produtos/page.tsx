import { getCategories, getProducts, getFeaturedProducts } from '@/lib/db';
import { ProductCard } from '@/components/ProductCard';
import { ProductCarousel } from '@/components/ProductCarousel';
import { SearchInput } from '@/components/SearchInput';
import { Filter, ChevronRight, ArrowRight, Star, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default async function ProductsPage({
  searchParams: searchParamsPromise,
}: {
  searchParams: Promise<{ categoria?: string; busca?: string }>;
}) {
  const searchParams = await searchParamsPromise;
  const selectedCategoryId = searchParams.categoria;
  const searchTerm = searchParams.busca;

  const [categories, products, featuredProducts] = await Promise.all([
    getCategories(),
    getProducts(selectedCategoryId, searchTerm),
    !selectedCategoryId && !searchTerm ? getFeaturedProducts() : Promise.resolve([]),
  ]);

  const activeCategory = categories.find(c => c.id === selectedCategoryId);

  return (
    <div className="bg-brand-nude/20 min-h-screen">
      {/* Header / Breadcrumbs */}
      <section className="bg-brand-green py-24 border-b border-white/5 mt-16 relative overflow-hidden">
        {/* Subtle Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-gold/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/4" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
            <div>
              <div className="flex items-center gap-3 text-[10px] text-brand-gold uppercase tracking-[0.3em] font-bold mb-6">
                <Link href="/" className="hover:text-white transition-colors">Início</Link>
                <ChevronRight className="w-3 h-3 opacity-30" />
                <span className="text-white">Produtos</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-serif font-bold text-white tracking-tighter max-w-2xl leading-[0.9]">
                {activeCategory ? activeCategory.name : 'Nossa Coleção'}
              </h1>
              <p className="text-brand-nude/40 mt-6 text-sm max-w-md font-medium tracking-wide">
                Explore nossa seleção de produtos premium desenvolvidos para profissionais que buscam a perfeição.
              </p>
            </div>
            
            <SearchInput />
          </div>
        </div>
      </section>

      {/* Featured strip — only on the "all products" view */}
      {!selectedCategoryId && !searchTerm && featuredProducts.length > 0 && (
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-nude flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-brand-gold" />
                </div>
                <div>
                  <h2 className="text-2xl font-serif font-bold text-brand-green">Seleção da Especialista</h2>
                  <p className="text-xs text-brand-gold font-bold uppercase tracking-[0.2em] mt-1">Os favoritos da estação</p>
                </div>
              </div>
              <div className="h-[1px] flex-1 bg-brand-beige hidden md:block mx-8" />
            </div>

            <div className="space-y-24">
              {/* 1. Destaques */}
              {(() => {
                const items = featuredProducts.filter(p => p.badge === 'destaque');
                if (items.length === 0) return null;
                return (
                  <div>
                    <div className="flex items-center gap-4 mb-10">
                      <span className="text-[10px] font-bold text-brand-gold uppercase tracking-[0.4em]">⭐ Lançamentos & Destaques</span>
                    </div>
                    <ProductCarousel itemCount={items.length}>
                      {items.map((product) => (
                        <ProductCard
                          key={product.id}
                          product={{ ...product, price: Number(product.price) }}
                          categoryName={categories.find(c => c.id === product.category_id)?.name}
                        />
                      ))}
                    </ProductCarousel>
                  </div>
                );
              })()}

              {/* 2. Mais Vendidos */}
              {(() => {
                const items = featuredProducts.filter(p => p.badge === 'mais_vendido');
                if (items.length === 0) return null;
                return (
                  <div>
                    <div className="flex items-center gap-4 mb-10">
                      <span className="text-[10px] font-bold text-brand-gold uppercase tracking-[0.4em]">🔥 Os Mais Queridos</span>
                    </div>
                    <ProductCarousel itemCount={items.length}>
                      {items.map((product) => (
                        <ProductCard
                          key={product.id}
                          product={{ ...product, price: Number(product.price) }}
                          categoryName={categories.find(c => c.id === product.category_id)?.name}
                        />
                      ))}
                    </ProductCarousel>
                  </div>
                );
              })()}
            </div>
          </div>
        </section>
      )}

      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-20">

            {/* Sidebar Filters */}
            <aside className="w-full lg:w-64 flex-shrink-0">
              <div className="sticky top-32">
                <div className="flex items-center gap-3 mb-10">
                  <div className="w-1 h-6 bg-brand-gold rounded-full" />
                  <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-green">Categorias</h2>
                </div>

                <div className="relative">
                  <div className="flex lg:flex-col gap-4 overflow-x-auto pb-6 lg:pb-0 -mx-6 px-6 lg:mx-0 lg:px-0 no-scrollbar items-center lg:items-stretch">
                    <Link
                      href="/produtos"
                      className={cn(
                        'flex items-center justify-between px-8 py-4 rounded-full text-xs tracking-widest uppercase transition-all whitespace-nowrap flex-shrink-0 border font-bold',
                        !selectedCategoryId
                          ? 'bg-brand-green text-white border-brand-green shadow-2xl shadow-brand-green/20'
                          : 'text-brand-green/40 border-brand-beige hover:border-brand-gold hover:text-brand-green bg-white'
                      )}
                    >
                      <span>Todos</span>
                      {/* {!selectedCategoryId && <ChevronRight className="w-4 h-4 hidden lg:block" />} */}
                    </Link>
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/produtos?categoria=${cat.id}`}
                        className={cn(
                          'flex items-center justify-between px-8 py-4 rounded-full text-xs tracking-widest uppercase transition-all whitespace-nowrap flex-shrink-0 border font-bold',
                          selectedCategoryId === cat.id
                            ? 'bg-brand-green text-white border-brand-green shadow-2xl shadow-brand-green/20'
                            : 'text-brand-green/40 border-brand-beige hover:border-brand-gold hover:text-brand-green bg-white'
                        )}
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                  
                  {/* Subtle scroll indicator line for mobile */}
                  <div className="w-16 h-1 bg-brand-beige rounded-full mx-auto mt-2 lg:hidden" />
                </div>
                
                <div className="mt-16 hidden lg:block p-8 bg-brand-green rounded-[2rem] text-white relative overflow-hidden group">
                   <div className="absolute top-0 right-0 w-24 h-24 bg-brand-gold/10 rounded-full blur-2xl group-hover:bg-brand-gold/20 transition-all" />
                   <Star className="w-8 h-8 text-brand-gold mb-4" />
                   <h3 className="font-serif font-bold text-xl mb-2">Suporte Expert</h3>
                   <p className="text-[10px] text-brand-nude/40 leading-relaxed uppercase tracking-wider">
                     Dúvidas sobre qual produto escolher? Fale com nossas especialistas.
                   </p>
                   <a href="#" className="mt-6 inline-flex items-center gap-2 text-[10px] font-bold text-brand-gold uppercase tracking-widest hover:gap-3 transition-all">
                     WhatsApp <ArrowRight className="w-3 h-3" />
                   </a>
                </div>
              </div>
            </aside>

            {/* Product Grid */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-12">
                <p className="text-[10px] text-brand-green/30 uppercase tracking-[0.2em] font-bold">
                  Catálogo de <span className="text-brand-green">{products.length}</span> itens exclusivos
                </p>
                <div className="h-[1px] flex-1 bg-brand-beige mx-8 hidden sm:block" />
              </div>

              {products.length === 0 ? (
                <div className="py-32 text-center bg-white rounded-[3rem] border-2 border-dashed border-brand-beige flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full bg-brand-nude flex items-center justify-center mb-8">
                     <Filter className="w-8 h-8 text-brand-gold opacity-30" />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-brand-green mb-4">Nenhum resultado</h3>
                  <p className="text-brand-green/40 text-sm max-w-sm mx-auto mb-10 font-medium">
                    Infelizmente não encontramos produtos que correspondam à sua busca ou filtro.
                  </p>
                  <Link
                    href="/produtos"
                    className="inline-flex items-center gap-3 px-10 py-5 bg-brand-green text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-brand-gold transition-all shadow-2xl shadow-brand-green/20"
                  >
                    Ver Tudo <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8 sm:gap-10">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={{ ...product, price: Number(product.price) }}
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
