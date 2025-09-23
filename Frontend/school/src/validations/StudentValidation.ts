import { z } from "zod";

export const StudentSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  dateOfBirth: z.string().refine(val => !isNaN(Date.parse(val)), "Invalid date"),
  gender: z.enum(["Male", "Female", "Other"], "Gender is required"),
  photos: z.array(z.instanceof(File)).optional(),
  parentName: z.string().min(1, "Parent name is required"),
  whatsappNumber: z.string().regex(/^\d{10}$/, "WhatsApp number must be 10 digits"),
  parentEmail: z.string().email("Invalid email"),
  parentRelationship: z.enum(["Son", "Daughter"]),
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pincode: z.string().regex(/^\d{6}$/, "Pincode must be 6 digits"),
  className: z.string().min(1, "Class is required"),
  division: z.string().min(1, "Division is required"),
});

export type StudentFormType = z.infer<typeof StudentSchema>;