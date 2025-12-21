import { directusServer } from '@/lib/directus';
import { readItems } from '@directus/sdk';
import ContactsListClient from '@/components/crm/contacts-list-client';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Contactos - CRM',
};

export default async function ContactsPage() {
  const contacts = await directusServer.request(
    readItems('contacts', {
      fields: [
        'id',
        'first_name',
        'last_name',
        'email',
        'phone',
        'date_created',
      ],
      sort: ['-date_created'],
      limit: -1,
    })
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Contactos</h1>
          <p className="text-muted-foreground">
            Gestiona los contactos de tu CRM
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/crm/contacts/new">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Contacto
          </Link>
        </Button>
      </div>

      <ContactsListClient contacts={contacts as any} />
    </div>
  );
}