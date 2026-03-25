import { DeliveryZoneInfo } from '@/types';
import { getMinimumAmount } from '@/config/minimumCart';

export const DELIVERY_ZONES: Record<
  string,
  {
    label: string;
    neighborhoods: string[];
    deliveryTime: string;
    fee: number;
  }
> = {
  yenisehir: {
    label: 'Yenişehir',
    neighborhoods: [
      'Yıl Mahallesi',
      'Akkent Mahallesi',
      'Aydınlıkevler Mahallesi',
      'Bahçelievler Mahallesi',
      'Barbaros Mahallesi',
      'Batıkent Mahallesi',
      'Cumhuriyet Mahallesi',
      'Çiftlikköy Mahallesi',
      'Eğriçam Mahallesi',
      'Fuatmorel Mahallesi',
      'Güvenevler Mahallesi',
      'Hürriyet Mahallesi',
      'İnönü Mahallesi',
      'Kocavilayet Mahallesi',
      'Kuzeykent Mahallesi',
      'Limonluk Mahallesi',
      'Menteş Mahallesi',
      'Palmiye Mahallesi',
      'Pirireis Mahallesi',
    ],
    deliveryTime: '30-60 dk',
    fee: 0,
  },
  mezitli: {
    label: 'Mezitli',
    neighborhoods: [
      '75. Yıl Mahallesi',
      'Akdeniz Mahallesi',
      'Atatürk Mahallesi',
      'Çamlıca Mahallesi',
      'Çankaya Mahallesi',
      'Davultepe Mahallesi',
      'Deniz Mahallesi',
      'Esenbağlar Mahallesi',
      'Eski Mezitli Mahallesi',
      'Fatih Mahallesi',
      'Fındıkpınarı Mahallesi',
      'Kaleköy Mahallesi',
      'Kuyuluk Mahallesi',
      'Menderes Mahallesi',
      'Merkez Mahallesi',
      'Tece Mahallesi',
      'Viranşehir Mahallesi',
      'Yeni Mahalle',
    ],
    deliveryTime: '30-60 dk',
    fee: 0,
  },
};

export function getDistricts() {
  return Object.entries(DELIVERY_ZONES).map(([key, val]) => ({
    key: val.label,
    label: val.label,
  }));
}

export function getNeighborhoods(districtKey: string): string[] {
  // Label ile eşleştirme (Mezitli, Yenişehir)
  const zone = Object.values(DELIVERY_ZONES).find(
    (z) => z.label.toLowerCase() === districtKey.toLowerCase()
  ) || DELIVERY_ZONES[districtKey?.toLowerCase()];
  return zone?.neighborhoods ?? [];
}

export function checkDeliveryZone(
  districtKey: string,
  neighborhood: string
): DeliveryZoneInfo {
  const zone = Object.values(DELIVERY_ZONES).find(
    (z) => z.label.toLowerCase() === districtKey.toLowerCase()
  ) || DELIVERY_ZONES[districtKey?.toLowerCase()];

  if (!zone) {
    return {
      available: false,
      message: 'Bu ilçeye teslimat yapılmamaktadır.',
    };
  }
  const available = zone.neighborhoods.some(
    (n) => n.toLowerCase() === neighborhood.toLowerCase()
  );
  if (!available) {
    return {
      available: false,
      message: `${zone.label} ilçesinde bu mahalleye teslimat yapılmamaktadır.`,
    };
  }

  const minAmount = getMinimumAmount(zone.label, neighborhood);
  
  return {
    available: true,
    minOrder: minAmount ?? 0,
    deliveryTime: zone.deliveryTime,
    fee: zone.fee,
    message: `Teslimat süresi yaklaşık ${zone.deliveryTime}. Min. sipariş: ${minAmount?.toLocaleString('tr-TR')}₺`,
  };
}
