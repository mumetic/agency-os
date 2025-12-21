'use client';

import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import type { DealWithRelations } from '@/types/crm';

interface Props {
  deals: DealWithRelations[];
}

export default function DealsTable({ deals }: Props) {
  const formatCurrency = (value: number | null) => {
    if (!value) return '—';
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
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
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Cuenta</TableHead>
            <TableHead>Contacto</TableHead>
            <TableHead>Stage</TableHead>
            <TableHead className="text-right">Valor</TableHead>
            <TableHead className="text-right">Probabilidad</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Creado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {deals.map((deal) => (
            <TableRow key={deal.id}>
              <TableCell>
                <Link
                  href={`/dashboard/crm/deals/${deal.id}`}
                  className="font-medium hover:underline"
                >
                  {deal.title}
                </Link>
              </TableCell>
              <TableCell>
                <Link
                  href={`/dashboard/crm/accounts/${deal.account.id}`}
                  className="text-sm text-muted-foreground hover:underline"
                >
                  {deal.account.name}
                </Link>
              </TableCell>
              <TableCell>
                {deal.contact ? (
                  <Link
                    href={`/dashboard/crm/contacts/${deal.contact.id}`}
                    className="text-sm text-muted-foreground hover:underline"
                  >
                    {deal.contact.first_name} {deal.contact.last_name}
                  </Link>
                ) : (
                  <span className="text-sm text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={getStageColor(deal.stage.key)}
                >
                  {deal.stage.label}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                {formatCurrency(deal.value_eur)}
              </TableCell>
              <TableCell className="text-right">
                {deal.probability}%
              </TableCell>
              <TableCell>
                {deal.owner ? (
                  <span className="text-sm">
                    {deal.owner.first_name} {deal.owner.last_name}
                  </span>
                ) : (
                  <span className="text-sm text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(deal.date_created), {
                  addSuffix: true,
                  locale: es,
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}