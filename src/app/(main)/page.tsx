import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Beef, Truck, Clock, Star, Instagram } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const categories = [
  {
    key: 'dana',
    label: 'Dana',
    desc: 'Taze dana eti çeşitleri: kıyma, kuşbaşı, biftek ve daha fazlası.',
    emoji: '🥩',
    color: '#c0392b',
  },
  {
    key: 'kuzu',
    label: 'Kuzu',
    desc: 'Kuzu pirzola, kuzu but, kuzu incik ve özel parçalar.',
    emoji: '🐑',
    color: '#8e44ad',
  },
  {
    key: 'tavuk',
    label: 'Piliç',
    desc: 'Taze piliç göğüs, but, kanat ve bütün piliç çeşitleri.',
    emoji: '🍗',
    color: '#e67e22',
  },
  {
    key: 'sakatat',
    label: 'Sakatat',
    desc: 'Ciğer, böbrek, işkembe ve daha fazla sakatat çeşitleri.',
    emoji: '🫀',
    color: '#d35400',
  },
  {
    key: 'sarküteri',
    label: 'Şarküteri',
    desc: 'Sucuk, pastırma, sosis ve özel şarküteri ürünleri.',
    emoji: '🌭',
    color: '#2980b9',
  },
  {
    key: 'hazir',
    label: 'Special Hazır Ürünler',
    desc: 'Özel marine edilmiş ve pişirmeye hazır lezzetler.',
    emoji: '🍖',
    color: '#27ae60',
  },
];

