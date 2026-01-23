export function ValidateComplaint(data: { concernTitle: string; description: string }) {

    if (!data.concernTitle || !data.concernTitle.trim()) {
        throw new Error("Concern Title is required");
    }

    if (!data.description || !data.description.trim()) {
        throw new Error("Description is required");
    }

    const titleRegex = /^[a-zA-Z\s]+$/;
    if (!titleRegex.test(data.concernTitle)) {
        throw new Error("Concern Title must contain only alphabets and spaces");
    }

    return true;
}
