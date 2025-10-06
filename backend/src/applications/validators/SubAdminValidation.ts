import { SubAdminEntities } from "../../domain/entities/SubAdmin";
import { SubAdminProfileError } from "../../domain/enums/SubAdminProfileError";

export function SubAdminErrorMessageValidate(subAdmin: SubAdminEntities, isUpdate = false): void {
  const { name, email, phone, password, dateOfBirth, gender, photo } = subAdmin;


  if (!name?.trim() || !email?.trim() || !phone?.trim()) {
    throw new Error(SubAdminProfileError.REQUIRED);
  }


  if (!/^[A-Za-z\s]{3,50}$/.test(name)) {
    throw new Error(SubAdminProfileError.INVALID_NAME);
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error(SubAdminProfileError.INVALID_EMAIL);
  }

 
  if (!/^[6-9]\d{9}$/.test(phone)) {
    throw new Error(SubAdminProfileError.INVALID_PHONE);
  }


 



  if (dateOfBirth) {
    const dob = new Date(dateOfBirth);
    if (isNaN(dob.getTime())) {
      throw new Error(SubAdminProfileError.INVALID_DATEOFBIRTH);
    }

    const today = new Date();
    if (dob > today) {
      throw new Error(SubAdminProfileError.DOB_FUTURE);
    }

    const age = today.getFullYear() - dob.getFullYear();
    if (age < 25 || age > 50) {
      throw new Error(SubAdminProfileError.DOB_AGE_LIMIT);
    }
  }

  
  if (gender && !["Male", "Female", "Other"].includes(gender)) {
    throw new Error(SubAdminProfileError.INVALID_GENDER);
  }


  if (photo && photo.length > 0) {
    photo.forEach(p => {
      if (!p.url.match(/\.(jpg|jpeg|png)$/i)) {
        throw new Error("Photo must be in JPG, JPEG, or PNG format");
      }
    });
  }
}
