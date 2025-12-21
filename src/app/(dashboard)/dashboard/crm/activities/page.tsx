import { directusServer } from '@/lib/directus';
import { readItems } from '@directus/sdk';
import ActivitiesListClient from '@/components/crm/activities-list-client';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Actividades - CRM',
};

export default async function ActivitiesPage() {
  const activities = await directusServer.request(
    readItems('activities', {
      fields: [
        'id',
        'type',
        'subject',
        'description',
        'scheduled_at',
        'completed_at',
        'date_created',
        'owner.id',
        'owner.first_name',
        'owner.last_name',
        'deal.id',
        'deal.title',
        'account.id',
        'account.name',
        'contact.id',
        'contact.first_name',
        'contact.last_name',
      ],
      sort: ['-date_created'],
    })
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Actividades</h1>
          <p className="text-muted-foreground">
            Gestiona tus actividades y seguimientos
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/crm/activities/new">
            <Plus className="mr-2 h-4 w-4" />
            Nueva Actividad
          </Link>
        </Button>
      </div>

      <ActivitiesListClient activities={activities as any} />
    </div>
  );
}