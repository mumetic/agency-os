'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Edit } from 'lucide-react';
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
import AddDealItemDialog from './add-deal-item-dialog';

interface DealItem {
  id: string;
  package: {
    id: string;
    name: string;
  };
  quantity: number;
  unit_price: number | null;
  notes?: string | null;
}

interface ServicePackage {
  id: string;
  name: string;
  base_price: number | null;
}

interface Props {
  dealId: string;
  dealItems: DealItem[];
  servicePackages: ServicePackage[];
}

export default function DealItemsManager({ dealId, dealItems, servicePackages }: Props) {
  const router = useRouter();
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!itemToDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/crm/deal-items/${itemToDelete}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el item');
      }

      toast.success('Item eliminado', {
        description: 'El item se ha eliminado correctamente',
      });

      router.refresh();
    } catch (error) {
      toast.error('Error', {
        description: 'Ha ocurrido un error al eliminar el item',
      });
    } finally {
      setIsDeleting(false);
      setItemToDelete(null);
    }
  };

  const formatCurrency = (value: number | null) => {
    if (!value) return '-';
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(value);
  };

  const calculateTotal = () => {
    return dealItems.reduce((sum, item) => {
      const price = item.unit_price || 0;
      const qty = item.quantity || 1;
      return sum + price * qty;
    }, 0);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Servicios y productos</CardTitle>
            <AddDealItemDialog dealId={dealId} servicePackages={servicePackages} />
          </div>
        </CardHeader>
        <CardContent>
          {dealItems.length > 0 ? (
            <div className="space-y-4">
              <div className="divide-y">
                {dealItems.map((item) => (
                  <div key={item.id} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{item.package.name}</h4>
                        {item.notes && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {item.notes}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-semibold">
                            {formatCurrency(item.unit_price)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Cantidad: {item.quantity}
                          </div>
                          <div className="text-sm font-medium mt-1">
                            Total: {formatCurrency((item.unit_price || 0) * item.quantity)}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setItemToDelete(item.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 flex items-center justify-between">
                <span className="font-semibold">Total</span>
                <span className="text-xl font-bold">
                  {formatCurrency(calculateTotal())}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No hay items en este deal
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de confirmacion */}
      <AlertDialog open={!!itemToDelete} onOpenChange={() => setItemToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar item</AlertDialogTitle>
            <AlertDialogDescription>
              Esta accion eliminara el item del deal. Esta accion no se puede deshacer.
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
    </>
  );
}