
export interface ParentProfileDTO {
    parent: {
        id: string;
        name: string;
        email: string;
        contactNumber: string;
        whatsappNumber: string;
        relationship?: string;
    };
    student: {
        id: string;
        fullName: string;
        studentId: string;
        dob: Date;
        gender: string;
        photo?: string;
        classDetails?: {
            className: string;
            division: string;
            rollNumber?: string;
        };
    };
    address?: {
        street: string;
        city: string;
        state: string;
        pincode: string;
    };
}
