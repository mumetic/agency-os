'use client';

import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Phone, Users, Mail, Bell, FileText, CheckCircle2 } from 'lucide-react';

interface Activity {
  id: string;
  type: string | null;
  subject: string;
  scheduled_at?: string | null;
  completed_at?: string | null;
  date_created: string;
  owner?: {
    id: string;
    first_name: string;
    last_name: string;
  } | null;
  deal?: {
    id: string;
    title: string;
  } | null;
  account?: {
    id: string;
    name: string;
  } | null;
}

interface Props {
  activities: Activity[];
}

export default function ActivitiesTable({ activities }: Props) {
  const getActivityIcon = (type: string | null) => {
    switch (type) {
      case 'call':
        return <Phone className="h-4 w-4" />;
      case 'meeting':
        return <Users className="h-4 w-4" />;
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'follow_up':
        return <Bell className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: string | null) => {
    const labels: Record<string, string> = {
      call: 'Llamada',
      meeting: 'Reunión',
      email: 'Email',
      follow_up: 'Seguimiento',
      note: 'Nota',
    };
    return type ? labels[type] : '-';
  };

  if (activities.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <p className="text-muted-foreground">No se encontraron actividades</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">Actividad</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Tipo</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Relacionado</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Responsable</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Estado</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Fecha</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {activities.map((activity) => (
              <tr key={activity.id} className="hover:bg-muted/50">
                <td className="px-4 py-3">
                  <div className="font-medium">{activity.subject}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {getActivityIcon(activity.type)}
                    <span className="text-sm">{getTypeLabel(activity.type)}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm">
                    {activity.deal && (
                      <Link
                        href={`/dashboard/crm/deals/${activity.deal.id}`}
                        className="hover:underline"
                      >
                        {activity.deal.title}
                      </Link>
                    )}
                    {activity.account && (
                      <Link
                        href={`/dashboard/crm/accounts/${activity.account.id}`}
                        className="hover:underline"
                      >
                        {activity.account.name}
                      </Link>
                    )}
                    {!activity.deal && !activity.account && (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm">
                  {activity.owner
                    ? `${activity.owner.first_name} ${activity.owner.last_name}`
                    : '-'}
                </td>
                <td className="px-4 py-3">
                  {activity.completed_at ? (
                    <Badge variant="default" className="gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Completada
                    </Badge>
                  ) : (
                    <Badge variant="outline">Pendiente</Badge>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(activity.date_created), {
                    addSuffix: true,
                    locale: es,
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}