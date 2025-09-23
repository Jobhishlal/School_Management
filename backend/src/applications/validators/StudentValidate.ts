
import { Students } from "../../domain/entities/Students";
import { StudentValidationErrors } from "../../domain/enums/StudentError";

export function validateStudent(student: Students) {
 
  if (!student.fullName || !student.dateOfBirth || !student.gender) {
    throw new Error(StudentValidationErrors.REQUIRED_FIELDS);
  }


  const nameRegex = /^[A-Za-z\s]+$/;
  if (!nameRegex.test(student.fullName)) {
    throw new Error(StudentValidationErrors.INVALID_FULLNAME);
  }
   if (student.fullName.length < 2 || student.fullName.length > 50) {
     throw new Error(StudentValidationErrors.FULLNAME_LENGTH);
   }

  const validGenders = ["Male", "Female", "Other"];
  if (!validGenders.includes(student.gender)) {
    throw new Error(StudentValidationErrors.INVALID_GENDER);
  }

     const today = new Date();
      const age = today.getFullYear() - student.dateOfBirth.getFullYear();
      if (student.dateOfBirth > today) {
          throw new Error(StudentValidationErrors.DOB_FUTURE);
         }
       if (age < 3 || age > 25) {
      throw new Error(StudentValidationErrors.DOB_AGE_LIMIT);
        }

        if (student.photos && student.photos.length > 0) {
          student.photos.forEach(photo => {
        if (!photo.url.match(/\.(jpg|jpeg|png)$/i)) {
      throw new Error(StudentValidationErrors.INVALID_PHOTO);
    }



  });
}


}


