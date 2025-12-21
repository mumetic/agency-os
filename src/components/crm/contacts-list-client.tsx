'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import ContactsTable from './contacts-table';
import { Search } from 'lucide-react';

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

export default function ContactsListClient({ contacts }: Props) {
  const [search, setSearch] = useState('');

  const filteredContacts = useMemo(() => {
    return contacts.filter((contact) => {
      const searchLower = search.toLowerCase();
      const fullName = `${contact.first_name} ${contact.last_name}`.toLowerCase();
      const email = contact.email.toLowerCase();
      
      return (
        fullName.includes(searchLower) ||
        email.includes(searchLower) ||
        (contact.phone && contact.phone.includes(search))
      );
    });
  }, [contacts, search]);

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre, email o telefono..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </Card>

      {/* Resultados */}
      <div className="text-sm text-muted-foreground">
        {filteredContacts.length} contacto{filteredContacts.length !== 1 ? 's' : ''}
      </div>

      {/* Tabla */}
      <ContactsTable contacts={filteredContacts} />
    </div>
  );
}