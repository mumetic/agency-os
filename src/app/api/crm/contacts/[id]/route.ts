import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { directusServer } from '@/lib/directus';
import { updateItem } from '@directus/sdk';
import { contactSchema } from '@/lib/validations/contact';

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
    const validatedData = contactSchema.parse(body);

    const contact = await directusServer.request(
      updateItem('contacts', id, {
        first_name: validatedData.first_name,
        last_name: validatedData.last_name || undefined,
        email: validatedData.email,
        phone: validatedData.phone || undefined,
        notes: validatedData.notes || undefined,
      })
    );

    return NextResponse.json(contact);
  } catch (error) {
    console.error('Error updating contact:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el contacto' },
      { status: 500 }
    );
  }
}