'use client';

import { useState } from 'react';
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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Account } from '@/lib/directus';
import { formatDate, getStatusColor } from '@/lib/utils';
import { Search, Mail, Phone, ExternalLink } from 'lucide-react';

interface AccountsTableProps {
  accounts: any[];
}

const statusLabels: Record<string, string> = {
  prospect: 'Prospect',
  lead: 'Lead',
  active: 'Activo',
  on_hold: 'En Pausa',
  inactive: 'Inactivo',
};

export default function AccountsTable({ accounts }: AccountsTableProps) {
  const [search, setSearch] = useState('');

  const filteredAccounts = accounts.filter((account) => {
    const searchLower = search.toLowerCase();
    return (
      account.name?.toLowerCase().includes(searchLower) ||
      account.email?.toLowerCase().includes(searchLower) ||
      account.city?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="space-y-4">
      {/* Búsqueda */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar cuentas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Contacto</TableHead>
              <TableHead>Ubicación</TableHead>
              <TableHead>Responsable</TableHead>
              <TableHead>Creado</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAccounts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  {search ? 'No se encontraron cuentas' : 'No hay cuentas creadas'}
                </TableCell>
              </TableRow>
            ) : (
              filteredAccounts.map((account) => (
                <TableRow key={account.id}>
                  <TableCell>
                    <Link
                      href={`/dashboard/crm/accounts/${account.id}`}
                      className="font-medium hover:underline"
                    >
                      {account.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {account.status && (
                      <Badge
                        variant="secondary"
                        className={getStatusColor(account.status)}
                      >
                        {statusLabels[account.status] || account.status}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {account.email && (
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Mail className="h-3 w-3" />
                          <a
                            href={`mailto:${account.email}`}
                            className="hover:underline"
                          >
                            {account.email}
                          </a>
                        </div>
                      )}
                      {account.phone && (
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Phone className="h-3 w-3" />
                          <a
                            href={`tel:${account.phone}`}
                            className="hover:underline"
                          >
                            {account.phone}
                          </a>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {account.city || '-'}
                  </TableCell>
                  <TableCell className="text-sm">
                    {account.account_owner
                      ? `${account.account_owner.first_name || ''} ${
                          account.account_owner.last_name || ''
                        }`.trim()
                      : '-'}
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {formatDate(account.date_created, 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                    >
                      <Link href={`/dashboard/crm/accounts/${account.id}`}>
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Resumen */}
      <div className="text-sm text-gray-500">
        Mostrando {filteredAccounts.length} de {accounts.length} cuentas
      </div>
    </div>
  );
}