'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Plus } from 'lucide-react';
import AccountMembers from './account-members';

interface Deal {
  id: string;
  title: string;
  value_eur: number | null;
  stage: {
    label: string;
  };
}

interface AccountMember {
  id: string;
  user?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  } | null;
  contact?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  } | null;
  job_title?: string | null;
  is_primary: boolean;
}

interface Project {
  id: string;
  name: string;
  status: {
    label: string;
  };
}

interface Ticket {
  id: string;
  subject: string;
  status: {
    label: string;
  };
  priority: {
    label: string;
  };
}

interface Account {
  id: string;
  name: string;
  notes?: string | null;
  date_created: string;
}

interface User {
  id: string;
  first_name: string;
  last_name: string;
}

interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface Props {
  account: Account;
  deals: Deal[];
  members: AccountMember[];
  projects: Project[];
  tickets: Ticket[];
  users: User[];
  contacts: Contact[];
}

export default function AccountTabs({ account, deals, members, projects, tickets, users, contacts }: Props) {
  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList>
        <TabsTrigger value="overview">Resumen</TabsTrigger>
        <TabsTrigger value="team">
          Equipo
          {members.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {members.length}
            </Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="deals">
          Deals
          {deals.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {deals.length}
            </Badge>
          )}
        </TabsTrigger>
      </TabsList>

      {/* Tab: Overview */}
      <TabsContent value="overview">
        <Card>
          <CardHeader>
            <CardTitle>Informacion de la cuenta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Fecha de creacion
                </label>
                <p className="mt-1">
                  {new Date(account.date_created).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
              {account.notes && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Notas
                  </label>
                  <p className="mt-1 whitespace-pre-wrap">{account.notes}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Tab: Equipo */}
      <TabsContent value="team">
        <AccountMembers 
          accountId={account.id} 
          members={members}
          users={users}
          contacts={contacts}
        />
      </TabsContent>

      {/* Tab: Deals */}
      <TabsContent value="deals">
        <Card>
          <CardHeader>
            <CardTitle>Deals relacionados</CardTitle>
          </CardHeader>
          <CardContent>
            {deals.length > 0 ? (
              <div className="space-y-3">
                {deals.map((deal) => (
                  <div
                    key={deal.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium">{deal.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {deal.stage.label}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {deal.value_eur
                          ? new Intl.NumberFormat('es-ES', {
                              style: 'currency',
                              currency: 'EUR',
                            }).format(deal.value_eur)
                          : '-'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No hay deals asociados a esta cuenta
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}