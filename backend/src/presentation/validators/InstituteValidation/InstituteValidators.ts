import { Institute } from "../../../domain/entities/Institute";
import { AdminInstituteProfileError } from "../../../domain/enums/AdminProfileError";

export function validateInstituteProfile(data: any, isUpdate = false): void {
    Institute.validate(data);

    if (!isUpdate && (!data.logo || data.logo.length === 0)) {
        throw new Error(AdminInstituteProfileError.LOGO_REQUIRED);
    }
}
