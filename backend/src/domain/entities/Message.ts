export class Message {
    constructor(
        public readonly id: string,
        public readonly senderId: string,
        public readonly senderRole: string,
        public readonly receiverId: string,
        public readonly receiverModel: string,
        public readonly content: string,
        public readonly timestamp: Date,
        public readonly read: boolean,
        public readonly type: 'text' | 'image' | 'file' | 'audio',
        public readonly isEdited: boolean = false,
        public readonly isDeleted: boolean = false
    ) { }
}
