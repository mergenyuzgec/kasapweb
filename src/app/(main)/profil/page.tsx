'use client';

import { useEffect, useState, useCallback } from 'react';
import { User, LogOut, Phone, Mail, Clock, MapPin, Plus, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';
import { signOut } from '@/lib/auth';
import { useCartStore } from '@/store/cart';
import { SavedAddress, Profile } from '@/types';
import AddressSelector from '@/components/AddressSelector';

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [user, setUser] = useState<import('@supabase/supabase-js').User | null>(null);
  const [loading, setLoading] = useState(true);

  // Address add form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAddress, setNewAddress] = useState({ district: '', neighborhood: '', detail: '', valid: false });

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/giris');
        return;
      }
      setUser(user);

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      setProfile(profileData);
      setLoading(false);
    }
    loadData();
  }, [router]);

  const handleValidAddress = useCallback((district: string, neighborhood: string, detail: string) => {
    setNewAddress({ district, neighborhood, detail, valid: true });
  }, []);

  const handleInvalidAddress = useCallback(() => {
    setNewAddress(prev => prev.valid ? { ...prev, valid: false } : prev);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    useCartStore.getState().clearCart();
    toast.success('Çıkış yapıldı');
    router.push('/');
  };

  const handleAddAddress = async () => {
    if (!newTitle.trim() || !newAddress.valid) {
      toast.error('Lütfen adres başlığı ve tam adres giriniz');
      return;
    }
    if (!profile || !user) return;

    const generateId = () => {
      try {
        return crypto.randomUUID();
      } catch (e) {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      }
    };

    const newSavedAddress: SavedAddress = {
      id: generateId(),
      title: newTitle,
      district: newAddress.district,
      neighborhood: newAddress.neighborhood,
      address_detail: newAddress.detail,
    };

    const updatedAddresses = [...(profile.addresses || []), newSavedAddress];

    const { error } = await supabase
      .from('profiles')
      .update({ addresses: updatedAddresses })
      .eq('id', user.id);

    if (error) {
      toast.error('Adres eklenemedi');
      return;
    }

    setProfile({ ...profile, addresses: updatedAddresses });
    setShowAddForm(false);
    setNewTitle('');
    toast.success('Adres başarıyla eklendi');
  };

  const handleDeleteAddress = async (id: string) => {
    if (!profile || !user) return;
    const updatedAddresses = (profile.addresses || []).filter(a => a.id !== id);

    const { error } = await supabase
      .from('profiles')
      .update({ addresses: updatedAddresses })
      .eq('id', user.id);

    if (error) {
      toast.error('Adres silinemedi');
      return;
    }

    setProfile({ ...profile, addresses: updatedAddresses });
    toast.success('Adres başarıyla silindi');
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 0', maxWidth: '800px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>Profilim</h1>
        <div className="skeleton" style={{ height: '300px' }}></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="container" style={{ padding: '4rem 0', maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Profilim</h1>

      <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--bg-dark)', border: '2px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
            <User size={40} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.2rem' }}>{profile?.full_name || (user.email ? user.email.split('@')[0] : 'Kullanıcı')}</h2>
            <p className="badge badge-waiting">
              {profile?.role === 'kasap' ? 'Kasap / Admin' : 'Müşteri'}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-secondary)' }}>
            <Mail size={20} className="text-gold" />
            <span>{user.email || 'Email bilgisi yok'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-secondary)' }}>
            <Phone size={20} className="text-gold" />
            <span>{profile?.phone || 'Telefon bilgisi yok'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-secondary)' }}>
            <Clock size={20} className="text-gold" />
            <span>Kayıt Tarihi: {new Date(user.created_at).toLocaleDateString('tr-TR')}</span>
          </div>
        </div>

        <div style={{ marginTop: '1rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            className="btn-ghost"
            style={{ color: 'var(--error)', borderColor: 'rgba(239, 68, 68, 0.3)' }}
            onClick={handleSignOut}
          >
            <LogOut size={18} /> Çıkış Yap
          </button>
        </div>
      </div>

      {/* Adres Yönetimi Section */}
      <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          Kayıtlı Adreslerim
          <button 
            className="btn-ghost" 
            style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? 'Vazgeç' : <><Plus size={16} /> Yeni Ekle</>}
          </button>
        </h2>

        {showAddForm && (
          <div style={{ padding: '1.5rem', background: 'var(--bg-card-hover)', borderRadius: '12px', border: '1px solid var(--border)', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Adres Başlığı (Örn: Ev, İş)</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="Başlık girin..."
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                />
              </div>
            </div>
            
            <AddressSelector 
              onValidAddress={handleValidAddress}
              onInvalidAddress={handleInvalidAddress}
            />
            
            <button 
              className="btn-primary" 
              style={{ marginTop: '1.5rem', width: '100%', justifyContent: 'center' }}
              onClick={handleAddAddress}
              disabled={!newAddress.valid || !newTitle.trim()}
            >
              Adresi Kaydet
            </button>
          </div>
        )}

        {profile?.addresses && profile.addresses.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
            {profile.addresses.map((address) => (
              <div key={address.id} style={{ display: 'flex', flexDirection: 'column', padding: '1.5rem', border: '1px solid var(--border)', borderRadius: '8px', position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <MapPin size={18} className="text-gold" />
                  <span style={{ fontWeight: 700 }}>{address.title}</span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                  {address.district.toUpperCase()} / {address.neighborhood} <br/>
                  {address.address_detail}
                </p>
                <button 
                  onClick={() => handleDeleteAddress(address.id)}
                  style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.5rem' }}
                  title="Sil"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          !showAddForm && <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Kayıtlı adresiniz bulunmuyor.</p>
        )}
      </div>

    </div>
  );
}
