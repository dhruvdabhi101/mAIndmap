import { z } from "zod";

export const billingSchema = z.object({
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().min(1, "Country is required"),
  zipcode: z.string().min(1, "Zipcode is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
});

export type BillingFormData = z.infer<typeof billingSchema>;
