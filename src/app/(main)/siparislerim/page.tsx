'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Order } from '@/types';
import OrderStatusBadge from '@/components/OrderStatusBadge';
import { ShoppingBag, Package } from 'lucide-react';
import Link from 'next/link';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    async function loadOrders() {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        setLoading(false);
        return;
      }
      setUser(authUser.id);

      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('user_id', authUser.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setOrders(data.map((o: Order & { order_items: Order['items'] }) => ({
          ...o,
          items: o.order_items,
        })));
      }
      setLoading(false);
    }

    loadOrders();
  }, []);

  function formatDate(dateStr: string) {
    return new Intl.DateTimeFormat('tr-TR', {
      day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
    }).format(new Date(dateStr));
  }

  if (loading) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Yükleniyor...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
        <Package size={64} className="text-gold" />
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Giriş Yapmalısınız</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Siparişlerinizi görmek için giriş yapın.</p>
        <Link href="/giris" className="btn-primary" style={{ marginTop: '1rem' }}>
          Giriş Yap
        </Link>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
        <ShoppingBag size={64} className="text-gold" />
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Henüz Sipariş Yok</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Lezzetli ürünlerimize göz atarak ilk siparişinizi verin!</p>
        <Link href="/urunler" className="btn-primary" style={{ marginTop: '1rem' }}>
          Ürünlere Göz At
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3rem 0', maxWidth: '800px' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>Siparişlerim</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {orders.map(order => (
          <div key={order.id} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{formatDate(order.created_at)}</p>
              </div>
              <OrderStatusBadge status={order.status} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {order.items?.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{item.quantity}x {item.product_name}</span>
                  <span style={{ fontWeight: 600 }}>{(item.quantity * item.unit_price).toFixed(2)}₺</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Toplam</span>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)' }}>
                {order.total_amount.toFixed(2)}₺
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
