
export interface CreateTeacherDTO {
  name: string;
  email: string;
  phone: string;
  gender: string;
  Password?: string;
  blocked:boolean;
  role:string;
}


export interface TeacherResponseDTO {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  role: string;
  blocked: boolean;
  createdAt: Date;
  updatedAt: Date;

}
