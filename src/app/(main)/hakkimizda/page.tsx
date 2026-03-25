import { Beef, CheckCircle2, Truck, ShieldCheck, MapPin } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="container" style={{ padding: '4rem 0', maxWidth: '800px' }}>

      {/* Hero Section */}
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(212, 160, 23, 0.1)', color: 'var(--primary)', marginBottom: '1.5rem' }}>
          <Beef size={40} />
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'Outfit, sans-serif', marginBottom: '1rem' }}>
          Mutlu <span style={{ color: 'var(--primary)' }}>Kasap</span> Hakkında
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
          1998 yılından bu yana Mersin&apos;de, en taze ve kaliteli etleri sofralarınıza getirmenin gururunu yaşıyoruz. Geleneksel kasaplık zanaatını modern hizmet anlayışıyla birleştirdik.
        </p>
      </div>

      {/* Story Section */}
      <div className="card" style={{ padding: '3rem', marginBottom: '4rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 700, borderBottom: '2px solid var(--border)', paddingBottom: '1rem' }}>Hikayemiz</h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1.05rem' }}>
          Küçük bir dükkanda başlayan serüvenimiz, yıllar içinde müşterilerimizin güveni ve desteğiyle büyüdü. &quot;Önce Kalite&quot; diyerek çıktığımız bu yolda, sadece kendi sofralarımıza koyabileceğimiz etleri satışa sunduk. Yerli besicilerle kurduğumuz sağlam ilişkiler sayesinde, kaynağı belli, helal kesim ve veteriner hekim kontrollü ürünleri garantiliyoruz.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1.05rem' }}>
          Bugün, gelişen teknolojiyle birlikte hizmet kalitemizi bir üst seviyeye taşıdık. Yeni web sitemiz ve online sipariş altyapımız ile Mutlu Kasap lezzetini, kapınıza kadar aynı tazelikte ulaştırıyoruz.
        </p>
      </div>

      {/* Values */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
        <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
          <ShieldCheck size={36} className="text-gold" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>%100 Güvenilir</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>Tüm etlerimiz İslami usullere uygun kesim, veteriner kontrollü ve yerli besidir.</p>
        </div>
        <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
          <CheckCircle2 size={36} className="text-gold" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Taze & Günlük</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>Tezgahımıza giren her ürün günlük olarak işlenir ve taptaze sizlere sunulur.</p>
        </div>
        <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
          <Truck size={36} className="text-gold" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Hızlı Teslimat</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>Siparişleriniz en kısa sürede kapınıza gelir.</p>
        </div>
      </div>

      {/* Contact info overlay style */}
      <div style={{ backgroundColor: 'rgba(212, 160, 23, 0.05)', border: '1px solid var(--primary)', borderRadius: '16px', padding: '2.5rem', textAlign: 'center' }}>
        <MapPin size={32} className="text-gold" style={{ margin: '0 auto 1rem' }} />
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Bizi Ziyaret Edin</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginBottom: '0.5rem' }}>
          Mutlu Kasap
        </p>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginBottom: '1.5rem' }}>
          Mersin
        </p>

        <div style={{ width: '100%', height: '300px', borderRadius: '12px', overflow: 'hidden', marginBottom: '2rem', border: '1px solid var(--border)' }}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3196.8!2d34.5397063!3d36.7507504!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x15278bfd9ae64963%3A0x33924702fd7b79b3!2smutlu%20kasap!5e0!3m2!1str!2str!4v1700000000000!5m2!1str!2str"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

        <a href="tel:03243593327" className="btn-primary" style={{ display: 'inline-flex', padding: '0.75rem 2rem' }}>
          0 (324) 359 33 27
        </a>
      </div>

    </div>
  );
}
