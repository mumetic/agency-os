import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { directusServer } from '@/lib/directus';
import { createItem } from '@directus/sdk';
import { z } from 'zod';

const schema = z.object({
  account: z.string().min(1),
  user: z.string().optional(),
  contact: z.string().optional(),
  job_title: z.string().optional(),
  is_primary: z.boolean(),
}).refine(
  (data) => data.user || data.contact,
  { message: 'Debe proporcionar un usuario o un contacto' }
);

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

    const member = await directusServer.request(
      createItem('account_members', {
        account: validatedData.account,
        user: validatedData.user || undefined,
        contact: validatedData.contact || undefined,
        job_title: validatedData.job_title || undefined,
        is_primary: validatedData.is_primary,
      })
    );

    return NextResponse.json(member);
  } catch (error) {
    console.error('Error creating account member:', error);
    return NextResponse.json(
      { error: 'Error al crear el miembro' },
      { status: 500 }
    );
  }
}