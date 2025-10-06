
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


export function validateStudentUpdate(update: Partial<Students>) {
  if(!update.fullName||!update.gender){
    throw new Error(StudentValidationErrors.REQUIRED_FIELDS)
  }
  if (update.fullName !== undefined) {
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(update.fullName)) {
      throw new Error(StudentValidationErrors.INVALID_FULLNAME);
    }
    if (update.fullName.length < 2 || update.fullName.length > 50) {
      throw new Error(StudentValidationErrors.FULLNAME_LENGTH);
    }
  }

  if (update.gender !== undefined) {
    const validGenders = ["Male", "Female", "Other"];
    if (!validGenders.includes(update.gender)) {
      throw new Error(StudentValidationErrors.INVALID_GENDER);
    }
  }

  // if (update.dateOfBirth !== undefined) {
  //   const today = new Date();
  //   const age = today.getFullYear() - update.dateOfBirth.getFullYear();
  
  //   if (age < 3 || age > 25) {
  //     throw new Error(StudentValidationErrors.DOB_AGE_LIMIT);
  //   }
  // }

  if (update.photos !== undefined && update.photos.length > 0) {
    update.photos.forEach(photo => {
      if (!photo.url.match(/\.(jpg|jpeg|png)$/i)) {
        throw new Error(StudentValidationErrors.INVALID_PHOTO);
      }
    });
  }

  return true;
}

