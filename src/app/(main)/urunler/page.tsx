import ProductCard from '@/components/ProductCard';
import { Product } from '@/types';
import { Beef } from 'lucide-react';
import { createClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getProducts(): Promise<Product[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('category')
    .order('name');

  if (error) {
    console.error('Ürünler alınamadı:', error.message);
    return [];
  }
  return data ?? [];
}

export default async function ProductsPage() {
  const products = await getProducts();
  
  const categories: Record<string, Product[]> = {
    'dana': [],
    'kuzu': [],
    'tavuk': [],
    'sakatat': [],
    'sarküteri': [],
    'hazir': []
  };
  
  products.forEach(p => {
    if (categories[p.category]) {
      categories[p.category].push(p);
    }
  });

  const categoryLabels: Record<string, string> = {
    dana: 'Dana Eti',
    kuzu: 'Kuzu Eti',
    tavuk: 'Tavuk',
    sakatat: 'Sakatat',
    sarküteri: 'Şarküteri',
    hazir: 'Hazır Ürünler'
  };

  return (
    <div className="container" style={{ padding: '3rem 0', display: 'flex', flexDirection: 'column', gap: '4rem' }}>
      <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <Beef className="text-gold" size={32} /> Ürünlerimiz
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
          Taze ve en kaliteli etlerimizi inceleyin. İstediğiniz miktarda sepetinize ekleyerek sipariş verebilirsiniz.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        {Object.entries(categories).map(([key, catProducts]) => {
          if (catProducts.length === 0) return null;
          
          return (
            <div key={key}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)' }}>
                {categoryLabels[key] ?? key}
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {catProducts.map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
