import { supabase } from './supabase';

// SMS OTP aktif/pasif ayarı — API hazır olunca true yapılacak
export const OTP_ENABLED = false;

/**
 * Telefon numarasına SMS OTP kodu gönderir.
 * API henüz hazır olmadığı için şu an sadece placeholder.
 */
export async function sendOtp(phone: string): Promise<{ success: boolean; error?: string }> {
  if (!OTP_ENABLED) {
    // OTP devre dışı — her zaman başarılı döner
    return { success: true };
  }

  // TODO: SMS API entegrasyonu yapılacak
  // Örnek:
  // const response = await fetch('/api/sms/send-otp', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ phone }),
  // });
  // const data = await response.json();
  // return { success: data.success, error: data.error };

  return { success: false, error: 'SMS API henüz entegre edilmedi' };
}

/**
 * Kullanıcının girdiği OTP kodunu doğrular.
 * API henüz hazır olmadığı için şu an sadece placeholder.
 */
export async function verifyOtp(phone: string, code: string): Promise<{ success: boolean; error?: string }> {
  if (!OTP_ENABLED) {
    // OTP devre dışı — her zaman başarılı döner
    return { success: true };
  }

  // TODO: SMS API entegrasyonu yapılacak
  // Örnek:
  // const response = await fetch('/api/sms/verify-otp', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ phone, code }),
  // });
  // const data = await response.json();
  // return { success: data.success, error: data.error };

  return { success: false, error: 'SMS API henüz entegre edilmedi' };
}

export async function signUp(email: string, password: string, fullName: string, phone: string = '') {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, phone },
    },
  });
  if (error) throw error;

  if (data.user) {
    await supabase.from('profiles').upsert({
      id: data.user.id,
      full_name: fullName,
      phone: phone,
      role: 'musteri',
    });
  }

  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error) return null;
  return user;
}

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) return null;
  return data;
}
