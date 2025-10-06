import { Institute } from "../../domain/entities/Institute";
import { AdminInstituteProfileError } from "../../domain/enums/AdminProfileError";

export function InstituteErrorMessageValidate(inst: Institute, isUpdate = false): void {
  const { instituteName, contactInformation, email, phone, principalName, logo } = inst;

  if (!instituteName?.trim() || !contactInformation?.trim() || !email?.trim() || !phone?.trim() || !principalName?.trim()) {
    throw new Error(AdminInstituteProfileError.REQUIRED);
  }
  

   const lanPhoneRegex = /^\d{7}$/;
  if (!lanPhoneRegex.test(contactInformation)) {
    throw new Error(AdminInstituteProfileError.LANPHONE_NUMBER)
  }

  if (!/^[A-Za-z0-9\s,'-]{3,100}$/.test(instituteName)) {
    throw new Error(AdminInstituteProfileError.INVALID_NAME);
  }

  if (!/^[A-Za-z\s.]{3,50}$/.test(principalName)) {
    throw new Error(AdminInstituteProfileError.INVALID_PRINCIPAL_NAME);
  }

 
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error(AdminInstituteProfileError.INVALID_EMAIL);
  }

  if (!/^[6-9]\d{9}$/.test(phone)) {
    throw new Error(AdminInstituteProfileError.INVALID_PHONE);
  }

  if (!isUpdate && (!logo || logo.length === 0)) {
    throw new Error(AdminInstituteProfileError.LOGO_REQUIRED);
  }
}
