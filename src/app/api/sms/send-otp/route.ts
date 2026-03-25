import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json();

    if (!phone || phone.length < 10) {
      return NextResponse.json({ success: false, error: 'Geçersiz telefon numarası' }, { status: 400 });
    }

    // Telefon numarasını düzenle (başındaki 0'ı kaldır, sadece 5xx formatında gönder)
    let formattedPhone = phone.replace(/\s/g, '').replace(/[^0-9]/g, '');
    if (formattedPhone.startsWith('90')) {
      formattedPhone = formattedPhone.slice(2);
    }
    if (formattedPhone.startsWith('0')) {
      formattedPhone = formattedPhone.slice(1);
    }

    // 6 haneli OTP kodu oluştur
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Eski OTP kodlarını temizle
    await supabase.from('otp_codes').delete().eq('phone', formattedPhone);

    // Yeni OTP kodunu Supabase'e kaydet
    const { error: insertError } = await supabase.from('otp_codes').insert({
      phone: formattedPhone,
      code: otpCode,
    });

    if (insertError) {
      console.error('OTP insert error:', insertError);
      return NextResponse.json({ success: false, error: 'Sistem hatası, tekrar deneyin.' }, { status: 500 });
    }

    // NETGSM REST API v2 - OTP SMS gönderimi
    // Basic Auth: base64(usercode:password)
    const usercode = process.env.NETGSM_USERCODE!;
    const password = process.env.NETGSM_PASSWORD!;
    const msgheader = process.env.NETGSM_MSGHEADER!;
    
    const authToken = Buffer.from(`${usercode}:${password}`).toString('base64');
    const message = `Mutlu Kasap dogrulama kodunuz: ${otpCode}`;

    const response = await fetch('https://api.netgsm.com.tr/sms/rest/v2/otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${authToken}`,
      },
      body: JSON.stringify({
        msgheader: msgheader,
        msg: message,
        no: formattedPhone,
      }),
    });

    const result = await response.json().catch(() => null);
    
    console.log('NETGSM response status:', response.status);
    console.log('NETGSM response body:', JSON.stringify(result));

    // Başarı kontrolü
    if (!response.ok || (result && result.code && !['00', '01', '02'].includes(String(result.code)))) {
      console.error('NETGSM error:', result);
      // OTP kaydını sil çünkü SMS gitmedi
      await supabase.from('otp_codes').delete().eq('phone', formattedPhone);
      return NextResponse.json({ 
        success: false, 
        error: 'SMS gönderilemedi. Lütfen telefon numaranızı kontrol edip tekrar deneyin.' 
      }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json({ success: false, error: 'SMS gönderilemedi. Tekrar deneyin.' }, { status: 500 });
  }
}
