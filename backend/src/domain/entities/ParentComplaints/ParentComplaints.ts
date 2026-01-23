export type TicketStatus = 'Pending' | 'solved'

export class ParentComplaints {
    constructor(
        public parentId: string,
        public concernTitle: string,
        public description: string,
        public concernDate: Date = new Date(),
        public ticketStatus: TicketStatus = 'Pending',
        public id?: string
    ) { }

    markAsSolved() {
        this.ticketStatus = 'solved';
    }
}