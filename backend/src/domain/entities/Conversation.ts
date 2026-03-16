export interface ConversationParticipant {
    participantId: string;
    participantModel: string;
  
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
      
        public readonly lastMessageContent?: string | null,
        public readonly lastMessageTimestamp?: Date | null,
        public readonly lastMessageType?: string | null,

        public readonly updatedAt: Date = new Date(),
        public readonly isGroup: boolean = false,
        public readonly groupName?: string,
        public readonly classId?: string,

   
        public readonly unreadCount: number = 0
    ) { }
}
