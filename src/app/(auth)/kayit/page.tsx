'use client';

import { useState } from 'react';
import { signUp, sendOtp, verifyOtp, OTP_ENABLED } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Beef, ArrowRight, ArrowLeft, ShieldCheck } from 'lucide-react';

type Step = 'form' | 'otp';

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('form');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);

  // Adım 1: Formu doldur → OTP gönder
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error('Şifre en az 6 karakter olmalıdır');
      return;
    }
    if (!phone.trim()) {
      toast.error('Telefon numarası zorunludur');
      return;
    }

    setLoading(true);
    try {
      if (OTP_ENABLED) {
        const result = await sendOtp(phone);
        if (!result.success) {
          toast.error(result.error || 'SMS gönderilemedi');
          return;
        }
        toast.success('Doğrulama kodu telefonunuza gönderildi');
        setStep('otp');
      } else {
        // OTP devre dışı — doğrudan kayıt yap
        await completeRegistration();
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Bir hata oluştu';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Adım 2: OTP doğrula → Kayıt tamamla
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length < 4) {
      toast.error('Lütfen geçerli bir doğrulama kodu girin');
      return;
    }

    setLoading(true);
    try {
      const result = await verifyOtp(phone, otpCode);
      if (!result.success) {
        toast.error(result.error || 'Doğrulama kodu hatalı');
        return;
      }
      await completeRegistration();
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Bir hata oluştu';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Kayıt işlemini tamamla
  const completeRegistration = async () => {
    await signUp(email, password, fullName, phone);
    toast.success('Kayıt başarılı! Yönlendiriliyorsunuz...');

    const redirectUrl = sessionStorage.getItem('redirect_after_login') || '/urunler';
    sessionStorage.removeItem('redirect_after_login');
    setTimeout(() => {
      router.push(redirectUrl);
      router.refresh();
    }, 500);
  };

  // SMS kodunu tekrar gönder
  const handleResendOtp = async () => {
    setLoading(true);
    try {
      const result = await sendOtp(phone);
      if (result.success) {
        toast.success('Doğrulama kodu tekrar gönderildi');
      } else {
        toast.error(result.error || 'SMS gönderilemedi');
      }
    } catch {
      toast.error('SMS gönderilirken hata oluştu');
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

        {step === 'form' ? (
          <>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Hesap Oluştur</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Hızlı sipariş vermek için hemen ücretsiz kayıt olun.</p>
          </>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}>
              <ShieldCheck size={40} style={{ color: 'var(--primary)' }} />
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>SMS Doğrulama</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              <strong>{phone}</strong> numarasına gönderilen kodu girin.
            </p>
          </>
        )}
      </div>

      {/* Adım 1: Kayıt Formu */}
      {step === 'form' && (
        <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Ad Soyad</label>
            <input
              type="text"
              className="input-field"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              autoComplete="name"
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Telefon Numarası</label>
            <input
              type="tel"
              className="input-field"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="05XX XXX XX XX"
              required
              autoComplete="tel"
            />
          </div>

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
              minLength={6}
              autoComplete="new-password"
            />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem', padding: '0.8rem' }} disabled={loading}>
            {loading ? 'İşleniyor...' : (OTP_ENABLED ? 'Doğrulama Kodu Gönder' : 'Ücretsiz Kayıt Ol')} <ArrowRight size={18} />
          </button>
        </form>
      )}

      {/* Adım 2: OTP Doğrulama */}
      {step === 'otp' && (
        <form onSubmit={handleOtpSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Doğrulama Kodu</label>
            <input
              type="text"
              className="input-field"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="_ _ _ _ _ _"
              required
              autoComplete="one-time-code"
              inputMode="numeric"
              maxLength={6}
              style={{ textAlign: 'center', letterSpacing: '0.5em', fontSize: '1.3rem', fontWeight: 700 }}
            />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.8rem' }} disabled={loading}>
            {loading ? 'Doğrulanıyor...' : 'Doğrula ve Kayıt Ol'} <ShieldCheck size={18} />
          </button>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              type="button"
              onClick={() => { setStep('form'); setOtpCode(''); }}
              style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem' }}
            >
              <ArrowLeft size={14} /> Geri Dön
            </button>
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={loading}
              style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}
            >
              Tekrar Gönder
            </button>
          </div>
        </form>
      )}

      <div style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
        Zaten hesabınız var mı? <Link href="/giris" style={{ color: 'var(--primary)', fontWeight: 600 }}>Giriş Yapın</Link>
      </div>
    </div>
  );
}
