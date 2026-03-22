import { OrderStatus } from '@/types';
import { 
  Clock, 
  ChefHat, 
  Truck, 
  CheckCircle2, 
  XOctagon 
} from 'lucide-react';

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  switch (status) {
    case 'bekliyor':
      return (
        <span className="badge badge-waiting">
          <Clock size={12} /> Bekliyor
        </span>
      );
    case 'hazirlaniyor':
      return (
        <span className="badge badge-preparing">
          <ChefHat size={12} /> Hazırlanıyor
        </span>
      );
    case 'yolda':
      return (
        <span className="badge badge-delivering">
          <Truck size={12} /> Yolda
        </span>
      );
    case 'teslim_edildi':
      return (
        <span className="badge badge-delivered">
          <CheckCircle2 size={12} /> Teslim Edildi
        </span>
      );
    case 'iptal':
      return (
        <span className="badge badge-cancelled">
          <XOctagon size={12} /> İptal
        </span>
      );
    default:
      return null;
  }
}
