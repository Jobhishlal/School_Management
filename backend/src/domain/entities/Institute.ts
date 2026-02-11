import { DocumentDTO } from '../../applications/dto/InstituteProfilet'
import { AdminInstituteProfileError } from "../enums/AdminProfileError";

export class Institute {
    private _id: string;
    private _instituteName: string;
    private _contactInformation: string;
    private _email: string;
    private _phone: string;
    private _address: string;
    private _principalName: string;
    private _logo: DocumentDTO[];

    constructor(
        id: string,
        instituteName: string,
        contactInformation: string,
        email: string,
        phone: string,
        address: string,
        principalName: string,
        logo: DocumentDTO[] = []
    ) {
        this._id = id;
        this._instituteName = instituteName;
        this._contactInformation = contactInformation;
        this._email = email;
        this._phone = phone;
        this._address = address;
        this._principalName = principalName;
        this._logo = logo;
    }

    get id(): string { return this._id; }
    set id(value: string) { this._id = value; }

    get instituteName(): string { return this._instituteName; }
    set instituteName(value: string) { this._instituteName = value; }

    get contactInformation(): string { return this._contactInformation; }
    set contactInformation(value: string) { this._contactInformation = value; }

    get email(): string { return this._email; }
    set email(value: string) { this._email = value; }

    get phone(): string { return this._phone; }
    set phone(value: string) { this._phone = value; }

    get address(): string { return this._address; }
    set address(value: string) { this._address = value; }

    get principalName(): string { return this._principalName; }
    set principalName(value: string) { this._principalName = value; }

    get logo(): DocumentDTO[] { return this._logo; }
    set logo(value: DocumentDTO[]) { this._logo = value; }

    public static validate(data: {
        instituteName: string;
        contactInformation: string;
        email: string;
        phone: string;
        principalName: string;
    }): void {
        const { instituteName, contactInformation, email, phone, principalName } = data;

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
    }
}