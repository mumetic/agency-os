import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { directusServer } from '@/lib/directus';
import { createItem } from '@directus/sdk';
import { z } from 'zod';

const schema = z.object({
  deal: z.string().min(1),
  package: z.string().min(1),
  quantity: z.number().int().positive(),
  unit_price: z.number().positive(),
  notes: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = schema.parse(body);

    const dealItem = await directusServer.request(
      createItem('deal_items', {
        deal: validatedData.deal,
        package: validatedData.package,
        quantity: validatedData.quantity,
        unit_price: validatedData.unit_price,
        notes: validatedData.notes || undefined,
      })
    );

    return NextResponse.json(dealItem);
  } catch (error) {
    console.error('Error creating deal item:', error);
    return NextResponse.json(
      { error: 'Error al crear el item' },
      { status: 500 }
    );
  }
}