import { directusServer } from '@/lib/directus';
import { readItems, readUsers } from '@directus/sdk';
import DealForm from '@/components/crm/deal-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Nuevo Deal - CRM',
};

export default async function NewDealPage() {
  // Obtener accounts
  const accounts = await directusServer.request(
    readItems('accounts', {
      fields: ['id', 'name'],
      sort: ['name'],
    })
  );

  // Obtener contacts
  const contacts = await directusServer.request(
    readItems('contacts', {
      fields: ['id', 'first_name', 'last_name', 'email'],
      sort: ['first_name'],
    })
  );

  // Obtener stages
  const stages = await directusServer.request(
    readItems('deal_stages', {
      fields: ['id', 'key', 'label'],
      sort: ['key'],
    })
  );

  // Obtener users (owners)
  const users = await directusServer.request(
    readUsers({
      fields: ['id', 'first_name', 'last_name'],
      filter: {
        status: {
          _eq: 'active',
        },
      },
    })
  );

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/dashboard/crm/deals">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a Deals
        </Link>
      </Button>

      <div>
        <h1 className="text-3xl font-bold">Nuevo Deal</h1>
        <p className="text-muted-foreground">
          Crea un nuevo deal en el CRM
        </p>
      </div>

      <DealForm
        accounts={accounts as any}
        contacts={contacts as any}
        stages={stages as any}
        users={users as any}
      />
    </div>
  );
}