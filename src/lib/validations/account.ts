import { z } from 'zod';

export const accountSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  legal_name: z.string().optional(),
  status: z.enum(['prospect', 'lead', 'active', 'on_hold', 'inactive']).optional(),
  website: z.string().url('URL invalida').optional().or(z.literal('')),
  phone: z.string().optional(),
  email: z.string().email('Email invalido').optional().or(z.literal('')),
  tax_id: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  zip_code: z.string().optional(),
  notes: z.string().optional(),
  account_owner: z.string().optional(),
  country: z.string().optional(),
});

export type AccountFormValues = z.infer<typeof accountSchema>;