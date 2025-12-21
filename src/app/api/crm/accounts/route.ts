import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { directusServer } from '@/lib/directus';
import { createItem } from '@directus/sdk';
import { accountSchema } from '@/lib/validations/account';

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
    const validatedData = accountSchema.parse(body);

    const account = await directusServer.request(
      createItem('accounts', {
        name: validatedData.name,
        legal_name: validatedData.legal_name || undefined,
        status: validatedData.status || undefined,
        website: validatedData.website || undefined,
        phone: validatedData.phone || undefined,
        email: validatedData.email || undefined,
        tax_id: validatedData.tax_id || undefined,
        address: validatedData.address || undefined,
        city: validatedData.city || undefined,
        zip_code: validatedData.zip_code || undefined,
        notes: validatedData.notes || undefined,
        account_owner: validatedData.account_owner || undefined,
        country: validatedData.country || undefined,
      })
    );

    return NextResponse.json(account);
  } catch (error) {
    console.error('Error creating account:', error);
    return NextResponse.json(
      { error: 'Error al crear la cuenta' },
      { status: 500 }
    );
  }
}