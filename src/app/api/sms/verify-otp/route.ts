import { NextRequest, NextResponse } from 'next/server';

// OTP store'u send-otp ile paylaşmak için global store kullanıyoruz
// Not: Serverless ortamda (Vercel) her endpoint farklı instance'da çalışabilir
// Bu yüzden daha güvenilir bir çözüm olarak Supabase tablosu kullanacağız

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { phone, code } = await request.json();

    if (!phone || !code) {
      return NextResponse.json({ success: false, error: 'Telefon ve doğrulama kodu gerekli' }, { status: 400 });
    }

    // Telefon numarasını düzenle
    let formattedPhone = phone.replace(/\s/g, '').replace(/[^0-9]/g, '');
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '90' + formattedPhone.slice(1);
    } else if (!formattedPhone.startsWith('90')) {
      formattedPhone = '90' + formattedPhone;
    }

    // Supabase'den OTP kontrolü
    const { data: otpRecord, error } = await supabase
      .from('otp_codes')
      .select('*')
      .eq('phone', formattedPhone)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !otpRecord) {
      return NextResponse.json({ success: false, error: 'Doğrulama kodu bulunamadı. Yeniden gönderin.' }, { status: 400 });
    }

    // Süre kontrolü (5 dakika)
    const createdAt = new Date(otpRecord.created_at).getTime();
    if (Date.now() - createdAt > 5 * 60 * 1000) {
      return NextResponse.json({ success: false, error: 'Doğrulama kodunun süresi dolmuş. Yeniden gönderin.' }, { status: 400 });
    }

    // Kod kontrolü
    if (otpRecord.code !== code) {
      return NextResponse.json({ success: false, error: 'Doğrulama kodu hatalı' }, { status: 400 });
    }

    // Başarılı - kaydı sil
    await supabase.from('otp_codes').delete().eq('id', otpRecord.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json({ success: false, error: 'Doğrulama başarısız' }, { status: 500 });
  }
}
