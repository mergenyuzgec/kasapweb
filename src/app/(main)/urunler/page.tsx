import ProductCard from '@/components/ProductCard';
import { Product } from '@/types';
import { Beef, ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const categoryLabels: Record<string, string> = {
  dana: 'Dana',
  kuzu: 'Kuzu',
  tavuk: 'Piliç',
  sakatat: 'Sakatat',
  sarküteri: 'Şarküteri',
  hazir: 'Special Hazır Ürünler',
};

const allCategoryKeys = Object.keys(categoryLabels);

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

interface PageProps {
  searchParams: Promise<{ kategori?: string }>;
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const activeCategory = params.kategori ?? null;
  const products = await getProducts();

  const categories: Record<string, Product[]> = {};
  allCategoryKeys.forEach(key => { categories[key] = []; });

  products.forEach(p => {
    if (categories[p.category]) {
      categories[p.category].push(p);
    }
  });

  // Filter to active category if specified
  const displayCategories = activeCategory && categories[activeCategory]
    ? { [activeCategory]: categories[activeCategory] }
    : categories;

  return (
    <div className="container" style={{ padding: '3rem 0', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <Beef className="text-gold" size={32} /> Ürünlerimiz
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
          Taze ve en kaliteli etlerimizi inceleyin. İstediğiniz miktarda sepetinize ekleyerek sipariş verebilirsiniz.
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.5rem',
        justifyContent: 'center',
      }}>
        <Link
          href="/urunler"
          style={{
            padding: '0.5rem 1.1rem',
            borderRadius: '999px',
            fontSize: '0.875rem',
            fontWeight: 600,
            textDecoration: 'none',
            transition: 'all 0.2s ease',
            border: '1px solid var(--border)',
            background: !activeCategory ? 'var(--primary)' : 'var(--bg-card)',
            color: !activeCategory ? '#000' : 'var(--text-secondary)',
          }}
        >
          Tümü
        </Link>
        {allCategoryKeys.map(key => (
          <Link
            key={key}
            href={`/urunler?kategori=${key}`}
            style={{
              padding: '0.5rem 1.1rem',
              borderRadius: '999px',
              fontSize: '0.875rem',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'all 0.2s ease',
              border: '1px solid var(--border)',
              background: activeCategory === key ? 'var(--primary)' : 'var(--bg-card)',
              color: activeCategory === key ? '#000' : 'var(--text-secondary)',
            }}
          >
            {categoryLabels[key]}
          </Link>
        ))}
      </div>

      {/* Back to all if filtered */}
      {activeCategory && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Link href="/urunler" className="btn-ghost" style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ArrowLeft size={16} /> Tüm Ürünlere Dön
          </Link>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        {Object.entries(displayCategories).map(([key, catProducts]) => {
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
