import ContactForm from '@/components/crm/contact-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Nuevo Contacto - CRM',
};

export default function NewContactPage() {
  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/dashboard/crm/contacts">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a Contactos
        </Link>
      </Button>

      <div>
        <h1 className="text-3xl font-bold">Nuevo Contacto</h1>
        <p className="text-muted-foreground">
          Crea un nuevo contacto en el CRM
        </p>
      </div>

      <ContactForm />
    </div>
  );
}