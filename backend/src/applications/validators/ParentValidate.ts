import { ParentEntity } from "../../domain/entities/Parents";
import { ParentValidationErrors } from "../../domain/enums/ParentValidateError";

export function ParentValidate(parent:ParentEntity){
   if (!parent.name || !parent.contactNumber) {
    throw new Error(ParentValidationErrors.REQUIRED_FIELDS);
  }

  const nameRegex = /^[A-Za-z\s]+$/;
  if (!nameRegex.test(parent.name)) {
    throw new Error(ParentValidationErrors.INVALID_NAME);
  }

  if (parent.name.length < 2 || parent.name.length > 50) {
    throw new Error(ParentValidationErrors.NAME_LENGTH);
  }

  const phoneRegex = /^\+?\d{10}$/; 
  if (!phoneRegex.test(parent.contactNumber)) {
    throw new Error(ParentValidationErrors.INVALID_CONTACT);
  }


  if (parent.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(parent.email)) {
      throw new Error(ParentValidationErrors.INVALID_EMAIL);
    }
  }



  return true;
}


export function validateParentUpdate(update: Partial<ParentEntity>) {
  if (update.name !== undefined) {
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(update.name)) {
      throw new Error(ParentValidationErrors.INVALID_NAME);
    }
    if (update.name.length < 2 || update.name.length > 50) {
      throw new Error(ParentValidationErrors.NAME_LENGTH);
    }
  }

  if (update.whatsappNumber !== undefined) {
    const phoneRegex = /^\+?\d{10}$/;
    if (!phoneRegex.test(update.whatsappNumber)) {
      throw new Error(ParentValidationErrors.INVALID_CONTACT);
    }
  }

  if (update.email !== undefined) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(update.email)) {
      throw new Error(ParentValidationErrors.INVALID_EMAIL);
    }
  }

  return true;
}