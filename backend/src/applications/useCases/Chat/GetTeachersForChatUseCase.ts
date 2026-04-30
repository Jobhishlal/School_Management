import { ITeacherCreate } from "../../interface/RepositoryInterface/TeacherCreate";
import { IGetTeachersForChatUseCase } from "../../interface/UseCaseInterface/Chat/IGetTeachersForChatUseCase";

export class GetTeachersForChatUseCase implements IGetTeachersForChatUseCase {
    constructor(private teacherRepo: ITeacherCreate) { }

    async execute(): Promise<ReturnType<typeof JSON.parse>[]> {
        const teachers = await this.teacherRepo.findAll();
        return teachers.map((t: ReturnType<typeof JSON.parse>) => ({
            _id: t.id,
            name: t.name,
            email: t.email,
            profileImage: '',
            role: 'teacher'
        }));
    }
}
