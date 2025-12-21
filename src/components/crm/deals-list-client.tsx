'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LayoutGrid, TableIcon, Plus, Search } from 'lucide-react';
import Link from 'next/link';
import DealsTable from './deals-table';
import DealsCards from './deals-cards';
import type { DealWithRelations, DealStage } from '@/types/crm';

interface Owner {
  id: string;
  first_name: string;
  last_name: string;
}

interface Account {
  id: string;
  name: string;
}

interface Props {
  deals: DealWithRelations[];
  stages: DealStage[];
  owners: Owner[];
  accounts: Account[];
}

export default function DealsListClient({
  deals,
  stages,
  owners,
  accounts,
}: Props) {
  const [view, setView] = useState<'table' | 'cards'>('table');
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [ownerFilter, setOwnerFilter] = useState<string>('all');
  const [accountFilter, setAccountFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date_desc');

  // Filtrado y ordenamiento
  const filteredDeals = useMemo(() => {
    let filtered = [...deals];

    // Búsqueda
    if (search) {
      filtered = filtered.filter((deal) =>
        deal.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filtro por stage
    if (stageFilter !== 'all') {
      filtered = filtered.filter((deal) => deal.stage.id === stageFilter);
    }

    // Filtro por owner
    if (ownerFilter !== 'all') {
      filtered = filtered.filter((deal) => deal.owner?.id === ownerFilter);
    }

    // Filtro por account
    if (accountFilter !== 'all') {
      filtered = filtered.filter((deal) => deal.account.id === accountFilter);
    }

    // Ordenamiento
    switch (sortBy) {
      case 'date_desc':
        filtered.sort(
          (a, b) =>
            new Date(b.date_created).getTime() -
            new Date(a.date_created).getTime()
        );
        break;
      case 'date_asc':
        filtered.sort(
          (a, b) =>
            new Date(a.date_created).getTime() -
            new Date(b.date_created).getTime()
        );
        break;
      case 'value_desc':
        filtered.sort((a, b) => (b.value_eur || 0) - (a.value_eur || 0));
        break;
      case 'value_asc':
        filtered.sort((a, b) => (a.value_eur || 0) - (b.value_eur || 0));
        break;
      case 'title_asc':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'title_desc':
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
    }

    return filtered;
  }, [deals, search, stageFilter, ownerFilter, accountFilter, sortBy]);

  return (
    <div className="space-y-6">

      {/* Filtros y búsqueda */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-1 gap-4">
          {/* Búsqueda */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar deals..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Filtros */}
          <Select value={stageFilter} onValueChange={setStageFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Stage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los stages</SelectItem>
              {stages.map((stage) => (
                <SelectItem key={stage.id} value={stage.id}>
                  {stage.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={ownerFilter} onValueChange={setOwnerFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Owner" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los owners</SelectItem>
              {owners.map((owner) => (
                <SelectItem key={owner.id} value={owner.id}>
                  {owner.first_name} {owner.last_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={accountFilter} onValueChange={setAccountFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Account" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las cuentas</SelectItem>
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  {account.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Ordenamiento y vista */}
        <div className="flex items-center gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date_desc">Más recientes</SelectItem>
              <SelectItem value="date_asc">Más antiguos</SelectItem>
              <SelectItem value="value_desc">Valor (mayor)</SelectItem>
              <SelectItem value="value_asc">Valor (menor)</SelectItem>
              <SelectItem value="title_asc">Título (A-Z)</SelectItem>
              <SelectItem value="title_desc">Título (Z-A)</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex rounded-md border">
            <Button
              variant={view === 'table' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setView('table')}
              className="rounded-r-none"
            >
              <TableIcon className="h-4 w-4" />
            </Button>
            <Button
              variant={view === 'cards' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setView('cards')}
              className="rounded-l-none"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Resultados */}
      <div className="text-sm text-muted-foreground">
        {filteredDeals.length} deal{filteredDeals.length !== 1 ? 's' : ''}
      </div>

      {/* Vista tabla o cards */}
      {view === 'table' ? (
        <DealsTable deals={filteredDeals} />
        //<div>Vista tabla (pendiente)</div>
      ) : (
        <DealsCards deals={filteredDeals} />
        //<div>Vista cards (pendiente)</div>
      )}
    </div>
  );
}