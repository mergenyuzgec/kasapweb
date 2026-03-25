// Mahalleye göre minimum sepet tutarı (TL)
// Listede olmayan mahallelere teslimat yapılmaz

export interface MinimumCartConfig {
  district: string;
  neighborhood: string;
  minAmount: number;
}

export const MINIMUM_CART_AMOUNTS: MinimumCartConfig[] = [
  // YENİŞEHİR MAHALLELERİ (hepsi 3000 TL)
  { district: 'Yenişehir', neighborhood: 'Yıl Mahallesi', minAmount: 3000 },
  { district: 'Yenişehir', neighborhood: 'Akkent Mahallesi', minAmount: 3000 },
  { district: 'Yenişehir', neighborhood: 'Aydınlıkevler Mahallesi', minAmount: 3000 },
  { district: 'Yenişehir', neighborhood: 'Bahçelievler Mahallesi', minAmount: 3000 },
  { district: 'Yenişehir', neighborhood: 'Barbaros Mahallesi', minAmount: 3000 },
  { district: 'Yenişehir', neighborhood: 'Batıkent Mahallesi', minAmount: 3000 },
  { district: 'Yenişehir', neighborhood: 'Cumhuriyet Mahallesi', minAmount: 3000 },
  { district: 'Yenişehir', neighborhood: 'Çiftlikköy Mahallesi', minAmount: 3000 },
  { district: 'Yenişehir', neighborhood: 'Eğriçam Mahallesi', minAmount: 3000 },
  { district: 'Yenişehir', neighborhood: 'Fuatmorel Mahallesi', minAmount: 3000 },
  { district: 'Yenişehir', neighborhood: 'Güvenevler Mahallesi', minAmount: 3000 },
  { district: 'Yenişehir', neighborhood: 'Hürriyet Mahallesi', minAmount: 3000 },
  { district: 'Yenişehir', neighborhood: 'İnönü Mahallesi', minAmount: 3000 },
  { district: 'Yenişehir', neighborhood: 'Kocavilayet Mahallesi', minAmount: 3000 },
  { district: 'Yenişehir', neighborhood: 'Kuzeykent Mahallesi', minAmount: 3000 },
  { district: 'Yenişehir', neighborhood: 'Limonluk Mahallesi', minAmount: 3000 },
  { district: 'Yenişehir', neighborhood: 'Menteş Mahallesi', minAmount: 3000 },
  { district: 'Yenişehir', neighborhood: 'Palmiye Mahallesi', minAmount: 3000 },
  { district: 'Yenişehir', neighborhood: 'Pirireis Mahallesi', minAmount: 3000 },

  // MEZİTLİ MAHALLELERİ
  { district: 'Mezitli', neighborhood: '75. Yıl Mahallesi', minAmount: 2000 },
  { district: 'Mezitli', neighborhood: 'Akdeniz Mahallesi', minAmount: 2000 },
  { district: 'Mezitli', neighborhood: 'Atatürk Mahallesi', minAmount: 2000 },
  { district: 'Mezitli', neighborhood: 'Çamlıca Mahallesi', minAmount: 2000 },
  { district: 'Mezitli', neighborhood: 'Çankaya Mahallesi', minAmount: 2000 },
  { district: 'Mezitli', neighborhood: 'Davultepe Mahallesi', minAmount: 2000 },
  { district: 'Mezitli', neighborhood: 'Deniz Mahallesi', minAmount: 3000 },
  { district: 'Mezitli', neighborhood: 'Esenbağlar Mahallesi', minAmount: 2000 },
  { district: 'Mezitli', neighborhood: 'Eski Mezitli Mahallesi', minAmount: 2000 },
  { district: 'Mezitli', neighborhood: 'Fatih Mahallesi', minAmount: 1000 },
  { district: 'Mezitli', neighborhood: 'Fındıkpınarı Mahallesi', minAmount: 2000 },
  { district: 'Mezitli', neighborhood: 'Kaleköy Mahallesi', minAmount: 2000 },
  { district: 'Mezitli', neighborhood: 'Kuyuluk Mahallesi', minAmount: 2000 },
  { district: 'Mezitli', neighborhood: 'Menderes Mahallesi', minAmount: 1000 },
  { district: 'Mezitli', neighborhood: 'Merkez Mahallesi', minAmount: 1500 },
  { district: 'Mezitli', neighborhood: 'Tece Mahallesi', minAmount: 3000 },
  { district: 'Mezitli', neighborhood: 'Viranşehir Mahallesi', minAmount: 500 },
  { district: 'Mezitli', neighborhood: 'Yeni Mahalle', minAmount: 500 },
];

/**
 * Seçilen mahalle için minimum sepet tutarını döner.
 * Eğer mahalle listede yoksa null döner (teslimat yapılmaz).
 */
export function getMinimumAmount(district: string, neighborhood: string): number | null {
  const config = MINIMUM_CART_AMOUNTS.find(
    (c) =>
      c.district.toLowerCase() === district.toLowerCase() &&
      c.neighborhood.toLowerCase() === neighborhood.toLowerCase()
  );
  return config?.minAmount ?? null;
}

/**
 * Verilen tutar, seçilen mahalle için minimum sepet tutarını karşılıyor mu?
 */
export function isCartAmountValid(district: string, neighborhood: string, amount: number): { valid: boolean; minAmount: number | null; message?: string } {
  const minAmount = getMinimumAmount(district, neighborhood);
  
  if (minAmount === null) {
    return { valid: false, minAmount: null, message: 'Bu mahalleye teslimat yapılmamaktadır.' };
  }

  if (amount < minAmount) {
    return {
      valid: false,
      minAmount,
      message: `Bu mahalle için minimum sipariş tutarı ${minAmount.toLocaleString('tr-TR')}₺'dir. Sepetinize ${(minAmount - amount).toLocaleString('tr-TR')}₺ daha ürün ekleyin.`,
    };
  }

  return { valid: true, minAmount };
}
