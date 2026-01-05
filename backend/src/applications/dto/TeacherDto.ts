export interface DocumentDTO {
  url: string;
  filename: string;
  uploadedAt?: Date;
}

export interface Subjects {
  name: string,
  code: string
}
export interface CreateTeacherDTO {
  name: string;
  email: string;
  phone: string;
  gender: string;
  Password?: string;
  blocked: boolean;
  role: string;
  documents?: DocumentDTO[];
  subjects?: Subjects[];
  department: "LP" | "UP" | "HS";
}

export interface TeacherResponseDTO {
  id: string;
  _id?: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  role: string;
  blocked: boolean;
  createdAt: Date;
  updatedAt: Date;
  documents?: DocumentDTO[];
  subjects?: Subjects[];
  department?: "LP" | "UP" | "HS";
}
