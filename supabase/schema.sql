-- KULLANICILAR (Supabase Auth yönetir, biz sadece profil ekleriz)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name TEXT NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'musteri',
  created_at TIMESTAMP DEFAULT NOW()
);

-- ÜRÜNLER
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  unit TEXT DEFAULT 'kg', -- 'kg' veya 'adet'
  category TEXT NOT NULL, -- 'dana', 'kuzu', 'tavuk', 'sakatat', 'hazir'
  image_url TEXT,
  in_stock BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- SİPARİŞLER
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  status TEXT DEFAULT 'bekliyor', 
  -- 'bekliyor' | 'hazirlaniyor' | 'yolda' | 'teslim_edildi' | 'iptal'
  total_amount NUMERIC(10,2) NOT NULL,
  delivery_address JSONB NOT NULL,
  -- { full_name, phone, district, neighborhood, address_detail }
  note TEXT,
  payment_method TEXT DEFAULT 'kapida_odeme',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- SİPARİŞ KALEMLERİ
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  product_name TEXT NOT NULL, -- Snapshot: ürün silinse bile kayıt kalır
  quantity NUMERIC(8,2) NOT NULL,
  unit_price NUMERIC(10,2) NOT NULL
);

-- KASAP CİHAZ TOKEN (FCM bildirimleri için ileride kullanılacak)
CREATE TABLE kasap_devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fcm_token TEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- RLS (Row Level Security) POLİTİKALARI

-- Profile access
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Product access
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Products are viewable by everyone" ON products FOR SELECT USING (true);

-- Orders access
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can insert their own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view their own orders" ON orders FOR SELECT USING (auth.uid() = user_id);

-- Order Items access
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can insert their own order items" ON order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM orders WHERE id = order_items.order_id AND user_id = auth.uid())
);
CREATE POLICY "Users can view their own order items" ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE id = order_items.order_id AND user_id = auth.uid())
);

-- =============================================================
-- KASAP RLS POLİTİKALARI
-- Bu policy'leri Supabase'de kasap rolündeki kullanıcılar için
-- ayrıca çalıştır (veya service_role key ile API üzerinden yönet)
-- =============================================================

-- Kasap tüm siparişleri görebilir
CREATE POLICY "Kasap can view all orders" ON orders
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'kasap')
  );

-- Kasap sipariş durumunu güncelleyebilir
CREATE POLICY "Kasap can update order status" ON orders
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'kasap')
  );

-- Kasap tüm sipariş kalemlerini görebilir
CREATE POLICY "Kasap can view all order items" ON order_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'kasap')
  );

-- Kasap tüm ürünleri yönetebilir (ekleme/güncelleme/silme)
CREATE POLICY "Kasap can manage products" ON products
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'kasap')
  );
