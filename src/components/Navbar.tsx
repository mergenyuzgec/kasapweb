'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShoppingCart, User, LogOut, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useCartStore } from '@/store/cart';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';
import styles from './Navbar.module.css';
import CartDrawer from '@/components/CartDrawer';
import Image from 'next/image';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const totalCount = useCartStore((s) => s.getTotalCount());
  const [user, setUser] = useState<{ id: string; email?: string; full_name?: string } | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
    // Gerçek kullanıcı bilgisi al
    supabase.auth.getUser().then(async ({ data: { user: authUser } }) => {
      if (authUser) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', authUser.id)
          .single();

        setUser({
          id: authUser.id,
          email: authUser.email,
          full_name: profile?.full_name ?? authUser.email?.split('@')[0],
        });
      } else {
        setUser(null);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', session.user.id)
          .single();

        setUser({
          id: session.user.id,
          email: session.user.email,
          full_name: profile?.full_name ?? session.user.email?.split('@')[0],
        });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Dropdown dışı tıklama
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserMenuOpen(false);
    useCartStore.getState().clearCart();
    toast.success('Çıkış yapıldı');
    router.push('/');
  };

  const navLinks = [
    { href: '/', label: 'Ana Sayfa' },
    { href: '/urunler', label: 'Ürünler' },
    { href: '/hakkimizda', label: 'Hakkımızda' },
  ];

  // Siparişlerim sadece giriş yapmışsa göster
  if (user) {
    navLinks.push({ href: '/siparislerim', label: 'Siparişlerim' });
  }

  return (
    <>
      <nav className={styles.navbar}>
        <div className={`container ${styles.inner}`}>
          {/* Logo */}
          <Link href="/" className={styles.logo} style={{ zIndex: 10, position: 'relative', cursor: 'pointer' }}>
            <Image src="/logo.png" alt="Mutlu Kasap" width={280} height={90} style={{ objectFit: 'contain', height: '70px', width: 'auto' }} />
          </Link>

          {/* Nav Links */}
          <ul className={styles.navLinks}>
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`${styles.navLink} ${pathname === link.href ? styles.active : ''}`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className={styles.actions}>
            {/* Cart */}
            <button
              className={styles.cartBtn}
              onClick={() => setCartOpen(true)}
              aria-label="Sepeti aç"
            >
              <ShoppingCart size={20} />
              {isMounted && totalCount > 0 && (
                <span className={styles.cartBadge}>{totalCount}</span>
              )}
            </button>

            {/* User */}
            {user ? (
              <div className={styles.userMenu} ref={userMenuRef}>
                <button
                  className={styles.userBtn}
                  onClick={() => setUserMenuOpen((v) => !v)}
                >
                  <User size={16} />
                  <span>{user.full_name?.split(' ')[0] || 'Hesap'}</span>
                  <ChevronDown size={14} />
                </button>
                {userMenuOpen && (
                  <div className={styles.dropdown}>
                    <Link href="/profil" className={styles.dropdownItem} onClick={() => setUserMenuOpen(false)}>
                      <User size={14} />
                      Profilim
                    </Link>
                    <Link href="/siparislerim" className={styles.dropdownItem} onClick={() => setUserMenuOpen(false)}>
                      <ShoppingCart size={14} />
                      Siparişlerim
                    </Link>
                    <div className={styles.dropdownDivider} />
                    <button 
                      className={styles.dropdownItemDanger} 
                      onPointerDown={(e) => {
                        e.preventDefault();
                        handleSignOut();
                      }}
                    >
                      <LogOut size={14} />
                      Çıkış Yap
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/giris" className="btn-primary" style={{ padding: '0.5rem 1.1rem', fontSize: '0.875rem' }}>
                Giriş Yap
              </Link>
            )}
          </div>
        </div>
      </nav>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
