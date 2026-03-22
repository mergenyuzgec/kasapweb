import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="page-wrapper">
      <Navbar />
      <main>{children}</main>
      
      <footer style={{ borderTop: '1px solid var(--border)', padding: '4rem 2rem 2rem', marginTop: '4rem', backgroundColor: 'var(--bg-card)' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', margin: '0 auto', maxWidth: '1000px' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem', fontFamily: 'Outfit' }}>
              Mutlu <span style={{ color: 'var(--primary)' }}>Kasap</span>
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Mersin&apos;in en taze ve güvenilir et adresi. Günlük kesim, hızlı teslimat.
            </p>
          </div>
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Hızlı Linkler</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li><Link href="/" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textDecoration: 'none' }}>Ana Sayfa</Link></li>
              <li><Link href="/urunler" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textDecoration: 'none' }}>Ürünler</Link></li>
              <li><Link href="/hakkimizda" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textDecoration: 'none' }}>Hakkımızda</Link></li>
            </ul>
          </div>
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>İletişim</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Yenişehir Mahallesi No: 123<br/>Mersin</li>
              <li style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Tel: 0555 555 55 55</li>
              <li style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>E-posta: bilgi@mutlukasap.com</li>
            </ul>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            &copy; {new Date().getFullYear()} Mutlu Kasap. Tüm hakları saklıdır.
          </p>
        </div>
      </footer>
    </div>
  );
}
