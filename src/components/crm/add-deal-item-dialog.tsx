'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Plus } from 'lucide-react';
import { toast } from 'sonner';

const schema = z.object({
  package: z.string().min(1, 'Selecciona un servicio/producto'),
  quantity: z.number().int().positive('La cantidad debe ser mayor a 0'),
  unit_price: z.number().positive('El precio debe ser mayor a 0'),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface ServicePackage {
  id: string;
  name: string;
  base_price: number | null;
}

interface Props {
  dealId: string;
  servicePackages: ServicePackage[];
}

export default function AddDealItemDialog({ dealId, servicePackages }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      package: '',
      quantity: 1,
      unit_price: 0,
      notes: '',
    },
  });

  const selectedPackageId = form.watch('package');

  // Actualizar precio cuando se selecciona un paquete
const handlePackageChange = (packageId: string) => {
  form.setValue('package', packageId);
  const selectedPackage = servicePackages.find((p) => p.id === packageId);
  if (selectedPackage?.base_price !== null && selectedPackage?.base_price !== undefined) {
    // Convertir explícitamente a número
    form.setValue('unit_price', Number(selectedPackage.base_price));
  }
};

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/crm/deal-items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deal: dealId,
          package: data.package,
          quantity: data.quantity,
          unit_price: data.unit_price,
          notes: data.notes || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al añadir el item');
      }

      toast.success('Item añadido', {
        description: 'El item se ha añadido correctamente al deal',
      });

      setOpen(false);
      form.reset();
      router.refresh();
    } catch (error) {
      toast.error('Error', {
        description: 'Ha ocurrido un error al añadir el item',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Añadir item
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Añadir servicio/producto al deal</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="package"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Servicio/Producto *</FormLabel>
                  <Select
                    onValueChange={handlePackageChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un servicio" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {servicePackages.map((pkg) => (
                            <SelectItem key={pkg.id} value={pkg.id}>
                                {pkg.name}
                                {pkg.base_price !== null && pkg.base_price !== undefined && 
                                    ` - ${Number(pkg.base_price).toFixed(2)}€`
                                }
                            </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-2">
                          <FormField
                              control={form.control}
                              name="quantity"
                              render={({ field }) => (
                                  <FormItem>
                                      <FormLabel>Cantidad *</FormLabel>
                                      <FormControl>
                                          <Input
                                              type="number"
                                              min="1"
                                              value={field.value}
                                              onChange={(e) => {
                                                  const value = e.target.value;
                                                  field.onChange(value === '' ? 1 : parseInt(value));
                                              }}
                                          />
                                      </FormControl>
                                      <FormMessage />
                                  </FormItem>
                              )}
                          />

                          <FormField
                              control={form.control}
                              name="unit_price"
                              render={({ field }) => (
                                  <FormItem>
                                      <FormLabel>Precio unitario (EUR) *</FormLabel>
                                      <FormControl>
                                          <Input
                                              type="number"
                                              step="0.01"
                                              min="0"
                                              value={field.value}
                                              onChange={(e) => {
                                                  const value = e.target.value;
                                                  field.onChange(value === '' ? 0 : parseFloat(value));
                                              }}
                                          />
                                      </FormControl>
                                      <FormMessage />
                                  </FormItem>
                              )}
                          />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Añadir
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}