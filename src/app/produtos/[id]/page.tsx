import { getProductById } from '@/lib/db';
import { ProductGallery } from '@/components/ProductGallery';
import { ProductInfo } from '@/components/ProductInfo';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function ProductPage({
  params: paramsPromise,
}: {
  params: Promise<{ id: string }>;
}) {
  try {
    const params = await paramsPromise;
    const product = await getProductById(params.id);

    return (
      <div className="bg-brand-nude/20 min-h-screen pt-32 pb-32">
        <div className="container mx-auto px-6">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-3 text-[10px] text-brand-green/40 uppercase tracking-[0.3em] font-bold mb-16">
            <Link href="/" className="hover:text-brand-gold transition-colors">Início</Link>
            <ChevronRight className="w-3 h-3 opacity-20" />
            <Link href="/produtos" className="hover:text-brand-gold transition-colors">Produtos</Link>
            <ChevronRight className="w-3 h-3 opacity-20" />
            <span className="text-brand-green font-bold tracking-[0.4em]">{product.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32">
            <ProductGallery image={product.image_url} name={product.name} />
            <ProductInfo product={{
              ...product,
              price: Number(product.price)
            }} />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    notFound();
  }
}
