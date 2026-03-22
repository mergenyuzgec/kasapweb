'use client';

import { useState, useEffect } from 'react';
import { getDistricts, getNeighborhoods, checkDeliveryZone } from '@/lib/delivery-zones';
import { DeliveryZoneInfo } from '@/types';
import { MapPin, Info, AlertTriangle, CheckCircle2 } from 'lucide-react';
import styles from './AddressSelector.module.css';

interface AddressSelectorProps {
  onValidAddress: (district: string, neighborhood: string, detail: string) => void;
  onInvalidAddress: () => void;
  initialDistrict?: string;
  initialNeighborhood?: string;
  initialDetail?: string;
}

export default function AddressSelector({ onValidAddress, onInvalidAddress, initialDistrict, initialNeighborhood, initialDetail }: AddressSelectorProps) {
  const [district, setDistrict] = useState(initialDistrict || '');
  const [neighborhood, setNeighborhood] = useState(initialNeighborhood || '');
  const [detail, setDetail] = useState(initialDetail || '');
  const [zoneInfo, setZoneInfo] = useState<DeliveryZoneInfo | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (initialDistrict && !district) setDistrict(initialDistrict);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (initialNeighborhood && !neighborhood) setNeighborhood(initialNeighborhood);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (initialDetail && !detail) setDetail(initialDetail);
  }, [initialDistrict, initialNeighborhood, initialDetail, district, neighborhood, detail]);

  const districts = getDistricts();
  const neighborhoods = district ? getNeighborhoods(district) : [];

  useEffect(() => {
    if (district && neighborhood) {
      const info = checkDeliveryZone(district, neighborhood);
      setZoneInfo(prev => JSON.stringify(prev) === JSON.stringify(info) ? prev : info);
      
      const isValid = info.available && detail.trim().length > 5;
      if (isValid) {
        onValidAddress(district, neighborhood, detail);
      } else {
        onInvalidAddress();
      }
    } else {
      setZoneInfo(null);
      onInvalidAddress();
    }
  }, [district, neighborhood, detail, onValidAddress, onInvalidAddress]);

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDistrict(e.target.value);
    setNeighborhood('');
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>
        <MapPin size={20} className="text-gold" />
        Teslimat Adresi
      </h3>

      <div className={styles.grid}>
        <div className={styles.formGroup}>
          <label>İlçe</label>
          <select
            className="select-field"
            value={district}
            onChange={handleDistrictChange}
          >
            <option value="">İlçe Seçin</option>
            {districts.map((d) => (
              <option key={d.key} value={d.key}>
                {d.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>Mahalle</label>
          <select
            className="select-field"
            value={neighborhood}
            onChange={(e) => setNeighborhood(e.target.value)}
            disabled={!district}
          >
            <option value="">Mahalle Seçin</option>
            {neighborhoods.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.formGroup}>
        <label>Açık Adres</label>
        <textarea
          className="input-field"
          rows={3}
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
          placeholder="Sokak, bina, daire no..."
        />
      </div>

      {zoneInfo && (
        <div className={`${styles.infoBox} ${zoneInfo.available ? styles.infoSuccess : styles.infoError}`}>
          {zoneInfo.available ? (
            <>
              <CheckCircle2 size={18} />
              <div>
                <p className={styles.infoTitle}>Bu bölgeye teslimatımız var</p>
                <p className={styles.infoDesc}>{zoneInfo.message}</p>
              </div>
            </>
          ) : (
            <>
              <AlertTriangle size={18} />
              <div>
                <p className={styles.infoTitle}>Teslimat Bölgesi Dışında</p>
                <p className={styles.infoDesc}>{zoneInfo.message}</p>
              </div>
            </>
          )}
        </div>
      )}

      {!zoneInfo && (
        <div className={styles.hint}>
          <Info size={16} />
          <span>Sipariş verebilmek için adres seçimi zorunludur.</span>
        </div>
      )}
    </div>
  );
}
