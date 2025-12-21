import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { directusServer } from '@/lib/directus';
import { updateItem } from '@directus/sdk';
import { z } from 'zod';

const schema = z.object({
  stage: z.string().min(1, 'El stage es obligatorio'),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const validatedData = schema.parse(body);

    const deal = await directusServer.request(
      updateItem('deals', id, {
        stage: validatedData.stage,
      })
    );

    return NextResponse.json(deal);
  } catch (error) {
    console.error('Error updating deal stage:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el stage del deal' },
      { status: 500 }
    );
  }
}