'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, User, Calendar, TrendingUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import type { DealWithRelations } from '@/types/crm';

interface Props {
  deals: DealWithRelations[];
}

export default function DealsCards({ deals }: Props) {
  const formatCurrency = (value: number | null) => {
    if (!value) return '—';
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getStageColor = (key: string) => {
    const colors: Record<string, string> = {
      lead: 'bg-gray-100 text-gray-800',
      qualified: 'bg-blue-100 text-blue-800',
      proposal: 'bg-purple-100 text-purple-800',
      negotiation: 'bg-orange-100 text-orange-800',
      won: 'bg-green-100 text-green-800',
      lost: 'bg-red-100 text-red-800',
    };
    return colors[key] || 'bg-gray-100 text-gray-800';
  };

  if (deals.length === 0) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-lg border border-dashed">
        <div className="text-center">
          <h3 className="text-lg font-semibold">No hay deals</h3>
          <p className="text-sm text-muted-foreground">
            Crea tu primer deal para empezar
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {deals.map((deal) => (
        <Link key={deal.id} href={`/dashboard/crm/deals/${deal.id}`}>
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold line-clamp-1">{deal.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(deal.date_created), {
                      addSuffix: true,
                      locale: es,
                    })}
                  </p>
                </div>
                <Badge
                  variant="secondary"
                  className={getStageColor(deal.stage.key)}
                >
                  {deal.stage.label}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Valor y probabilidad */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <span className="text-lg font-semibold">
                    {formatCurrency(deal.value_eur)}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {deal.probability}%
                </span>
              </div>

              {/* Cuenta */}
              <div className="flex items-center gap-2 text-sm">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="truncate">{deal.account.name}</span>
              </div>

              {/* Contacto */}
              {deal.contact && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span className="truncate">
                    {deal.contact.first_name} {deal.contact.last_name}
                  </span>
                </div>
              )}

              {/* Fecha esperada de cierre */}
              {deal.expected_close_date && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(deal.expected_close_date).toLocaleDateString(
                      'es-ES',
                      {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      }
                    )}
                  </span>
                </div>
              )}

              {/* Owner */}
              {deal.owner && (
                <div className="pt-2 border-t text-sm text-muted-foreground">
                  Owner: {deal.owner.first_name} {deal.owner.last_name}
                </div>
              )}
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}