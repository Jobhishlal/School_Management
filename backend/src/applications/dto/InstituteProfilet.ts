export interface DocumentDTO {
  url: string;
  filename: string;
  uploadedAt?: Date; 
}

export interface CreateInstituteDTO {
  instituteName: string;
  contactInformation: string;
  email: string;
  phone: string;
  addressId: string;      
  principalName: string;
  logo?: DocumentDTO[];    
}
