'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getStatusColor } from '@/lib/utils';
import { Mail, Phone, MapPin, Globe, Building2, Edit } from 'lucide-react';
import Link from 'next/link';

const statusLabels: Record<string, string> = {
  prospect: 'Prospect',
  lead: 'Lead',
  active: 'Activo',
  on_hold: 'En Pausa',
  inactive: 'Inactivo',
};

interface AccountHeaderProps {
  account: any;
}

export default function AccountHeader({ account }: AccountHeaderProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="space-y-4 flex-1">
            {/* Nombre y estado */}
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 text-blue-600 rounded-lg p-3">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{account.name}</h1>
                {account.legal_name && account.legal_name !== account.name && (
                  <p className="text-sm text-gray-500">{account.legal_name}</p>
                )}
              </div>
              {account.status && (
                <Badge className={getStatusColor(account.status)}>
                  {statusLabels[account.status] || account.status}
                </Badge>
              )}
            </div>

            {/* Información de contacto */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {account.email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <a href={`mailto:${account.email}`} className="text-blue-600 hover:underline">
                    {account.email}
                  </a>
                </div>
              )}
              {account.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <a href={`tel:${account.phone}`} className="text-blue-600 hover:underline">
                    {account.phone}
                  </a>
                </div>
              )}
              {account.website && (
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="h-4 w-4 text-gray-400" />
                  <a
                    href={account.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {account.website}
                  </a>
                </div>
              )}
              {(account.city || account.country?.name) && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">
                    {[account.city, account.country?.name].filter(Boolean).join(', ')}
                  </span>
                </div>
              )}
            </div>

            {/* Responsable */}
            {account.account_owner && (
              <div className="pt-2 border-t">
                <p className="text-sm text-gray-500">Responsable de cuenta</p>
                <p className="text-sm font-medium">
                  {`${account.account_owner.first_name || ''} ${account.account_owner.last_name || ''}`.trim()}
                </p>
              </div>
            )}
          </div>

          {/* Acciones */}
          <div className="flex gap-2">
            <Button asChild>
              <Link href={`/dashboard/crm/accounts/${account.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}