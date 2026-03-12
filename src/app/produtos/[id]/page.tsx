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
      <div className="bg-white min-h-screen pt-24 pb-20">
        <div className="container mx-auto px-4">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs text-gray-400 uppercase tracking-widest mb-12">
            <Link href="/" className="hover:text-emerald-900 transition-colors">Início</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/produtos" className="hover:text-emerald-900 transition-colors">Produtos</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-emerald-900 font-bold">{product.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
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
