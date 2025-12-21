import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { directusServer } from '@/lib/directus';
import { createItem } from '@directus/sdk';
import { activitySchema } from '@/lib/validations/activity';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = activitySchema.parse(body);

    const activity = await directusServer.request(
      createItem('activities', {
        subject: validatedData.subject,
        type: validatedData.type || undefined,
        description: validatedData.description || undefined,
        owner: validatedData.owner,
        scheduled_at: validatedData.scheduled_at || undefined,
        deal: validatedData.deal || undefined,
        account: validatedData.account || undefined,
        contact: validatedData.contact || undefined,
      })
    );

    return NextResponse.json(activity);
  } catch (error) {
    console.error('Error creating activity:', error);
    return NextResponse.json({ error: 'Error al crear la actividad' }, { status: 500 });
  }
}