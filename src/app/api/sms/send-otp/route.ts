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

    // Telefon numarasını düzenle (başındaki 0'ı kaldır, 90 ekle)
    let formattedPhone = phone.replace(/\s/g, '').replace(/[^0-9]/g, '');
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '90' + formattedPhone.slice(1);
    } else if (!formattedPhone.startsWith('90')) {
      formattedPhone = '90' + formattedPhone;
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
      return NextResponse.json({ success: false, error: 'OTP kaydedilemedi' }, { status: 500 });
    }

    // NETGSM REST API ile SMS gönder
    const message = `Mutlu Kasap dogrulama kodunuz: ${otpCode}`;
    
    const response = await fetch('https://api.netgsm.com.tr/sms/send/otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        msgheader: process.env.NETGSM_MSGHEADER,
        usercode: process.env.NETGSM_USERCODE,
        password: process.env.NETGSM_PASSWORD,
        gsmno: formattedPhone,
        message: message,
      }),
    });

    const result = await response.text();
    
    // NETGSM başarı kodları: 00, 01, 02
    const resultCode = result.split(' ')[0];
    if (!['00', '01', '02'].includes(resultCode)) {
      console.error('NETGSM error:', result);
      // OTP kaydını sil çünkü SMS gitmedi
      await supabase.from('otp_codes').delete().eq('phone', formattedPhone);
      return NextResponse.json({ success: false, error: 'SMS gönderilemedi. Tekrar deneyin.' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json({ success: false, error: 'SMS gönderilemedi' }, { status: 500 });
  }
}