export default function HomePage() {
  return (
    <div style={{ paddingBottom: '4rem' }}>
      {/* Hero Section */}
      <section
        style={{
          minHeight: '70vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          padding: '4rem 0',
        }}
      >
        <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div style={{ marginBottom: '1rem' }}>
            <Image
              src="/hero-logo.png"
              alt="Mutlu Kasap"
              width={800}
              height={400}
              priority
              style={{ objectFit: 'contain', width: '100%', maxWidth: '550px', height: 'auto' }}
            />
          </div>
          
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-1px' }}>
            Taze ve Kaliteli Et <br />
            <span className="text-gold">Kapınıza Gelsin</span>
          </h1>
          
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '600px' }}>
            Mersin&apos;in en iyi kasabı artık online! Özel marine edilmiş ürünlerimiz ve taze et çeşitlerimizle aynı gün kapınızdayız.
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '1rem' }}>
            <Link href="/urunler" className="btn-primary" style={{ padding: '0.9rem 2rem', fontSize: '1rem' }}>
              <Beef size={18} /> Sipariş Ver
            </Link>
            <Link href="/hakkimizda" className="btn-ghost" style={{ padding: '0.9rem 2rem', fontSize: '1rem' }}>
              Hakkımızda <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Category Cards */}
      <section className="container" style={{ marginTop: '-3rem', marginBottom: '4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Beef size={20} className="text-gold" />
            <span style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Kategoriler</span>
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Ürün Kategorilerimiz</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '1rem' }}>
            Aradığınız kategoriyi seçerek ürünlerimizi inceleyin
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
          {categories.map((cat) => (
            <Link
              key={cat.key}
              href={`/urunler?kategori=${cat.key}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                padding: '1.75rem 2rem',
                borderRadius: '16px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                transition: 'all 0.25s ease',
                textDecoration: 'none',
                color: 'inherit',
                position: 'relative',
                overflow: 'hidden',
              }}
              className="category-card"
            >
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: `linear-gradient(90deg, ${cat.color}, transparent)`,
                opacity: 0.7,
              }} />
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.25rem',
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  background: `${cat.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                  flexShrink: 0,
                }}>
                  {cat.emoji}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.35rem' }}>{cat.label}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                    {cat.desc}
                  </p>
                </div>
                <ArrowRight size={20} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Social Cards — Instagram & Google */}
      <section className="container" style={{ marginBottom: '4rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          
          {/* Instagram Card */}
          <a
            href="https://www.instagram.com/mutlukasap33"
            target="_blank"
            rel="noopener noreferrer"
            className="category-card"
            style={{
              display: 'block',
              padding: '2.5rem',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #833AB4 0%, #E1306C 50%, #F77737 100%)',
              textDecoration: 'none',
              color: '#fff',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
            }}
          >
            {/* Decorative circles */}
            <div style={{
              position: 'absolute',
              top: '-30px',
              right: '-30px',
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)',
            }} />
            <div style={{
              position: 'absolute',
              bottom: '-20px',
              left: '-20px',
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.08)',
            }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                background: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem',
              }}>
                <Instagram size={32} />
              </div>
              
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                Bizi Takip Edin
              </h3>
              <p style={{ fontSize: '1rem', opacity: 0.9, marginBottom: '1.5rem', lineHeight: 1.5 }}>
                Taze ürünlerimiz, özel kampanyalarımız ve mutfak ilhamları için Instagram&apos;da bizi takip edin!
              </p>
              
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.7rem 1.5rem',
                borderRadius: '999px',
                background: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)',
                fontWeight: 700,
                fontSize: '0.95rem',
              }}>
                @mutlukasap33 <ArrowRight size={16} />
              </div>
            </div>
          </a>

          {/* Google Review Card */}
          <a
            href="https://g.page/r/CbN5e_0CR5IzEBM/review"
            target="_blank"
            rel="noopener noreferrer"
            className="category-card"
            style={{
              display: 'block',
              padding: '2.5rem',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
              border: '1px solid rgba(66, 133, 244, 0.3)',
              textDecoration: 'none',
              color: '#fff',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
            }}
          >
            {/* Decorative stars */}
            <div style={{
              position: 'absolute',
              top: '15px',
              right: '20px',
              display: 'flex',
              gap: '4px',
              opacity: 0.15,
            }}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={24} fill="#FBBC04" color="#FBBC04" />
              ))}
            </div>
            <div style={{
              position: 'absolute',
              bottom: '-15px',
              right: '-15px',
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: 'rgba(66, 133, 244, 0.08)',
            }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                background: 'rgba(66, 133, 244, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem',
              }}>
                <Star size={32} color="#FBBC04" fill="#FBBC04" />
              </div>
              
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                Bizi Değerlendirin
              </h3>
              <p style={{ fontSize: '1rem', opacity: 0.85, marginBottom: '1.5rem', lineHeight: 1.5 }}>
                Hizmetimizden memnun kaldıysanız, Google üzerinden bir değerlendirme bırakarak bize destek olun!
              </p>
              
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
              }}>
                <div style={{
                  display: 'flex',
                  gap: '3px',
                }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} fill="#FBBC04" color="#FBBC04" />
                  ))}
                </div>
                <span style={{
                  padding: '0.6rem 1.3rem',
                  borderRadius: '999px',
                  background: 'rgba(66, 133, 244, 0.2)',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  color: '#8AB4F8',
                }}>
                  Google&apos;da Değerlendir <ArrowRight size={14} style={{ display: 'inline', verticalAlign: 'middle' }} />
                </span>
              </div>
            </div>
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section className="container" style={{ marginBottom: '4rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {[
            {
              icon: <Beef size={32} className="text-gold" />,
              title: '%100 Yerli Besi',
              desc: 'Ürünlerimiz özenle seçilmiş, veteriner kontrollü yerli besi hayvanlarından elde edilmektedir.',
            },
            {
              icon: <Clock size={32} className="text-gold" />,
              title: 'Aynı Gün Teslimat',
              desc: 'Siparişleriniz özel soğutuculu araçlarımızla tazeliğini kaybetmeden kapınıza kadar gelir.',
            },
            {
              icon: <Truck size={32} className="text-gold" />,
              title: 'Kapıda Ödeme',
              desc: 'Siparişlerinizi kapıda nakit veya kredi kartı ile güvenle ödeyebilirsiniz.',
            },
          ].map((feature, i) => (
            <div key={i} className="card" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ background: 'rgba(212, 160, 23, 0.1)', width: '64px', height: '64px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {feature.icon}
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>{feature.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6 }}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
