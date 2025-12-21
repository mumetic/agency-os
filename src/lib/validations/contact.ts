import { z } from 'zod';

export const contactSchema = z.object({
  first_name: z.string().min(1, 'El nombre es obligatorio'),
  last_name: z.string().optional(),
  email: z.string().email('Email invalido').min(1, 'El email es obligatorio'),
  phone: z.string().optional(),
  notes: z.string().optional(),
});

export type ContactFormValues = z.infer<typeof contactSchema>;