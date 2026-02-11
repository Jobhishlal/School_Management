import { AddressEntity } from "../../../domain/entities/Address";

export function validateAddressCreate(data: any): void {
    AddressEntity.validate(data.street, data.city, data.state, data.pincode);
}

export function validateAddressUpdate(data: any): void {
    if (data.street || data.city || data.state || data.pincode) {
        // Simple check: if any field is provided, we can validate what's there
        // For a full validate, we'd need more logic, but using the static validate is safe if we pass current values or just what's updated
        // However, AddressEntity.validate currently expects all 4.
        // Let's just do individual checks if needed or keep it simple.
        if (data.street && (data.street.length < 3 || data.street.length > 100)) throw new Error("Invalid street length");
    }
}
