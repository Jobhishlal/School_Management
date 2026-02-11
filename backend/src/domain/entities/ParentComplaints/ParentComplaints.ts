export type TicketStatus = 'Pending' | 'solved'

export class ParentComplaints {
    constructor(
        public parentId: string,
        public concernTitle: string,
        public description: string,
        public concernDate: Date = new Date(),
        public ticketStatus: TicketStatus = 'Pending',
        public id?: string,
        public adminFeedback?: string,
        public studentName?: string
    ) { }

    public static validate(data: { concernTitle: string; description: string }): void {
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
    }

    markAsSolved() {
        this.ticketStatus = 'solved';
    }
}