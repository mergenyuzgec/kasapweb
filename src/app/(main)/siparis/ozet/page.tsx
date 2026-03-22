'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cart';
import { ArrowLeft, CheckCircle2, AlertTriangle, FileText, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';

export default function OrderSummaryPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const totalPrice = getTotalPrice();
  
  const [checkoutData, setCheckoutData] = useState<{ address: { district: string; neighborhood: string; address_detail: string }; contact: { full_name: string; phone: string } } | null>(null);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [orderCompleted, setOrderCompleted] = useState(false);

  useEffect(() => {
    // Gerçek kullanıcı bilgisi al
    const fetchUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        setUser({ id: authUser.id, email: authUser.email ?? undefined });
      } else {
        setUser(null);
      }
      setIsAuthLoading(false);
    };
    fetchUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email ?? undefined });
      } else {
        setUser(null);
      }
      setIsAuthLoading(false);
    });

    const dataRaw = sessionStorage.getItem('checkout_data');
    if (!dataRaw || items.length === 0) {
      router.replace('/sepet');
      return;
    }
    setCheckoutData(JSON.parse(dataRaw));

    return () => subscription.unsubscribe();
  }, [items, router]);

  const handleCompleteOrder = async () => {
    if (!user) {
      sessionStorage.setItem('redirect_after_login', '/siparis/ozet');
      router.push('/giris');
      return;
    }

    if (!checkoutData) return;
    setLoading(true);
    
    try {
      // 1. Sipariş oluştur
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          status: 'bekliyor',
          total_amount: totalPrice,
          delivery_address: {
            full_name: checkoutData.contact.full_name,
            phone: checkoutData.contact.phone,
            district: checkoutData.address.district,
            neighborhood: checkoutData.address.neighborhood,
            address_detail: checkoutData.address.address_detail,
          },
          note: note || null,
          payment_method: 'kapida_odeme',
        })
        .select()
        .single();

      if (orderError || !order) throw orderError || new Error('Sipariş oluşturulamadı');

      // 2. Sipariş kalemlerini ekle
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.product.id,
        product_name: item.product.name,
        quantity: item.quantity,
        unit_price: item.product.price,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Sipariş başarıyla verildikten sonra adminleri bilgilendir (bildirim)
      const { data: { session } } = await supabase.auth.getSession();
      fetch('/api/notify-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          orderDetails: {
            id: order.id,
            fullName: checkoutData.contact.full_name,
            totalAmount: totalPrice.toFixed(2),
          }
        }),
      }).catch(err => console.error('Push notification API error:', err));

      toast.success('Siparişiniz başarıyla alındı! 🎉');
      clearCart();
      sessionStorage.removeItem('checkout_data');
      setOrderCompleted(true);
    } catch (error: unknown) {
      console.error('Order/Items Error:', error);
      const msg = error instanceof Error 
        ? error.message 
        : (typeof error === 'object' && error !== null && 'message' in error)
          ? String((error as Error).message)
          : 'Sipariş gönderilemedi';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (orderCompleted) {
    return (
      <div className="container" style={{ padding: '6rem 0', maxWidth: '600px', textAlign: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
          <CheckCircle2 size={80} color="var(--success)" />
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Siparişiniz Alındı!</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', lineHeight: 1.6 }}>
            Siparişinizi başarıyla aldık. En kısa sürede hazırlayıp {checkoutData?.address.district} bölgesindeki adresinize teslim edeceğiz.
          </p>
          
          {/* Google Review Prompt */}
          <div className="card" style={{ padding: '2rem', marginTop: '1rem', border: '1px solid var(--primary-glow)', background: 'linear-gradient(135deg, rgba(212, 160, 23, 0.1) 0%, transparent 100%)' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1rem' }}>Bizi Değerlendirin! ⭐</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
              Hizmetimizden memnun kaldıysanız, Google Haritalar üzerinde bize bir değerlendirme bırakarak destek olabilirsiniz.
            </p>
            <a 
              href="https://g.page/r/CbN5e_0CR5IzEBM/review" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-primary"
              style={{ display: 'inline-flex', justifyContent: 'center', padding: '0.8rem 2rem' }}
            >
              Google&apos;da Değerlendir
            </a>
          </div>

          <Link href="/siparislerim" className="btn-ghost" style={{ marginTop: '1rem' }}>
            Siparişlerimi Görüntüle <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  if (!checkoutData) return null;

  return (
    <div className="container" style={{ padding: '3rem 0', maxWidth: '800px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Link href="/siparis/adres" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text-secondary)' }}>
          <ArrowLeft size={20} />
        </Link>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Siparişi Onayla</h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Uyarı - giriş yapılmamışsa */}
        {!user && !isAuthLoading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '8px', color: 'var(--warning)' }}>
            <AlertTriangle size={24} />
            <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>Siparişi tamamlamak için üye girişi yapmanız gerekmektedir.</p>
          </div>
        )}

        {/* Adres Özeti */}
        <section className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>Teslimat Adresi</h3>
          <div>
            <p style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '0.2rem' }}>{checkoutData.contact.full_name} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({checkoutData.contact.phone})</span></p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
              {checkoutData.address.district.toUpperCase()} / {checkoutData.address.neighborhood} <br/>
              {checkoutData.address.address_detail}
            </p>
          </div>
        </section>

        {/* Sipariş Notu */}
        <section className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={18} /> Sipariş Notu
          </h3>
          <textarea
            className="input-field"
            rows={3}
            placeholder="Kasaba iletmek istediğiniz özel bir istek var mı? (Örn: İnce dilimlensin, az yağlı olsun vb.)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </section>
        
        {/* Ödeme Yöntemi */}
        <section className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>Ödeme Yöntemi</h3>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', background: 'rgba(34, 197, 94, 0.05)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
             <CheckCircle2 color="var(--success)" size={20} style={{ flexShrink: 0, marginTop: '2px' }}/>
             <div>
               <p style={{ fontWeight: 600, color: 'var(--success)' }}>Kapıda Ödeme</p>
               <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Siparişiniz teslim edildiğinde nakit veya kredi kartı ile ödeme yapabilirsiniz.</p>
             </div>
          </div>
        </section>

        {/* Sipariş Tamamla */}
        <div style={{ padding: '1.5rem', background: 'var(--bg-card-hover)', border: '1px solid var(--border-accent)', borderRadius: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Ödenecek Tutar</span>
            <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)' }}>{totalPrice.toFixed(2)}₺</span>
          </div>
          <button 
            className="btn-primary" 
            style={{ width: '100%', justifyContent: 'center', padding: '1rem' }}
            onClick={handleCompleteOrder}
            disabled={loading || isAuthLoading}
          >
            {loading || isAuthLoading ? 'İşleniyor...' : (user ? 'Siparişi Tamamla' : 'Giriş Yap ve Sipariş Ver')}
          </button>
        </div>

      </div>
    </div>
  );
}
