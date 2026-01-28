export interface SendMessageRequestDTO {
    receiverId: string;
    receiverRole: string;
    content: string;
    type?: 'text' | 'image' | 'file';
}

export interface EditMessageRequestDTO {
    messageId: string;
    content: string;
}

export interface DeleteMessageRequestDTO {
    messageId: string;

}

export interface MessageResponseDTO {
    id: string;
    senderId: string;
    senderRole: string;
    receiverId: string;
    receiverModel: string;
    content: string;
    timestamp: Date;
    read: boolean;
    type: string;
    isEdited: boolean;
    isDeleted: boolean;
}

export interface ConversationParticipantDTO {
    participantId: string;
    participantModel: string;
    name?: string;
    email?: string;
    profileImage?: string;
    role?: string;
}

export interface ConversationResponseDTO {
    id: string;
    participants: ConversationParticipantDTO[];
    lastMessage?: {
        content: string;
        timestamp: Date;
    };
    updatedAt: Date;
    isGroup: boolean;
    groupName?: string;
    unreadCount: number;
}
