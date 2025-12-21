import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { directusServer } from '@/lib/directus';
import { updateItem } from '@directus/sdk';
import { dealSchema } from '@/lib/validations/deal';

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
    const validatedData = dealSchema.parse(body);

    const deal = await directusServer.request(
      updateItem('deals', id, {
        title: validatedData.title,
        account: validatedData.account,
        contact: validatedData.contact || undefined,
        owner: validatedData.owner || undefined,
        stage: validatedData.stage,
        value_eur: validatedData.value_eur || undefined,
        probability: validatedData.probability || undefined,
        expected_close_date: validatedData.expected_close_date || undefined,
        notes: validatedData.notes || undefined,
      })
    );

    return NextResponse.json(deal);
  } catch (error) {
    console.error('Error updating deal:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el deal' },
      { status: 500 }
    );
  }
}