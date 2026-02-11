export interface ISearchChatUsersUseCase {
    execute(query: string, role: string): Promise<any[]>;
}
