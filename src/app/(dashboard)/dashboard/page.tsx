import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Briefcase, FolderKanban, Ticket } from 'lucide-react';

export default function DashboardPage() {
  // Datos de ejemplo - luego los traeremos de Directus
  const stats = [
    {
      name: 'Cuentas Activas',
      value: '24',
      icon: Users,
      description: '+2 este mes',
    },
    {
      name: 'Deals Abiertos',
      value: '12',
      icon: Briefcase,
      description: '€45,000 en pipeline',
    },
    {
      name: 'Proyectos Activos',
      value: '8',
      icon: FolderKanban,
      description: '23 tareas pendientes',
    },
    {
      name: 'Tickets Abiertos',
      value: '5',
      icon: Ticket,
      description: '2 sin asignar',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-gray-500">
          Resumen de tu actividad y métricas principales
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.name}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-gray-500">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>
              Últimas interacciones con clientes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                No hay actividad reciente para mostrar
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Tareas Pendientes</CardTitle>
            <CardDescription>
              Tus próximas tareas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                No hay tareas pendientes
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}