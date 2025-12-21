import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { directusServer } from '@/lib/directus';
import { updateItem } from '@directus/sdk';
import { accountSchema } from '@/lib/validations/account';

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
    const validatedData = accountSchema.parse(body);

    const account = await directusServer.request(
      updateItem('accounts', id, {
        name: validatedData.name,
        legal_name: validatedData.legal_name || undefined,
        status: validatedData.status || undefined,
        website: validatedData.website || undefined,
        phone: validatedData.phone || undefined,
        email: validatedData.email || undefined,
        tax_id: validatedData.tax_id || undefined,
        address: validatedData.address || undefined,
        city: validatedData.city || undefined,
        postal_code: validatedData.zip_code || undefined,
        notes: validatedData.notes || undefined,
        account_owner: validatedData.account_owner || undefined,
        country: validatedData.country || undefined,
      })
    );

    return NextResponse.json(account);
  } catch (error) {
    console.error('Error updating account:', error);
    return NextResponse.json(
      { error: 'Error al actualizar la cuenta' },
      { status: 500 }
    );
  }
}