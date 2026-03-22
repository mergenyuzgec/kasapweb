-- Örnek Ürünler (Seed Data)

INSERT INTO products (name, description, price, unit, category, image_url, in_stock) VALUES
('Dana Kıyma', 'Taze, orta yağlı dana kıyma.', 450.00, 'kg', 'dana', 'https://images.unsplash.com/photo-1588168333986-5088c22789ae?q=80&w=600', true),
('Dana Kuşbaşı', 'Lokum gibi yumuşacık dana kuşbaşı eti.', 480.00, 'kg', 'dana', 'https://images.unsplash.com/photo-1603048297172-c92544798d5e?q=80&w=600', true),
('Dana Antrikot', 'Özel dinlendirilmiş ızgaralık dana antrikot.', 650.00, 'kg', 'dana', 'https://images.unsplash.com/photo-1551028150-64b9e398f678?q=80&w=600', true),

('Kuzu Pirzola', 'Özel taze kuzu pirzola.', 720.00, 'kg', 'kuzu', 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?q=80&w=600', true),
('Kuzu Şiş', 'Marine edilmiş, şişlik yumuşacık kuzu eti.', 690.00, 'kg', 'kuzu', null, true),

('Bütün Tavuk', 'Temizlenmiş günlük taze bütün tavuk.', 110.00, 'adet', 'tavuk', 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=600', true),
('Tavuk Göğüs', 'Kemiksiz tavuk göğüs fileto.', 180.00, 'kg', 'tavuk', null, true),
('Tavuk Kanat', 'Izgaralık özel soslu tavuk kanat.', 210.00, 'kg', 'tavuk', 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=600', true),

('Kasap Sucuk', 'Ev yapımı, %100 dana etinden özel baharatlı sucuk.', 550.00, 'kg', 'hazir', null, true),
('İnegöl Köfte', 'Özel yapım günlük taze köfte.', 480.00, 'kg', 'hazir', 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?q=80&w=600', true);
