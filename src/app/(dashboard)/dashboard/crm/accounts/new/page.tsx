import { directusServer } from '@/lib/directus';
import { readUsers, readItems } from '@directus/sdk';
import AccountForm from '@/components/crm/account-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Nueva Cuenta - CRM',
};

export default async function NewAccountPage() {
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

  const countries = await directusServer.request(
    readItems('countries', {
      fields: ['id', 'name'],
      sort: ['name'],
    })
  );

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/dashboard/crm/accounts">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a Cuentas
        </Link>
      </Button>

      <div>
        <h1 className="text-3xl font-bold">Nueva Cuenta</h1>
        <p className="text-muted-foreground">
          Crea una nueva cuenta en el CRM
        </p>
      </div>

      <AccountForm
        users={users as any}
        countries={countries as any}
      />
    </div>
  );
}