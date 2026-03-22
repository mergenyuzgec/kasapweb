'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Beef, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      
      toast.success('Başarıyla giriş yapıldı!');
      const redirectUrl = sessionStorage.getItem('redirect_after_login') || '/urunler';
      sessionStorage.removeItem('redirect_after_login');
      router.push(redirectUrl);
      router.refresh();
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Giriş başarısız';
      toast.error(msg === 'Invalid login credentials' ? 'E-posta veya şifre hatalı.' : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ textAlign: 'center' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', textDecoration: 'none' }}>
          <Beef size={28} className="text-gold" />
          <span style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'Outfit', color: 'var(--text-primary)' }}>
            Mutlu <span style={{ color: 'var(--primary)' }}>Kasap</span>
          </span>
        </Link>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Tekrar Hoş Geldiniz</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Sipariş vermek için giriş yapın.</p>
      </div>

      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>E-posta Adresi</label>
          <input
            type="email"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Şifre</label>
          <input
            type="password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>

        <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem', padding: '0.8rem' }} disabled={loading}>
          {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'} <ArrowRight size={18} />
        </button>
      </form>

      <div style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
        Hesabınız yok mu? <Link href="/kayit" style={{ color: 'var(--primary)', fontWeight: 600 }}>Hemen Kayıt Olun</Link>
      </div>
    </div>
  );
}
