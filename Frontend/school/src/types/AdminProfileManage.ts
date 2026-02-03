export interface AdminProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth?: string;
  addressId?: string;
  photo?: string[];
  documents?: string[];
}


