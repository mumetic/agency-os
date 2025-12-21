'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, User, Calendar, TrendingUp, Mail, Phone, Edit } from 'lucide-react';
import Link from 'next/link';

interface Deal {
  id: string;
  title: string;
  value_eur: number | null;
  probability: number;
  expected_close_date: string | null;
  account: {
    id: string;
    name: string;
    website?: string | null;
    phone?: string | null;
    email?: string | null;
  };
  contact?: {
    id: string;
    first_name: string;
    last_name: string;
    email?: string | null;
    phone?: string | null;
  } | null;
  owner?: {
    id: string;
    first_name: string;
    last_name: string;
    email?: string | null;
  } | null;
  stage: {
    id: string;
    key: string;
    label: string;
  };
  date_created: string;
}

interface Props {
  deal: Deal;
}

export default function DealHeader({ deal }: Props) {
  const formatCurrency = (value: number | null) => {
    if (!value) return '-';
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

  return (
    <div className="space-y-4">
      {/* Titulo y acciones */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">{deal.title}</h1>
          <div className="mt-2 flex items-center gap-2">
            <Badge variant="secondary" className={getStageColor(deal.stage.key)}>
              {deal.stage.label}
            </Badge>
          </div>
        </div>
        <Button asChild>
          <Link href={`/dashboard/crm/deals/${deal.id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
              Editar
            </Link>
        </Button>
      </div>

      {/* Metricas principales */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span>Valor</span>
          </div>
          <div className="mt-2 text-2xl font-bold">
            {formatCurrency(deal.value_eur)}
          </div>
        </div>

        <div className="rounded-lg border p-4">
          <div className="text-sm text-muted-foreground">Probabilidad</div>
          <div className="mt-2 text-2xl font-bold">{deal.probability}%</div>
        </div>

        <div className="rounded-lg border p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Cierre esperado</span>
          </div>
          <div className="mt-2 text-lg font-semibold">
            {deal.expected_close_date
              ? new Date(deal.expected_close_date).toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })
              : '-'}
          </div>
        </div>

        <div className="rounded-lg border p-4">
          <div className="text-sm text-muted-foreground">Owner</div>
          <div className="mt-2 text-lg font-semibold">
            {deal.owner
              ? `${deal.owner.first_name} ${deal.owner.last_name}`
              : '-'}
          </div>
        </div>
      </div>

      {/* Informacion de cuenta y contacto */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Cuenta */}
        <div className="rounded-lg border p-4">
          <div className="flex items-center gap-2 mb-3">
            <Building2 className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-semibold">Cuenta</h3>
          </div>
          <div className="space-y-2">
            <div>
              <Link
                href={`/dashboard/crm/accounts/${deal.account.id}`}
                className="text-lg font-medium hover:underline"
              >
                {deal.account.name}
              </Link>
            </div>
            {deal.account.email && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <a href={`mailto:${deal.account.email}`} className="hover:underline">
                  {deal.account.email}
                </a>
              </div>
            )}
            {deal.account.phone && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <a href={`tel:${deal.account.phone}`} className="hover:underline">
                  {deal.account.phone}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Contacto */}
        <div className="rounded-lg border p-4">
          <div className="flex items-center gap-2 mb-3">
            <User className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-semibold">Contacto</h3>
          </div>
          {deal.contact ? (
            <div className="space-y-2">
              <div>
                <Link
                  href={`/dashboard/crm/contacts/${deal.contact.id}`}
                  className="text-lg font-medium hover:underline"
                >
                  {deal.contact.first_name} {deal.contact.last_name}
                </Link>
              </div>
              {deal.contact.email && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <a href={`mailto:${deal.contact.email}`} className="hover:underline">
                    {deal.contact.email}
                  </a>
                </div>
              )}
              {deal.contact.phone && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <a href={`tel:${deal.contact.phone}`} className="hover:underline">
                    {deal.contact.phone}
                  </a>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Sin contacto asignado</p>
          )}
        </div>
      </div>
    </div>
  );
}