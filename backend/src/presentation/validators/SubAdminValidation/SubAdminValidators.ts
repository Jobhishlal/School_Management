import { SubAdminEntities } from "../../../domain/entities/SubAdmin";
import { SubAdminProfileError } from "../../../domain/enums/SubAdminProfileError";

export function validateSubAdminCreate(data: any): void {
    const { name, email, phone, dateOfBirth, gender } = data;

    if (!name?.trim() || !email?.trim() || !phone?.trim() || !dateOfBirth || !gender) {
        throw new Error(SubAdminProfileError.REQUIRED);
    }

    SubAdminEntities.validateName(name);
    SubAdminEntities.validateEmail(email);
    SubAdminEntities.validatePhone(phone);
    SubAdminEntities.validateAge(dateOfBirth);
    SubAdminEntities.validateGender(gender);

    if (data.photo && data.photo.length > 0) {
        data.photo.forEach((p: any) => {
            if (!p.url.match(/\.(jpg|jpeg|png)$/i)) {
                throw new Error("Photo must be in JPG, JPEG, or PNG format");
            }
        });
    }
}

export function validateSubAdminUpdate(data: any): void {
    const { name, email, phone, dateOfBirth, gender } = data;

    if (name) SubAdminEntities.validateName(name);
    if (email) SubAdminEntities.validateEmail(email);
    if (phone) SubAdminEntities.validatePhone(phone);
    if (dateOfBirth) SubAdminEntities.validateAge(dateOfBirth);
    if (gender) SubAdminEntities.validateGender(gender);

    if (data.photo && data.photo.length > 0) {
        data.photo.forEach((p: any) => {
            if (!p.url.match(/\.(jpg|jpeg|png)$/i)) {
                throw new Error("Photo must be in JPG, JPEG, or PNG format");
            }
        });
    }
}

export function validatePasswordUpdate(password: string): void {
    SubAdminEntities.validatePassword(password);
}
