import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import DashboardNav from '@/components/dashboard/dashboard-nav';
import DashboardHeader from '@/components/dashboard/dashboard-header';
import { Toaster } from '@/components/ui/sonner';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  // Solo empleados y admins
  if (session.user.role === 'Cliente') {
    redirect('/portal');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <DashboardHeader user={session.user} />

      <div className="flex">
        {/* Sidebar */}
        <DashboardNav />

        {/* Main content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
      
      <Toaster />
    </div>
  );
}