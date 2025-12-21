import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { directusServer } from '@/lib/directus';
import { createItem } from '@directus/sdk';
import { contactSchema } from '@/lib/validations/contact';

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
    const validatedData = contactSchema.parse(body);

    const contact = await directusServer.request(
      createItem('contacts', {
        first_name: validatedData.first_name,
        last_name: validatedData.last_name || undefined,
        email: validatedData.email,
        phone: validatedData.phone || undefined,
        notes: validatedData.notes || undefined,
      })
    );

    return NextResponse.json(contact);
  } catch (error) {
    console.error('Error creating contact:', error);
    return NextResponse.json(
      { error: 'Error al crear el contacto' },
      { status: 500 }
    );
  }
}