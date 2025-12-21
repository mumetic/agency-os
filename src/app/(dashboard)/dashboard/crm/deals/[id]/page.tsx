import { directusServer } from '@/lib/directus';
import { readItem, readItems } from '@directus/sdk';
import { notFound } from 'next/navigation';
import DealHeader from '@/components/crm/deal-header';
import DealTabs from '@/components/crm/deal-tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface DealDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function DealDetailPage({ params }: DealDetailPageProps) {
  const { id } = await params;

  try {
    const deal = await directusServer.request(
      readItem('deals', id, {
        fields: [
          '*',
          'account.id',
          'account.name',
          'account.website',
          'account.phone',
          'account.email',
          'contact.id',
          'contact.first_name',
          'contact.last_name',
          'contact.email',
          'contact.phone',
          'owner.id',
          'owner.first_name',
          'owner.last_name',
          'owner.email',
          'stage.id',
          'stage.key',
          'stage.label',
        ],
      })
    );

    const dealItems = await directusServer.request(
      readItems('deal_items', {
        filter: {
          deal: {
            _eq: id,
          },
        },
        fields: [
          '*',
          'package.id',
          'package.name',
          'package.base_price',
        ],
      })
    );

    const allActivities = await directusServer.request(
      readItems('activities', {
        fields: [
          '*',
          'owner.id',
          'owner.first_name',
          'owner.last_name',
        ],
        sort: ['-date_created'],
        limit: 100,
      })
    );

    const activities = allActivities.filter(
      (activity: any) => activity.related_id === id && activity.related_to === 'deal'
    );

    // Obtener service packages para el selector
    const servicePackages = await directusServer.request(
      readItems('service_packages', {
        fields: ['id', 'name', 'base_price'],
        sort: ['name'],
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

        <DealHeader deal={deal as any} />

        <DealTabs
          deal={deal as any}
          dealItems={dealItems as any}
          activities={activities as any}
          servicePackages={servicePackages as any}
        />
      </div>
    );
  } catch (error) {
    console.error('Error loading deal:', error);
    notFound();
  }
}