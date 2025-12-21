import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { directusServer } from '@/lib/directus';
import { deleteItem } from '@directus/sdk';

export async function DELETE(
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

    await directusServer.request(deleteItem('deal_items', id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting deal item:', error);
    return NextResponse.json(
      { error: 'Error al eliminar el item' },
      { status: 500 }
    );
  }
}