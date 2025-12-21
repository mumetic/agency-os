'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent } from '@/components/ui/card';
import { Building2, User, TrendingUp } from 'lucide-react';
import Link from 'next/link';

interface Deal {
  id: string;
  title: string;
  value_eur: number | null;
  probability: number;
  account: {
    id: string;
    name: string;
  };
  contact?: {
    id: string;
    first_name: string;
    last_name: string;
  } | null;
  owner?: {
    id: string;
    first_name: string;
    last_name: string;
  } | null;
}

interface Props {
  deal: Deal;
  isDragging?: boolean;
}

export default function DealCard({ deal, isDragging = false }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: deal.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.5 : 1,
  };

  const formatCurrency = (value: number | null) => {
    if (!value) return '-';
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow ${
        isDragging ? 'shadow-lg' : ''
      }`}
    >
      <CardContent className="p-3 space-y-2">
        <Link
          href={`/dashboard/crm/deals/${deal.id}`}
          className="font-medium text-sm hover:underline line-clamp-2"
          onClick={(e) => e.stopPropagation()}
        >
          {deal.title}
        </Link>

        {deal.value_eur && (
          <div className="flex items-center gap-1 text-sm font-semibold text-green-600">
            <TrendingUp className="h-3 w-3" />
            {formatCurrency(deal.value_eur)}
          </div>
        )}

        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Building2 className="h-3 w-3" />
          <span className="truncate">{deal.account.name}</span>
        </div>

        {deal.contact && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <User className="h-3 w-3" />
            <span className="truncate">
              {deal.contact.first_name} {deal.contact.last_name}
            </span>
          </div>
        )}

        {deal.owner && (
          <div className="text-xs text-muted-foreground">
            Owner: {deal.owner.first_name} {deal.owner.last_name}
          </div>
        )}

        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Probabilidad</span>
          <span className="font-medium">{deal.probability}%</span>
        </div>
      </CardContent>
    </Card>
  );
}