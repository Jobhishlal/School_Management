import { z } from "zod";

export const AdminSchema = z.object({

  name: z.string().min(1, "Name is required"),


  email: z.string().email("Invalid email"),

  phone: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits"),

  role: z.enum(
    [
      "Finance",
      "Communication",
      "School_Management",
      "Student_Management",
      "Parents_Management"
    ],
  ),

  blocked: z.boolean().default(false),


});
