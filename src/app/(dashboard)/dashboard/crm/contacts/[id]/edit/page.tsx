import { directusServer } from '@/lib/directus';
import { readItem } from '@directus/sdk';
import { notFound } from 'next/navigation';
import ContactForm from '@/components/crm/contact-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface EditContactPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditContactPage({ params }: EditContactPageProps) {
  const { id } = await params;

  try {
    const contact = await directusServer.request(
      readItem('contacts', id, {
        fields: ['*'],
      })
    );

    return (
      <div className="space-y-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/dashboard/crm/contacts/${id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al contacto
          </Link>
        </Button>

        <div>
          <h1 className="text-3xl font-bold">Editar Contacto</h1>
          <p className="text-muted-foreground">
            Actualiza la informacion del contacto
          </p>
        </div>

        <ContactForm contact={contact} />
      </div>
    );
  } catch (error) {
    notFound();
  }
}