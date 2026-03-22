import Link from 'next/link';
import { ArrowRight, Beef, Truck, Clock, Flame } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { createClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  const supabase = createClient();
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('in_stock', true)
    .order('created_at', { ascending: false })
    .limit(4);

  const popularProducts = products ?? [];

  return (
    <div style={{ paddingBottom: '4rem' }}>
      {/* Hero Section */}
      <section
        style={{
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          background: 'radial-gradient(circle at top right, rgba(212, 160, 23, 0.15), transparent 40%)',
          padding: '4rem 0',
        }}
      >
        <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px' }}>
          <div style={{ display: 'inline-block' }}>
            <span className="tag">Mutlu Kasap • Mersin</span>
          </div>
          
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-1px' }}>
            Taze ve Kaliteli Et <br />
            <span className="text-gold">Kapınıza Gelsin</span>
          </h1>
          
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '600px' }}>
            Mersin&apos;in en iyi kasabı artık online! Özel marine edilmiş ürünlerimiz ve taze et çeşitlerimizle aynı gün kapınızdayız.
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
            <Link href="/urunler" className="btn-primary" style={{ padding: '0.9rem 2rem', fontSize: '1rem' }}>
              <Beef size={18} /> Sipariş Ver
            </Link>
            <Link href="/hakkimizda" className="btn-ghost" style={{ padding: '0.9rem 2rem', fontSize: '1rem' }}>
              Hakkımızda <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container" style={{ marginTop: '-4rem', marginBottom: '6rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {[
            {
              icon: <Beef size={28} className="text-gold" />,
              title: '%100 Yerli Besi',
              desc: 'Ürünlerimiz özenle seçilmiş, veteriner kontrollü yerli besi hayvanlarından elde edilmektedir.',
            },
            {
              icon: <Clock size={28} className="text-gold" />,
              title: 'Aynı Gün Teslimat',
              desc: 'Siparişleriniz özel soğutuculu araçlarımızla tazeliğini kaybetmeden kapınıza kadar gelir.',
            },
            {
              icon: <Truck size={28} className="text-gold" />,
              title: 'Kapıda Ödeme',
              desc: 'Siparişlerinizi kapıda nakit veya kredi kartı ile güvenle ödeyebilirsiniz.',
            },
          ].map((feature, i) => (
            <div key={i} className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ background: 'rgba(212, 160, 23, 0.1)', width: '56px', height: '56px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {feature.icon}
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{feature.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.5 }}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Products */}
      <section className="container" style={{ marginBottom: '6rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Flame size={20} className="text-gold" />
              <span style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Haftanın Favorileri</span>
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Popüler Ürünler</h2>
          </div>
          <Link href="/urunler" className="btn-ghost">
            Tümünü Gör <ArrowRight size={16} />
          </Link>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {popularProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <Link href="/urunler" className="btn-ghost" style={{ padding: '0.8rem 2rem' }}>
            Tüm Ürünleri İncele <ArrowRight size={18} />
          </Link>
        </div>
      </section>

    </div>
  );
}
