import { AddressErrors } from "../enums/AddressError";

export class AddressEntity {
    private _id: string;
    private _street: string;
    private _city: string;
    private _state: string;
    private _pincode: string;

    constructor(
        id: string,
        street: string,
        city: string,
        state: string,
        pincode: string,
    ) {
        this._id = id;
        this._street = street;
        this._city = city;
        this._state = state;
        this._pincode = pincode;
    }

    get id(): string { return this._id; }
    set id(value: string) { this._id = value; }

    get street(): string { return this._street; }
    set street(value: string) { this._street = value; }

    get city(): string { return this._city; }
    set city(value: string) { this._city = value; }

    get state(): string { return this._state; }
    set state(value: string) { this._state = value; }

    get pincode(): string { return this._pincode; }
    set pincode(value: string) { this._pincode = value; }

    public static validate(street: string, city: string, state: string, pincode: string): void {
        if (!street?.trim() || !city?.trim() || !state?.trim() || !pincode?.trim()) {
            throw new Error(AddressErrors.REQUIRED);
        }

        if (street.length < 3 || street.length > 100) {
            throw new Error(AddressErrors.STREET_LENGTH);
        }

        const cityRegex = /^[A-Za-z\s]+$/;
        if (!cityRegex.test(city)) {
            throw new Error(AddressErrors.CITY_INVALID);
        }
        if (city.length < 2 || city.length > 50) {
            throw new Error(AddressErrors.CITY_LENGTH);
        }

        const stateRegex = /^[A-Za-z\s]+$/;
        if (!stateRegex.test(state)) {
            throw new Error(AddressErrors.STATE_INVALID);
        }
        if (state.length < 2 || state.length > 50) {
            throw new Error(AddressErrors.STATE_LENGTH);
        }

        const pincodeRegex = /^[0-9]{6}$/;
        if (!pincodeRegex.test(pincode)) {
            throw new Error(AddressErrors.PINCODE_INVALID);
        }
    }
}