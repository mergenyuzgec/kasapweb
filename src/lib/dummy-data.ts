import { Product, Order } from '@/types';

export const DUMMY_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Dana Kıyma',
    description: 'Taze, orta yağlı yerli dana kıyma.',
    price: 450.00,
    unit: 'kg',
    category: 'dana',
    image_url: 'https://images.unsplash.com/photo-1588168333986-5088c22789ae?q=80&w=600',
    in_stock: true,
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Dana Kuşbaşı',
    description: 'Lokum gibi yumuşacık dana kuşbaşı eti.',
    price: 480.00,
    unit: 'kg',
    category: 'dana',
    image_url: 'https://images.unsplash.com/photo-1603048297172-c92544798d5e?q=80&w=600',
    in_stock: true,
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Dana Antrikot',
    description: 'Özel dinlendirilmiş ızgaralık dana antrikot.',
    price: 650.00,
    unit: 'kg',
    category: 'dana',
    image_url: 'https://images.unsplash.com/photo-1551028150-64b9e398f678?q=80&w=600',
    in_stock: true,
    created_at: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Kuzu Pirzola',
    description: 'Özel taze kuzu pirzola.',
    price: 720.00,
    unit: 'kg',
    category: 'kuzu',
    image_url: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?q=80&w=600',
    in_stock: true,
    created_at: new Date().toISOString()
  },
  {
    id: '5',
    name: 'Bütün Tavuk',
    description: 'Temizlenmiş günlük taze bütün tavuk.',
    price: 110.00,
    unit: 'adet',
    category: 'tavuk',
    image_url: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=600',
    in_stock: true,
    created_at: new Date().toISOString()
  },
  {
    id: '6',
    name: 'Kasap Sucuk',
    description: 'Ev yapımı, %100 dana etinden özel baharatlı sucuk.',
    price: 550.00,
    unit: 'kg',
    category: 'hazir',
    image_url: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?q=80&w=600',
    in_stock: true,
    created_at: new Date().toISOString()
  }
];

// Mock for checking if user is "logged in" for dummy purposes
export const DUMMY_USER = {
  id: 'user-123',
  email: 'test@mutlukasap.com',
  user_metadata: { full_name: 'Ahmet Yılmaz' }
};

export const DUMMY_ORDERS: Order[] = [
  {
    id: 'ORD-8923',
    user_id: 'user-123',
    status: 'yolda',
    total_amount: 1120.00,
    delivery_address: {
      full_name: 'Ahmet Yılmaz',
      phone: '05321234567',
      district: 'mezitli',
      neighborhood: 'Fuat Morel',
      address_detail: 'Manolya Sok. No:5 D:12'
    },
    note: 'Lütfen etleri ince dilimleyin.',
    payment_method: 'kapida_odeme',
    items: [
      { product_id: '1', product_name: 'Dana Kıyma', quantity: 1, unit_price: 450.00 },
      { product_id: '3', product_name: 'Dana Antrikot', quantity: 1, unit_price: 650.00 }
    ],
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    updated_at: new Date().toISOString()
  },
  {
    id: 'ORD-7741',
    user_id: 'user-123',
    status: 'teslim_edildi',
    total_amount: 480.00,
    delivery_address: {
      full_name: 'Ahmet Yılmaz',
      phone: '05321234567',
      district: 'mezitli',
      neighborhood: 'Fuat Morel',
      address_detail: 'Manolya Sok. No:5 D:12'
    },
    note: null,
    payment_method: 'kapida_odeme',
    items: [
      { product_id: '2', product_name: 'Dana Kuşbaşı', quantity: 1, unit_price: 480.00 }
    ],
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
    updated_at: new Date().toISOString()
  }
]
