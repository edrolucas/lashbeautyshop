import { getCategories, getProducts } from '@/lib/db';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Star } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';

export default async function Home() {
  const categories = await getCategories();
  const products = await getProducts();
  
  // Get featured products
  const featuredProducts = products.slice(0, 3);

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center bg-[#F3F4F6] overflow-hidden">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-20">
          <div className="z-10 text-center lg:text-left">
            <h1 className="text-5xl lg:text-7xl font-serif font-bold text-gray-900 leading-tight mb-6">
              Beleza que <br />
              <span className="text-emerald-900">transforma</span> o olhar
            </h1>
            <p className="text-lg text-gray-500 mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Produtos premium para cílios e sobrancelhas. Sofisticação e qualidade em cada detalhe para profissionais exigentes.
            </p>
            <Link 
              href="/produtos" 
              className="inline-flex items-center gap-3 bg-emerald-900 text-white px-10 py-5 rounded-xl font-bold transition-all hover:bg-emerald-800 hover:gap-5 active:scale-95 shadow-xl shadow-emerald-900/20"
            >
              VER PRODUTOS
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          
          <div className="relative h-[500px] lg:h-[600px] flex items-center justify-center">
            {/* Logo in Hero - Original High-Resolution PNG */}
            <div className="relative w-full max-w-lg aspect-square flex items-center justify-center transition-all duration-1000 transform hover:scale-105">
               <div className="absolute inset-0 bg-emerald-900/5 rounded-full blur-[120px]" />
               <div className="relative w-full h-full p-4 md:p-8">
                  <Image 
                    src="/logo_original.png" 
                    alt="Lash Beauty Shop Logo" 
                    fill 
                    className="object-contain"
                    priority
                  />
               </div>
               
               {/* Decorative floating element */}
               <div className="absolute top-10 right-10 w-20 h-20 bg-white/60 backdrop-blur-md rounded-2xl border border-white/80 shadow-xl rotate-12 flex items-center justify-center animate-bounce duration-[4000ms]">
                  <Star className="w-8 h-8 text-emerald-900" />
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-serif font-bold text-gray-900 mb-4">Nossas Categorias</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Explore nossa seleção curada de produtos para realçar a beleza do seu olhar</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories.map((cat) => (
              <Link 
                key={cat.id}
                href={`/produtos?categoria=${cat.id}`}
                className="group relative h-48 bg-gray-50 rounded-2xl overflow-hidden flex items-center justify-center transition-all hover:bg-emerald-900 duration-500"
              >
                <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity">
                   {/* Background pattern could go here */}
                </div>
                <span className="relative z-10 font-serif font-bold text-xl text-gray-900 group-hover:text-white transition-colors duration-500">
                  {cat.name}
                </span>
                <div className="absolute bottom-4 right-4 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <ArrowRight className="w-6 h-6 text-white" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
            <div>
              <h2 className="text-3xl lg:text-4xl font-serif font-bold text-gray-900 mb-4">Em Destaque</h2>
              <p className="text-gray-500">Os preferidos das nossas clientes</p>
            </div>
            <Link 
              href="/produtos" 
              className="inline-flex items-center gap-2 text-emerald-900 font-bold hover:gap-4 transition-all"
            >
              Ver todos
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={{
                  ...product,
                  price: Number(product.price)
                }} 
                categoryName={categories.find(c => c.id === product.category_id)?.name || "Destaque"} 
              />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white overflow-hidden">
         <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-serif font-bold text-gray-900 mb-4">O que dizem nossas clientes</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {[
                 { name: 'Ana C.', text: 'Qualidade incrível! Os cílios são super naturais e leves.' },
                 { name: 'Maria L.', text: 'Melhor loja de cílios que já comprei. Atendimento impecável.' },
                 { name: 'Juliana R.', text: 'O sérum de crescimento realmente funciona. Recomendo demais!' }
               ].map((t, i) => (
                 <div key={i} className="p-8 bg-gray-50 rounded-3xl border border-gray-100">
                    <div className="flex gap-1 mb-4 text-emerald-900">
                       {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                    </div>
                    <p className="text-gray-600 italic mb-6 leading-relaxed">"{t.text}"</p>
                    <span className="font-bold text-gray-900">{t.name}</span>
                 </div>
               ))}
            </div>
         </div>
      </section>
    </div>
  );
}
