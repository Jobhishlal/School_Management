export interface ParentResponseDTO {
  id: string;
  name: string;
  contactNumber?: string;
  whatsappNumber?: string;
  email?: string;
  relationship?: "Son" | "Daughter";
}