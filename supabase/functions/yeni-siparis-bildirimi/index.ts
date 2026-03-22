// @ts-ignore
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const EXPO_PUSH_ENDPOINT = 'https://exp.host/--/api/v2/push/send';

serve(async (req: Request) => {
  try {
    const body = await req.json();
    const record = body.record; // Yeni sipariş objesi

    if (!record) {
      return new Response(JSON.stringify({ error: 'No record' }), { status: 400 });
    }

    // Supabase client oluştur
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

    // Kayıtlı kasap device token'larını çek
    const devicesRes = await fetch(`${supabaseUrl}/rest/v1/kasap_devices?select=fcm_token`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      },
    });
    const devices = await devicesRes.json();

    if (!devices || devices.length === 0) {
      return new Response(JSON.stringify({ message: 'No devices registered' }), { status: 200 });
    }

    // Sipariş tutarı
    const tutar = record.total_amount ? `${Number(record.total_amount).toFixed(0)}₺` : '';
    const musteri = record.delivery_address?.full_name ?? 'Müşteri';

    // Her cihaza bildirim gönder
    const messages = devices.map((d: { fcm_token: string }) => ({
      to: d.fcm_token,
      title: '🛒 Yeni Sipariş!',
      body: `${musteri} ${tutar} tutarında sipariş verdi`,
      sound: 'default',
      priority: 'high',
      data: { orderId: record.id },
      channelId: 'yeni-siparis',
    }));

    const pushRes = await fetch(EXPO_PUSH_ENDPOINT, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messages),
    });

    const pushData = await pushRes.json();
    return new Response(JSON.stringify({ success: true, data: pushData }), { status: 200 });

  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
});
