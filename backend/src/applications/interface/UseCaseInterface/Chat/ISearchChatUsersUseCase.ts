export interface ISearchChatUsersUseCase {
    execute(query: string, role: string): Promise<ReturnType<typeof JSON.parse>[]>;
}
