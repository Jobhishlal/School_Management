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
    _id: string;
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
    participantId: any; 
    participantModel: string;
}

export interface ConversationResponseDTO {
    _id: string;
    participants: ConversationParticipantDTO[];
    lastMessage?: {
        content: string;
        timestamp: Date;
        type: string;
    };
    updatedAt: Date;
    isGroup: boolean;
    groupName?: string;
    unreadCount: number;
}
