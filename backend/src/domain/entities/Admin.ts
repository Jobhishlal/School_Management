export class Admin {
    private _id: string | null;
    private _username: string;
    private _email: string;
    private _password?: string;

    constructor(
        id: string | null,
        username: string,
        email: string,
        password?: string
    ) {
        this._id = id;
        this._username = username;
        this._email = email;
        this._password = password;
    }

    get id(): string | null { return this._id; }
    set id(value: string | null) { this._id = value; }

    get username(): string { return this._username; }
    set username(value: string) { this._username = value; }

    get email(): string { return this._email; }
    set email(value: string) { this._email = value; }

    get password(): string | undefined { return this._password; }
    set password(value: string | undefined) { this._password = value; }
}