import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { orderDetails } = await request.json();

    // Kasap cihazlarının tokenlarını al
    const { data: devices, error } = await supabase
      .from('kasap_devices')
      .select('fcm_token');

    console.log('Fetched devices from DB:', devices);

    if (error) {
      console.error('Error fetching devices:', error);
      return NextResponse.json({ error: 'Failed to fetch devices' }, { status: 500 });
    }

    if (!devices || devices.length === 0) {
      return NextResponse.json({ message: 'No devices to notify' });
    }

    // Expo Push API mesajlarını hazırla
    const messages = devices.map((device) => {
      // Hata önleme: token geçerli formatta mı?
      const token = device.fcm_token;
      return {
        to: token,
        sound: 'default',
        title: '🥩 Yeni Sipariş Geldi!',
        body: `${orderDetails?.fullName || 'Bir müşteri'} yeni bir sipariş verdi. Toplam: ${orderDetails?.totalAmount}₺`,
        data: { orderId: orderDetails?.id },
      };
    });
    
    console.log('Sending these messages to Expo API:', JSON.stringify(messages, null, 2));

    // Expo sunucusuna istek at
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messages),
    });

    const ticket = await response.json();
    console.log('Push ticket:', ticket);
    return NextResponse.json({ success: true, ticket });

  } catch (error) {
    console.error('Push notification error:', error);
    return NextResponse.json({ error: 'Failed to send push notification' }, { status: 500 });
  }
}
