'use client';

import { useCartStore } from '@/store/cart';
import { ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotalPrice, clearCart } = useCartStore();
  const totalPrice = getTotalPrice();

  if (items.length === 0) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '50%', border: '1px solid var(--border)' }}>
          <ShoppingBag size={64} className="text-gold" />
        </div>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Sepetiniz Boş</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Farklı kategorilerdeki taze ürünlerimizi inceleyerek alışverişe başlayın.</p>
        </div>
        <Link href="/urunler" className="btn-primary" style={{ marginTop: '1rem' }}>
          Ürünlere Göz At
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3rem 0' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>Sepetim</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', alignItems: 'start', alignContent: 'start' }}>
        {/* Cart Items */}
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Sipariş Özeti</h3>
            <button className="btn-ghost" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }} onClick={clearCart}>
              Sepeti Temizle
            </button>
          </div>
          
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {items.map(item => (
              <li key={item.product.id} style={{ display: 'flex', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                <div style={{ width: '80px', height: '80px', background: 'var(--bg-dark)', borderRadius: '8px', position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
                  {item.product.image_url ? (
                    <Image src={item.product.image_url} alt={item.product.name} fill style={{ objectFit: 'cover' }} unoptimized />
                  ) : (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.75rem' }}>Görsel Yok</div>
                  )}
                </div>
                
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h4 style={{ fontWeight: 600, fontSize: '1rem' }}>{item.product.name}</h4>
                    <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{(item.product.price * item.quantity).toFixed(2)}₺</span>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-dark)', border: '1px solid var(--border)', borderRadius: '6px', overflow: 'hidden' }}>
                      <button style={{ width: '32px', height: '30px', background: 'transparent', border: 'none', color: 'var(--text-secondary)' }} onClick={() => updateQuantity(item.product.id, item.quantity - 0.5)}>−</button>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, padding: '0 0.5rem' }}>{item.quantity} {item.product.unit}</span>
                      <button style={{ width: '32px', height: '30px', background: 'transparent', border: 'none', color: 'var(--text-secondary)' }} onClick={() => updateQuantity(item.product.id, item.quantity + 0.5)}>+</button>
                    </div>
                    
                    <button style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.2rem' }} onClick={() => removeItem(item.product.id)}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Totals */}
        <div className="card" style={{ padding: '1.5rem', background: 'var(--bg-card-hover)', position: 'sticky', top: '90px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.5rem' }}>Toplam Tutar</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Ara Toplam</span>
              <span>{totalPrice.toFixed(2)}₺</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Teslimat Ücreti</span>
              <span>Hesaplanacak</span>
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', marginBottom: '2rem' }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>Ödenecek Tutar</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>{totalPrice.toFixed(2)}₺</span>
          </div>
          
          <Link href="/siparis/adres" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '1rem' }}>
            Adres Seçimine Git <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
