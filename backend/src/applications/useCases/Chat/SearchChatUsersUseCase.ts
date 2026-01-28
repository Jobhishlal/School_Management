import { StudentDetails } from "../../../domain/repositories/Admin/IStudnetRepository";
import { ITeacherCreate } from "../../../domain/repositories/TeacherCreate";
import { ISearchChatUsersUseCase } from "../../../domain/interfaces/useCases/Chat/ISearchChatUsersUseCase";

export class SearchChatUsersUseCase implements ISearchChatUsersUseCase {
    constructor(
        private studentRepo: StudentDetails,
        private teacherRepo: ITeacherCreate
    ) { }

    async execute(query: string, role: string): Promise<any[]> {
        let users: any[] = [];

        if (role === 'student') {
            const students = await this.studentRepo.search(query);
            users = students.map(s => ({
                _id: s.id,
                name: s.fullName,
                email: s.studentId,
                profileImage: s.photos?.[0]?.url || '',
                role: 'student',
                isOnline: false
            }));
        } else {
            const teachers = await this.teacherRepo.search(query);
            users = teachers.map(t => ({
                _id: t.id,
                name: t.name,
                email: t.email,
                profileImage: '',
                role: 'teacher',
                isOnline: false
            }));
        }
        return users;
    }
}
