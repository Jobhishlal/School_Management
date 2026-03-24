export interface CreateStudentDTO {
  fullName: string;
  dateOfBirth: Date;
  gender: "Male" | "Female" | "Other";
  parentId: string;
  addressId: string;
  classId: string;
  photos?: { url: string; filename: string; uploadedAt: Date }[];
  blocked?: boolean;
}

export interface UpdateStudentDTO extends Partial<CreateStudentDTO> {
  id: string;
}
