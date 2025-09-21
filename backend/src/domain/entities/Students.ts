export class Students {
  constructor(
    public id: string,
    public fullName: string,
    public dateOfBirth: Date,
    public gender: "Male" | "Female" | "Other",
    public studentId: string,
    public parentId: string,   
    public addressId: string, 
    public classId: string,    
    public photos: { url: string; filename: string; uploadedAt: Date }[] = [],
    public Password:string
  ) {}
}
