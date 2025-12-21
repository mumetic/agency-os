'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import ActivitiesTable from './activities-table';
import { Search } from 'lucide-react';

interface Activity {
  id: string;
  type: string | null;
  subject: string;
  description?: string | null;
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

export default function ActivitiesListClient({ activities }: Props) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredActivities = useMemo(() => {
    return activities.filter((activity) => {
      const searchLower = search.toLowerCase();
      const matchesSearch =
        activity.subject.toLowerCase().includes(searchLower) ||
        (activity.description && activity.description.toLowerCase().includes(searchLower));

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'completed' && activity.completed_at) ||
        (statusFilter === 'pending' && !activity.completed_at);

      const matchesType = typeFilter === 'all' || activity.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [activities, search, statusFilter, typeFilter]);

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar actividades..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="pending">Pendientes</SelectItem>
              <SelectItem value="completed">Completadas</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="call">Llamada</SelectItem>
              <SelectItem value="meeting">Reunión</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="follow_up">Seguimiento</SelectItem>
              <SelectItem value="note">Nota</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Contador */}
      <div className="text-sm text-muted-foreground">
        {filteredActivities.length} actividad{filteredActivities.length !== 1 ? 'es' : ''}
      </div>

      {/* Tabla */}
      <ActivitiesTable activities={filteredActivities} />
    </div>
  );
}