-- ============================================================
-- KASAP PANELİ - KULLANICI ADI İLE GİRİŞ FONKSİYONU
-- Bu SQL'i Supabase Dashboard > SQL Editor'da çalıştır
-- ============================================================

-- Bu fonksiyon username'den e-posta adresini döner
-- Login ekranı bu fonksiyonu çağırıp gelen e-posta ile giriş yapar
CREATE OR REPLACE FUNCTION get_email_by_username(p_username TEXT)
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT au.email 
  FROM auth.users au
  INNER JOIN profiles p ON p.id = au.id
  WHERE p.username = p_username
  LIMIT 1;
$$;

-- Mevcut kasap kullanıcısına username ata
-- (muratyldirim@gmail.com hesabına 'kasap' username'i ver)
UPDATE profiles SET username = 'kasap' WHERE role = 'kasap';
