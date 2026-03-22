-- ============================================================
-- KASAP PANELİ - USERNAME DEĞİŞİKLİĞİ
-- Bu SQL'i Supabase Dashboard > SQL Editor'da çalıştır
-- ============================================================

-- Kasap kullanıcı adını muratyildirim olarak güncelle
UPDATE profiles SET username = 'muratyildirim' WHERE role = 'kasap';

-- Kontrol et:
-- SELECT id, full_name, username, role FROM profiles WHERE role = 'kasap';
