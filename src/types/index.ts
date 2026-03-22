export type OrderStatus =
  | 'bekliyor'
  | 'hazirlaniyor'
  | 'yolda'
  | 'teslim_edildi'
  | 'iptal';

export type ProductCategory =
  | 'dana'
  | 'kuzu'
  | 'tavuk'
  | 'sakatat'
  | 'sarküteri'
  | 'hazir';

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  unit: 'kg' | 'adet';
  category: ProductCategory;
  image_url: string | null;
  in_stock: boolean;
  created_at: string;
}

export interface DeliveryAddress {
  full_name: string;
  phone: string;
  district: string;
  neighborhood: string;
  address_detail: string;
}

export interface SavedAddress {
  id: string; // uuid
  title: string; // e.g., 'Ev', 'İş'
  district: string;
  neighborhood: string;
  address_detail: string;
}

export interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
}

export interface Order {
  id: string;
  user_id: string;
  status: OrderStatus;
  total_amount: number;
  delivery_address: DeliveryAddress;
  note: string | null;
  payment_method: string;
  items?: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface DeliveryZoneInfo {
  available: boolean;
  minOrder?: number;
  deliveryTime?: string;
  fee?: number;
  message: string;
}

export interface Profile {
  id: string;
  full_name: string;
  phone: string | null;
  role: 'musteri' | 'kasap';
  addresses?: SavedAddress[] | null;
  created_at: string;
}
