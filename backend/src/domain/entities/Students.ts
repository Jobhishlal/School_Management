

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
    public Password:string,
    public parent?: { name: string; contactNumber: string; email?: string; relationship?: string }, 
    public classDetails?: { className: string; division: string; department: string; rollNumber: string } ,
    public blocked: boolean = false,
    public address?: { street?: string; city?: string; state?: string; pincode?: string } ,
    public role?:string
    
  ) {}
}
