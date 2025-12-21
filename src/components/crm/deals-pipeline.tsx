'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import DealCard from './deal-card';
import DroppableColumn from './droppable-column';
import { toast } from 'sonner';

interface Stage {
  id: string;
  key: string;
  label: string;
}

interface Deal {
  id: string;
  title: string;
  value_eur: number | null;
  probability: number;
  stage: {
    id: string;
    key: string;
    label: string;
  };
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
  stages: Stage[];
  deals: Deal[];
  owners: Owner[];
  accounts: Account[];
}

export default function DealsPipeline({ stages, deals, owners, accounts }: Props) {
  const router = useRouter();
  const [activeDeal, setActiveDeal] = useState<Deal | null>(null);
  const [ownerFilter, setOwnerFilter] = useState<string>('all');
  const [accountFilter, setAccountFilter] = useState<string>('all');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Filtrar deals
  const filteredDeals = useMemo(() => {
    return deals.filter((deal) => {
      if (ownerFilter !== 'all' && deal.owner?.id !== ownerFilter) return false;
      if (accountFilter !== 'all' && deal.account.id !== accountFilter) return false;
      return true;
    });
  }, [deals, ownerFilter, accountFilter]);

  // Agrupar deals por stage
  const dealsByStage = useMemo(() => {
    const grouped: Record<string, Deal[]> = {};
    stages.forEach((stage) => {
      grouped[stage.id] = filteredDeals.filter(
        (deal) => deal.stage.id === stage.id
      );
    });
    return grouped;
  }, [stages, filteredDeals]);

  // Calcular totales por stage
  const stageValues = useMemo(() => {
    const values: Record<string, number> = {};
    stages.forEach((stage) => {
      values[stage.id] = dealsByStage[stage.id]?.reduce(
        (sum, deal) => sum + (deal.value_eur || 0),
        0
      ) || 0;
    });
    return values;
  }, [stages, dealsByStage]);

  const handleDragStart = (event: DragStartEvent) => {
    const deal = filteredDeals.find((d) => d.id === event.active.id);
    setActiveDeal(deal || null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDeal(null);

    if (!over) return;

    const dealId = active.id as string;
    const newStageId = over.id as string;

    const deal = deals.find((d) => d.id === dealId);
    if (!deal || deal.stage.id === newStageId) return;

    try {
      const response = await fetch(`/api/crm/deals/${dealId}/stage`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stage: newStageId }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el stage');
      }

      toast.success('Stage actualizado', {
        description: `El deal se ha movido correctamente`,
      });

      router.refresh();
    } catch (error) {
      toast.error('Error', {
        description: 'Ha ocurrido un error al actualizar el stage',
      });
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Select value={ownerFilter} onValueChange={setOwnerFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por owner" />
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
            </div>
            <div className="flex-1">
              <Select value={accountFilter} onValueChange={setAccountFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por cuenta" />
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
            {(ownerFilter !== 'all' || accountFilter !== 'all') && (
              <Button
                variant="outline"
                onClick={() => {
                  setOwnerFilter('all');
                  setAccountFilter('all');
                }}
              >
                Limpiar filtros
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pipeline */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {stages.map((stage) => (
            <DroppableColumn key={stage.id} id={stage.id}>
              <Card className="flex flex-col h-full">
                <CardHeader className="pb-3">
                  <div className="space-y-2">
                    <CardTitle className="text-base">{stage.label}</CardTitle>
                    <div className="flex items-center justify-between text-sm">
                      <Badge variant="secondary">
                        {dealsByStage[stage.id]?.length || 0}
                      </Badge>
                      <span className="font-semibold">
                        {formatCurrency(stageValues[stage.id])}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto space-y-2 min-h-[200px]">
                  {dealsByStage[stage.id]?.map((deal) => (
                    <DealCard key={deal.id} deal={deal} />
                  ))}
                  {(!dealsByStage[stage.id] || dealsByStage[stage.id].length === 0) && (
                    <div className="text-center py-8 text-sm text-muted-foreground">
                      Arrastra deals aqui
                    </div>
                  )}
                </CardContent>
              </Card>
            </DroppableColumn>
          ))}
        </div>

        <DragOverlay>
          {activeDeal ? <DealCard deal={activeDeal} isDragging /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}