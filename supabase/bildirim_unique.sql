-- ============================================================
-- BİLDİRİM: UNIQUE CONSTRAINT HATASI ÇÖZÜMÜ
-- Bu SQL'i Supabase Dashboard > SQL Editor'da çalıştırın
-- ============================================================

-- Uygulama .upsert() yaparken 'onConflict: fcm_token' kullanıyor. 
-- Bunun çalışması için fcm_token kolonunun UNIQUE olması zorunludur.
ALTER TABLE kasap_devices ADD CONSTRAINT kasap_devices_fcm_token_key UNIQUE (fcm_token);
