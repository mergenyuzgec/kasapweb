import { DeliveryZoneInfo } from '@/types';

export const DELIVERY_ZONES: Record<
  string,
  {
    label: string;
    neighborhoods: string[];
    minOrder: number;
    deliveryTime: string;
    fee: number;
  }
> = {
  mezitli: {
    label: 'Mezitli',
    neighborhoods: [
      'Mezitli Merkez',
      'Fuat Morel',
      'Davultepe',
      'Tece',
      'Kuyuluk',
      'Kazanlı',
    ],
    minOrder: 150,
    deliveryTime: '45-60 dk',
    fee: 0,
  },
  yenisehir: {
    label: 'Yenişehir',
    neighborhoods: [
      'Bahçelievler',
      'Çiftlikköy',
      'Güvenevler',
      'Fırat',
      'Cengiz Topel',
      'Yenişehir Merkez',
    ],
    minOrder: 150,
    deliveryTime: '30-45 dk',
    fee: 0,
  },
  toroslar: {
    label: 'Toroslar',
    neighborhoods: ['Şevket Sümer', 'Toros', 'Güneykent', 'Toroslar Merkez'],
    minOrder: 200,
    deliveryTime: '50-70 dk',
    fee: 0,
  },
  akdeniz: {
    label: 'Akdeniz',
    neighborhoods: [
      'Akdeniz Merkez',
      'Kızıltoprak',
      'Nusratiye',
      'Karaduvar',
      'Limonlu',
    ],
    minOrder: 150,
    deliveryTime: '35-50 dk',
    fee: 0,
  },
};

export function getDistricts() {
  return Object.entries(DELIVERY_ZONES).map(([key, val]) => ({
    key,
    label: val.label,
  }));
}

export function getNeighborhoods(districtKey: string): string[] {
  return DELIVERY_ZONES[districtKey]?.neighborhoods ?? [];
}

export function checkDeliveryZone(
  districtKey: string,
  neighborhood: string
): DeliveryZoneInfo {
  const zone = DELIVERY_ZONES[districtKey?.toLowerCase()];
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
  return {
    available: true,
    minOrder: zone.minOrder,
    deliveryTime: zone.deliveryTime,
    fee: zone.fee,
    message: `Teslimat süresi yaklaşık ${zone.deliveryTime}. Min. sipariş: ${zone.minOrder}₺`,
  };
}
