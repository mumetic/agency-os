import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';

export default async function Home() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  // Redireccionar según rol
  if (session.user.role === 'Cliente') {
    redirect('/portal');
  }

  redirect('/dashboard');
}