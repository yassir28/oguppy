import { testConnection } from '@/lib/elasticsearch/client';
import { NextResponse } from 'next/server';

export async function GET() {
  const connected = await testConnection();
  
  if (connected) {
    return NextResponse.json({ 
      success: true, 
      message: 'Elasticsearch connected!' 
    });
  } else {
    return NextResponse.json({ 
      success: false, 
      message: 'Elasticsearch connection failed' 
    }, { status: 500 });
  }
}
