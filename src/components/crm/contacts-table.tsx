'use client';

import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Mail, Phone } from 'lucide-react';

interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string | null;
  date_created: string;
}

interface Props {
  contacts: Contact[];
}

export default function ContactsTable({ contacts }: Props) {
  if (contacts.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <p className="text-muted-foreground">No se encontraron contactos</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">Nombre</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Email</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Telefono</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Creado</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {contacts.map((contact) => (
              <tr
                key={contact.id}
                className="hover:bg-muted/50 cursor-pointer transition-colors"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/dashboard/crm/contacts/${contact.id}`}
                    className="font-medium hover:underline"
                  >
                    {contact.first_name} {contact.last_name}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a 
                      href={`mailto:${contact.email}`}
                      className="hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {contact.email}
                    </a>
                  </div>
                </td>
                <td className="px-4 py-3">
                  {contact.phone ? (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <a 
                        href={`tel:${contact.phone}`}
                        className="hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {contact.phone}
                      </a>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">-</span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(contact.date_created), {
                    addSuffix: true,
                    locale: es,
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}