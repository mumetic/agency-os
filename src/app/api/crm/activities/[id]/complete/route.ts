import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { directusServer } from '@/lib/directus';
import { updateItem } from '@directus/sdk';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const { id } = await params;

    const activity = await directusServer.request(
      updateItem('activities', id, {
        completed_at: new Date().toISOString(),
      })
    );

    return NextResponse.json(activity);
  } catch (error) {
    console.error('Error completing activity:', error);
    return NextResponse.json({ error: 'Error al completar la actividad' }, { status: 500 });
  }
}