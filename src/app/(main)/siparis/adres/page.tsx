'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cart';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';
import AddressSelector from '@/components/AddressSelector';
import { ArrowLeft, ArrowRight, MapPin, Plus } from 'lucide-react';
import Link from 'next/link';
import { SavedAddress, Profile } from '@/types';

export default function AddressPage() {
  const router = useRouter();
  const { items, getTotalPrice } = useCartStore();
  
  const [addressValid, setAddressValid] = useState(false);
  const [addressData, setAddressData] = useState({
    district: '',
    neighborhood: '',
    address_detail: '',
  });
  
  const [contactData, setContactData] = useState({
    full_name: '',
    phone: '',
  });
  
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [saveAddressToProfile, setSaveAddressToProfile] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (user) {
        setUser({ id: user.id });
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, phone, addresses')
          .eq('id', user.id)
          .single();
          
        if (profile) {
          setContactData(prev => ({
            full_name: prev.full_name || profile.full_name || '',
            phone: prev.phone || profile.phone || ''
          }));
          
          if (profile.addresses && profile.addresses.length > 0) {
            setSavedAddresses(profile.addresses);
            setSelectedAddressId(profile.addresses[0].id);
          } else {
            setShowNewAddressForm(true);
          }
        }
      } else {
        setShowNewAddressForm(true);
      }
    });

    if (items.length === 0) {
      router.replace('/sepet');
    }
  }, [items, router]);

  const handleValidAddress = useCallback((district: string, neighborhood: string, detail: string) => {
    setAddressData({ district, neighborhood, address_detail: detail });
    setAddressValid(true);
  }, []);

  const handleInvalidAddress = useCallback(() => {
    setAddressValid(false);
  }, []);

  const handleContinue = async () => {
    let finalAddress = null;

    if (showNewAddressForm) {
      if (!addressValid) return;
      finalAddress = addressData;
    } else {
      const selected = savedAddresses.find(a => a.id === selectedAddressId);
      if (!selected) return;
      finalAddress = {
        district: selected.district,
        neighborhood: selected.neighborhood,
        address_detail: selected.address_detail
      };
    }

    if (!finalAddress || !contactData.full_name || !contactData.phone) return;
    
    // Save to profile if new and checked
    if (user && showNewAddressForm && saveAddressToProfile) {
      const generateId = () => {
        try {
          return crypto.randomUUID();
        } catch (e) {
          return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        }
      };

      const newSavedAddress: SavedAddress = {
        id: generateId(),
        title: 'Yeni Adres',
        district: finalAddress.district,
        neighborhood: finalAddress.neighborhood,
        address_detail: finalAddress.address_detail,
      };
      const updatedAddresses = [...savedAddresses, newSavedAddress];
      const { error } = await supabase.from('profiles').update({
        addresses: updatedAddresses,
        full_name: contactData.full_name,
        phone: contactData.phone
      }).eq('id', user.id);
      
      if (error) {
        console.error('Profile update error:', error);
        toast.error('Adres profilinize kaydedilemedi ama siparişe devam edebilirsiniz.');
      }
    }
    
    // Save to sessionStorage for summary
    sessionStorage.setItem('checkout_data', JSON.stringify({
      address: finalAddress,
      contact: contactData
    }));
    
    router.push('/siparis/ozet');
  };

  if (items.length === 0) return null;

  const isFormValid = (showNewAddressForm ? addressValid : selectedAddressId !== null) && 
                      contactData.full_name.length > 3 && 
                      contactData.phone.length > 9;

  return (
    <div className="container" style={{ padding: '3rem 0', maxWidth: '800px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Link href="/sepet" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text-secondary)' }}>
          <ArrowLeft size={20} />
        </Link>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Teslimat Bilgileri</h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Adres Seçimi veya Yeni Adres Ekleme */}
        <section className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Teslimat Adresi</h3>
            {savedAddresses.length > 0 && !showNewAddressForm && (
              <button 
                className="btn-ghost" 
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                onClick={() => setShowNewAddressForm(true)}
              >
                <Plus size={14} /> Yeni Adres Ekle
              </button>
            )}
            {showNewAddressForm && savedAddresses.length > 0 && (
              <button 
                className="btn-ghost" 
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}
                onClick={() => setShowNewAddressForm(false)}
              >
                Kayıtlı Adreslerime Dön
              </button>
            )}
          </div>

          {!showNewAddressForm && savedAddresses.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {savedAddresses.map(address => (
                <div 
                  key={address.id} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    gap: '1rem', 
                    padding: '1.25rem', 
                    borderRadius: '8px', 
                    border: `2px solid ${selectedAddressId === address.id ? 'var(--primary)' : 'var(--border)'}`,
                    background: selectedAddressId === address.id ? 'rgba(212, 160, 23, 0.05)' : 'var(--bg-card)',
                    cursor: 'pointer'
                  }}
                  onClick={() => setSelectedAddressId(address.id)}
                >
                  <input 
                    type="radio" 
                    name="address" 
                    checked={selectedAddressId === address.id}
                    onChange={() => setSelectedAddressId(address.id)}
                    style={{ width: '1.2rem', height: '1.2rem', accentColor: 'var(--primary)', marginTop: '0.2rem' }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                      <MapPin size={16} className="text-gold" />
                      <span style={{ fontWeight: 700 }}>{address.title}</span>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                      {address.district.toUpperCase()} / {address.neighborhood} <br/>
                      {address.address_detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <AddressSelector 
                onValidAddress={handleValidAddress} 
                onInvalidAddress={handleInvalidAddress} 
              />
              
              {user && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0 0.5rem', marginTop: '0.5rem' }}>
                  <input 
                    type="checkbox" 
                    id="saveAddress" 
                    checked={saveAddressToProfile}
                    onChange={(e) => setSaveAddressToProfile(e.target.checked)}
                    style={{ width: '1.2rem', height: '1.2rem', accentColor: 'var(--primary)', cursor: 'pointer' }}
                  />
                  <label htmlFor="saveAddress" style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', cursor: 'pointer' }}>
                    Bu adresi profilime kaydet
                  </label>
                </div>
              )}
            </div>
          )}
        </section>

        {/* İletişim Bilgileri */}
        <section className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>İletişim Bilgileri</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Ad Soyad</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="Örn: Ahmet Yılmaz"
                value={contactData.full_name}
                onChange={(e) => setContactData(prev => ({ ...prev, full_name: e.target.value }))}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Telefon Numarası</label>
              <input 
                type="tel" 
                className="input-field" 
                placeholder="05XX XXX XX XX"
                value={contactData.phone}
                onChange={(e) => setContactData(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>
          </div>
        </section>

        {/* Sipariş Özeti Kısa */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', background: 'var(--bg-card-hover)', border: '1px solid var(--primary-glow)', borderRadius: '12px' }}>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Toplam Tutar</p>
            <p style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)' }}>{getTotalPrice().toFixed(2)}₺</p>
          </div>
          <button 
            className="btn-primary" 
            disabled={!isFormValid}
            onClick={handleContinue}
            style={{ padding: '0.8rem 2rem' }}
          >
            Siparişi Onayla <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
