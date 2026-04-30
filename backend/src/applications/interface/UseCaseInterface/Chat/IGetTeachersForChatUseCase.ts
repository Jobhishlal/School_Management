export interface IGetTeachersForChatUseCase {
    execute(): Promise<ReturnType<typeof JSON.parse>[]>;
}
