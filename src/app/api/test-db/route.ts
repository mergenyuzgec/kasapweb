import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const { data, error } = await supabase.from('kasap_devices').select('*');
  return NextResponse.json({ data, error });
}
