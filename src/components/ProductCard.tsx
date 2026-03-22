'use client';

import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { Product } from '@/types';
import toast from 'react-hot-toast';
import styles from './ProductCard.module.css';
import Image from 'next/image';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);

  const handleAddToCart = () => {
    if (!product.in_stock) return;
    addItem(product, 1);
    toast.success(`${product.name} sepete eklendi`);
  };

  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className={styles.image}
            unoptimized
          />
        ) : (
          <div className={styles.noImage}>Görsel Yok</div>
        )}
        {!product.in_stock && (
          <div className={styles.outOfStock}>Tükendi</div>
        )}
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.name}>{product.name}</h3>
          <span className={styles.price}>{product.price.toFixed(2)}₺</span>
        </div>
        
        <p className={styles.desc}>
          {product.description || 'Taze ve kaliteli et.'}
        </p>
        
        <div className={styles.footer}>
          <div className={styles.unitInfo}>
            Birim: <strong>{product.unit === 'kg' ? 'Kilogram' : 'Adet'}</strong>
          </div>
          <button
            className={`btn-primary ${styles.addBtn}`}
            disabled={!product.in_stock}
            onClick={handleAddToCart}
          >
            <ShoppingCart size={16} />
            Ekle
          </button>
        </div>
      </div>
    </div>
  );
}
