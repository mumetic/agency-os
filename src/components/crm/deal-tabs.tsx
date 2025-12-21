'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, CheckCircle2, Circle, Phone, Users, Mail, Bell, FileText } from 'lucide-react';
import DealItemsManager from './deal-items-manager';

interface DealItem {
  id: string;
  package: {
    id: string;
    name: string;
  };
  quantity: number;
  unit_price: number | null;
  notes?: string | null;
}

interface ServicePackage {
  id: string;
  name: string;
  base_price: number | null;
}

interface Activity {
  id: string;
  type: string | null;
  subject: string;
  description?: string | null;
  scheduled_at?: string | null;
  completed_at?: string | null;
  owner?: {
    id: string;
    first_name: string;
    last_name: string;
  } | null;
  date_created: string;
}

interface Deal {
  id: string;
  title: string;
  notes?: string | null;
  date_created: string;
  date_updated?: string | null;
}

interface Props {
  deal: Deal;
  dealItems: DealItem[];
  activities: Activity[];
  servicePackages: ServicePackage[];
}

export default function DealTabs({ deal, dealItems, activities, servicePackages }: Props) {
  const getActivityIcon = (type: string | null) => {
    switch (type) {
      case 'call':
        return <Phone className="h-5 w-5" />;
      case 'meeting':
        return <Users className="h-5 w-5" />;
      case 'email':
        return <Mail className="h-5 w-5" />;
      case 'follow_up':
        return <Bell className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  return (
    <Tabs defaultValue="details" className="space-y-4">
      <TabsList>
        <TabsTrigger value="details">Detalles</TabsTrigger>
        <TabsTrigger value="items">
          Items
          {dealItems.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {dealItems.length}
            </Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="activities">
          Actividades
          {activities.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activities.length}
            </Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="notes">Notas</TabsTrigger>
      </TabsList>

      {/* Tab: Detalles */}
      <TabsContent value="details">
        <Card>
          <CardHeader>
            <CardTitle>Informacion del Deal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Fecha de creacion
                </label>
                <p className="mt-1">
                  {new Date(deal.date_created).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
              {deal.date_updated && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Ultima actualizacion
                  </label>
                  <p className="mt-1">
                    {formatDistanceToNow(new Date(deal.date_updated), {
                      addSuffix: true,
                      locale: es,
                    })}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Tab: Items */}
      <TabsContent value="items">
        <DealItemsManager 
          dealId={deal.id}
          dealItems={dealItems}
          servicePackages={servicePackages}
        />
      </TabsContent>

      {/* Tab: Actividades */}
      <TabsContent value="activities">
        <Card>
          <CardHeader>
            <CardTitle>Historial de actividades</CardTitle>
          </CardHeader>
          <CardContent>
            {activities.length > 0 ? (
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex gap-4 pb-4 border-b last:border-0 last:pb-0"
                  >
                    <div className="flex-shrink-0 text-muted-foreground">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium">{activity.subject}</h4>
                        {activity.completed_at ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      {activity.description && (
                        <p className="text-sm text-muted-foreground">
                          {activity.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        {activity.owner && (
                          <span>
                            {activity.owner.first_name} {activity.owner.last_name}
                          </span>
                        )}
                        {activity.scheduled_at && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(activity.scheduled_at).toLocaleDateString(
                              'es-ES',
                              {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              }
                            )}
                          </div>
                        )}
                        <span>
                          {formatDistanceToNow(new Date(activity.date_created), {
                            addSuffix: true,
                            locale: es,
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No hay actividades registradas
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      {/* Tab: Notas */}
      <TabsContent value="notes">
        <Card>
          <CardHeader>
            <CardTitle>Notas</CardTitle>
          </CardHeader>
          <CardContent>
            {deal.notes ? (
              <div className="prose prose-sm max-w-none">
                <p className="whitespace-pre-wrap">{deal.notes}</p>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No hay notas para este deal
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}