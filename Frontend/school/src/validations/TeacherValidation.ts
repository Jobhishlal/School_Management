import { z } from "zod";

export const teacherSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits"),
  gender: z.string().min(1, "Gender is required"),
  department: z.enum(["LP", "UP", "HS"], "Department is required"),
  subjects: z.array(
    z.object({
      name: z.string(),
      code: z.string().optional(),
    })
  ).nonempty("At least one subject is required"),
}).refine(data => {
  return data.name.trim() !== "" &&
         data.email.trim() !== "" &&
         data.phone.trim() !== "" &&
         data.gender.trim() !== "" &&
         
         data.subjects.length > 0;
}, {
  message: "All fields are required",
  path: ["allFields"],
});
