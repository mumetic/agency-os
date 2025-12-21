import { z } from 'zod';

export const dealSchema = z.object({
  title: z.string().min(1, 'El titulo es obligatorio'),
  account: z.string().min(1, 'La cuenta es obligatoria'),
  contact: z.string().optional(),
  owner: z.string().optional(),
  stage: z.string().min(1, 'El stage es obligatorio'),
  value_eur: z.number().int().positive().optional().nullable(),
  probability: z.number().int().min(0).max(100).optional().nullable(),
  expected_close_date: z.string().optional(),
  notes: z.string().optional(),
});

export type DealFormValues = z.infer<typeof dealSchema>;