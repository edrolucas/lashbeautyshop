import { getFeaturedProducts, getCategories, getProducts } from '@/lib/db';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Star, ShieldCheck, Truck, Headphones, Instagram } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { ProductCarousel } from '@/components/ProductCarousel';

export default async function Home() {
  const categories = await getCategories();
  const [featuredProducts, allProducts] = await Promise.all([
    getFeaturedProducts(),
    getProducts(),
  ]);

  const displayFeatured = featuredProducts.length > 0
    ? featuredProducts
    : allProducts.slice(0, 4);

  return (
    <div className="flex flex-col w-full bg-brand-nude selection:bg-brand-green selection:text-white">
      {/* 1. Hero Section */}
      <section className="relative min-h-[90vh] lg:min-h-screen flex items-center overflow-hidden pt-24 lg:pt-32 bg-brand-nude">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-[40%] h-full bg-brand-beige opacity-30 skew-x-[-12deg] translate-x-20 hidden lg:block" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-16 lg:gap-24">
            {/* Left Column: Content */}
            <div className="animate-fade-up">
              <span className="text-brand-gold font-bold tracking-[0.4em] uppercase text-[10px] mb-6 block drop-shadow-sm">Exclusividade & Elegância</span>
              <h1 className="text-6xl lg:text-[7rem] font-serif font-bold text-brand-green leading-[0.9] mb-10 tracking-tighter">
                O melhor da <br />
                <span className="italic font-light text-brand-gold drop-shadow-sm">beleza</span> <br />
                para você
              </h1>
              <p className="text-lg lg:text-xl text-brand-green/60 mb-12 max-w-md leading-relaxed font-medium">
                As melhores marcas exclusivas para profissionais que buscam realçar a beleza e a confiança.
              </p>

              <div className="flex flex-col sm:flex-row gap-6">
                <Link
                  href="/produtos"
                  className="btn-gold group inline-flex items-center justify-center gap-4 px-14 py-6 rounded-full font-bold uppercase tracking-[0.2em] text-xs shadow-2xl shadow-brand-gold/20"
                >
                  Ver produtos
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
                </Link>

                <div className="flex items-center gap-4 px-8 py-5 rounded-full bg-white/50 backdrop-blur-md border border-brand-beige shadow-sm">
                  <div className="flex -space-x-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-brand-beige overflow-hidden">
                        <div className="w-full h-full bg-brand-green/5 flex items-center justify-center">
                          <Star className="w-4 h-4 text-brand-gold fill-brand-gold" />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-brand-green uppercase tracking-widest">+2.5k</span>
                    <span className="text-[9px] font-bold text-brand-green/40 uppercase tracking-tighter">Clientes Satisfeitas</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Image Container */}
            <div className="relative group lg:h-[750px] w-full">
              {/* Decorative behind elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-gold/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-brand-green/5 rounded-full blur-3xl" />

              {/* Image Frame */}
              <div className="relative h-[550px] sm:h-[600px] lg:h-full w-full rounded-[4rem] overflow-hidden shadow-luxury animate-scale-in border-[12px] border-white bg-[#064e3b]">
                <Image
                  src="/hero-beauty.jpg"
                  alt="Beleza e Confiança"
                  fill
                  className="object-contain lg:object-cover lg:object-center transition-transform duration-[2s] group-hover:scale-105"
                  priority
                />

                <div className="absolute inset-0 bg-gradient-to-t from-brand-green/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              </div>

              {/* Floating element */}
              <div className="absolute bottom-12 -left-8 lg:-left-12 p-8 bg-white rounded-[2.5rem] shadow-luxury animate-fade-up delay-500 hidden sm:block border border-brand-beige">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-brand-nude flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-brand-gold" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-brand-gold uppercase tracking-[0.2em]">Selo de Qualidade</p>
                    <p className="text-xs font-serif font-bold text-brand-green">100% Original</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Seção de Categorias */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div className="max-w-xl">
              <span className="text-brand-gold font-bold tracking-[0.3em] uppercase text-xs mb-4 block">Descubra</span>
              <h2 className="text-4xl lg:text-5xl font-serif font-bold text-brand-green">Explore por categoria</h2>
            </div>
            <p className="text-gray-400 max-w-xs text-right hidden lg:block">Navegue pelas nossas seleções exclusivas para encontrar exatamente o que você precisa.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 lg:gap-8">
            {categories.map((cat) => {
              const iconPath = {
                'Cílios': '/category-icons/cat_icon_cilios_v2.png',
                'Sobrancelhas': '/category-icons/cat_icon_sobrancelhas_v2.png',
                'Acessórios': '/category-icons/cat_icon_acessorios_v2.png',
                'Depilação': '/category-icons/cat_icon_depilacao_v2.png',
                'Adesivos': '/category-icons/cat_icon_adesivos_v2.png',
              }[cat.name] || '/category-icons/cat_icon_cilios_v2.png';

              return (
                <Link
                  key={cat.id}
                  href={`/produtos?categoria=${cat.id}`}
                  className="group relative aspect-[4/5] bg-brand-beige rounded-3xl overflow-hidden flex flex-col items-center justify-between p-8 transition-all duration-700 hover:-translate-y-4 shadow-sm hover:shadow-2xl hover:shadow-brand-green/5"
                >
                  <div className="absolute inset-0 bg-brand-green/0 group-hover:bg-brand-green/5 transition-colors duration-700" />
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000" />

                  <div className="relative z-10 w-full aspect-square flex items-center justify-center p-4">
                    <Image
                      src={iconPath}
                      alt={cat.name}
                      width={120}
                      height={120}
                      className="object-contain transition-transform duration-700 group-hover:scale-110 drop-shadow-sm"
                    />
                  </div>

                  <div className="relative z-10 w-full text-center">
                    <h3 className="font-serif font-bold text-lg lg:text-xl text-brand-green">
                      {cat.name}
                    </h3>
                    <span className="text-[9px] uppercase tracking-[0.2em] text-brand-gold font-bold mt-2 opacity-40 group-hover:opacity-100 transition-opacity block">
                      Explorar
                    </span>
                  </div>

                  <div className="absolute top-6 right-6 w-8 h-8 rounded-full border border-brand-green/10 flex items-center justify-center group-hover:bg-brand-green group-hover:border-brand-green transition-all duration-500 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0">
                    <ArrowRight className="w-3.5 h-3.5 text-brand-green group-hover:text-white" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Produtos em Destaque */}
      <section className="py-32 bg-brand-nude relative overflow-hidden">
        <div className="absolute -left-20 top-40 w-80 h-80 bg-brand-gold/5 rounded-full blur-3xl" />
        <div className="absolute -right-20 bottom-40 w-96 h-96 bg-brand-green/5 rounded-full blur-3xl" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div>
              <span className="text-brand-gold font-bold tracking-[0.3em] uppercase text-xs mb-4 block">Exclusivos</span>
              <h2 className="text-4xl lg:text-5xl font-serif font-bold text-brand-green">Nossos Favoritos</h2>
            </div>
            <Link
              href="/produtos"
              className="group flex items-center gap-3 text-brand-green font-bold text-sm tracking-widest hover:text-brand-gold transition-all"
            >
              VER TODO O CATÁLOGO
              <div className="w-10 h-[1px] bg-brand-green group-hover:bg-brand-gold transition-all group-hover:w-14" />
            </Link>
          </div>

          <div className="space-y-32">
            {/* Agrupamento por Badge */}
            {[
              { id: 'destaque', title: '⭐ Destaques da Temporada', items: displayFeatured.filter(p => p.badge === 'destaque') },
              { id: 'mais_vendido', title: '🔥 Os Mais Queridinhos', items: displayFeatured.filter(p => p.badge === 'mais_vendido') },
              { id: 'promocao', title: '💰 Ofertas Irresistíveis', items: displayFeatured.filter(p => p.badge === 'promocao') }
            ].map((section) => {
              if (section.items.length === 0) return null;
              return (
                <div key={section.id}>
                  <div className="flex items-center gap-6 mb-12">
                    <h3 className="text-xl font-serif font-bold text-brand-green">{section.title}</h3>
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-brand-gold/30 to-transparent" />
                  </div>
                  <ProductCarousel itemCount={section.items.length}>
                    {section.items.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={{ ...product, price: Number(product.price) }}
                        categoryName={categories.find(c => c.id === product.category_id)?.name}
                      />
                    ))}
                  </ProductCarousel>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Seção de Benefícios */}
      <section className="py-24 bg-brand-green text-brand-nude">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-8 border border-white/10 group-hover:bg-brand-gold transition-all duration-500">
                <Truck className="w-8 h-8 text-brand-gold group-hover:text-white" />
              </div>
              <h4 className="text-xl font-serif font-bold mb-4">Entrega Expressa</h4>
              <p className="text-brand-nude/60 leading-relaxed px-4">Receba seus produtos com rapidez e segurança em todo o Brasil.</p>
            </div>

            <div className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-8 border border-white/10 group-hover:bg-brand-gold transition-all duration-500">
                <ShieldCheck className="w-8 h-8 text-brand-gold group-hover:text-white" />
              </div>
              <h4 className="text-xl font-serif font-bold mb-4">Garantia de Qualidade</h4>
              <p className="text-brand-nude/60 leading-relaxed px-4">Trabalhamos apenas com marcas originais e aprovadas por especialistas.</p>
            </div>

            <div className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-8 border border-white/10 group-hover:bg-brand-gold transition-all duration-500">
                <Headphones className="w-8 h-8 text-brand-gold group-hover:text-white" />
              </div>
              <h4 className="text-xl font-serif font-bold mb-4">Suporte Premium</h4>
              <p className="text-brand-nude/60 leading-relaxed px-4">Dúvidas? Nossa equipe especializada está pronta para te auxiliar.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Avaliações */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-24">
            <span className="text-brand-gold font-bold tracking-[0.3em] uppercase text-xs mb-6 block">Depoimentos</span>
            <h2 className="text-4xl lg:text-5xl font-serif font-bold text-brand-green underline decoration-brand-gold/30 underline-offset-8">O que nossas clientes amam</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {[
              { name: 'Ana Carolina', text: 'A qualidade dos fios é surreal. Meus atendimentos subiram de nível depois que comecei a usar os produtos da Lash.', role: 'Lash Designer' },
              { name: 'Marina Lopes', text: 'Entrega muito rápida e embalagem cuidadosa. Dá pra ver o carinho em cada detalhe. O melhor preço que já encontrei.', role: 'Microempreendedora' },
              { name: 'Beatriz Soares', text: 'O suporte me ajudou a escolher a cola ideal para o meu ambiente. Atendimento humano e especializado.', role: 'Profissional de Beleza' }
            ].map((t, i) => (
              <div key={i} className="p-12 bg-brand-nude/50 rounded-[3rem] border border-brand-green/5 relative group hover:bg-white hover:shadow-2xl hover:shadow-brand-green/5 transition-all duration-500">
                <Star className="w-10 h-10 text-brand-gold/20 absolute top-8 right-8" />
                <p className="text-brand-green font-serif text-xl italic mb-10 leading-relaxed">"{t.text}"</p>
                <div>
                  <h5 className="font-bold text-brand-green text-sm uppercase tracking-widest">{t.name}</h5>
                  <span className="text-xs text-brand-gold font-medium mt-1 block">{t.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Banner Final CTA */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="relative h-[450px] sm:h-[500px] rounded-[4rem] overflow-hidden group bg-[#064e3b]">
            <Image
              src="/hero-beauty.jpg"
              alt="Final CTA"
              fill
              className="object-contain lg:object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-brand-green/60 flex flex-col items-center justify-center text-center p-8 backdrop-blur-[2px]">
              <h2 className="text-4xl lg:text-6xl font-serif font-bold text-white mb-8 max-w-2xl leading-tight">
                Pronta para elevar o nível da sua beleza?
              </h2>
              <Link
                href="/produtos"
                className="btn-gold px-16 py-6 rounded-full font-bold uppercase tracking-[0.2em] text-sm"
              >
                Começar a Comprar
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
