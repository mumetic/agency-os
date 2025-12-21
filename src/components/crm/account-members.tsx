'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Users, Mail, Briefcase, Star, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useRouter } from 'next/navigation';
import AddInternalMemberDialog from './add-internal-member-dialog';
import AddExternalMemberDialog from './add-external-member-dialog';

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
  accountId: string;
  members: AccountMember[];
  users: User[];
  contacts: Contact[];
}

export default function AccountMembers({ accountId, members, users, contacts }: Props) {
  const router = useRouter();
  const [memberToDelete, setMemberToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const internalMembers = members.filter((m) => m.user);
  const externalMembers = members.filter((m) => m.contact);

  const handleDelete = async () => {
    if (!memberToDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/crm/account-members/${memberToDelete}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el miembro');
      }

      toast.success('Miembro eliminado', {
        description: 'El miembro se ha eliminado correctamente',
      });

      router.refresh();
    } catch (error) {
      toast.error('Error', {
        description: 'Ha ocurrido un error al eliminar el miembro',
      });
    } finally {
      setIsDeleting(false);
      setMemberToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Equipo interno */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <CardTitle>Equipo interno</CardTitle>
            </div>
            <AddInternalMemberDialog accountId={accountId} users={users} />
          </div>
        </CardHeader>
        <CardContent>
          {internalMembers.length > 0 ? (
            <div className="space-y-3">
              {internalMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">
                          {member.user?.first_name} {member.user?.last_name}
                        </p>
                        {member.is_primary && (
                          <Badge variant="secondary" className="gap-1">
                            <Star className="h-3 w-3" />
                            Principal
                          </Badge>
                        )}
                      </div>
                      {member.job_title && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Briefcase className="h-3 w-3" />
                          {member.job_title}
                        </div>
                      )}
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        {member.user?.email}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setMemberToDelete(member.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No hay empleados asignados a esta cuenta
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contactos externos */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              <CardTitle>Contactos del cliente</CardTitle>
            </div>
            <AddExternalMemberDialog accountId={accountId} contacts={contacts} />
          </div>
        </CardHeader>
        <CardContent>
          {externalMembers.length > 0 ? (
            <div className="space-y-3">
              {externalMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">
                          {member.contact?.first_name} {member.contact?.last_name}
                        </p>
                        {member.is_primary && (
                          <Badge variant="secondary" className="gap-1">
                            <Star className="h-3 w-3" />
                            Principal
                          </Badge>
                        )}
                      </div>
                      {member.job_title && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Briefcase className="h-3 w-3" />
                          {member.job_title}
                        </div>
                      )}
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        {member.contact?.email}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setMemberToDelete(member.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No hay contactos del cliente asociados
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de confirmacion */}
      <AlertDialog open={!!memberToDelete} onOpenChange={() => setMemberToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar miembro</AlertDialogTitle>
            <AlertDialogDescription>
              Esta accion eliminara el miembro del equipo de esta cuenta. Esta accion no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Eliminando...' : 'Eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}