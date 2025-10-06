export interface ParentRequestDTO {
 
  name: string;
  contactNumber: string;
  whatsappNumber?: string;
  email?: string;
  relationship?: "Son" | "Daughter";
}