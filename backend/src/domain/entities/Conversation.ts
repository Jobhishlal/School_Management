export interface ConversationParticipant {
    participantId: string;
    participantModel: string;
    // Optional populated details for UI
    name?: string;
    email?: string;
    profileImage?: string;
    role?: string;
}

export class Conversation {
    constructor(
        public readonly id: string,
        public readonly participants: ConversationParticipant[],
        public readonly lastMessageId: string | null,
        // Optional populated last message
        public readonly lastMessageContent?: string | null,
        public readonly lastMessageTimestamp?: Date | null,

        public readonly updatedAt: Date = new Date(),
        public readonly isGroup: boolean = false,
        public readonly groupName?: string,
        public readonly classId?: string,

        // Domain specific field often calculated in repo
        public readonly unreadCount: number = 0
    ) { }
}
