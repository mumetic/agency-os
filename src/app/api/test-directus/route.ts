import { NextResponse } from 'next/server';

export async function GET() {
  const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL;
  
  try {
    // Test básico de conexión
    const response = await fetch(`${directusUrl}/server/info`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      directusUrl,
      serverInfo: data,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: String(error),
      directusUrl,
    }, { status: 500 });
  }
}