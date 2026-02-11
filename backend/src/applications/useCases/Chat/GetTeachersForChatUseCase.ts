import { ITeacherCreate } from "../../interface/RepositoryInterface/TeacherCreate";
import { IGetTeachersForChatUseCase } from "../../interface/UseCaseInterface/Chat/IGetTeachersForChatUseCase";

export class GetTeachersForChatUseCase implements IGetTeachersForChatUseCase {
    constructor(private teacherRepo: ITeacherCreate) { }

    async execute(): Promise<any[]> {
        const teachers = await this.teacherRepo.findAll();
        return teachers.map((t: any) => ({
            _id: t.id,
            name: t.name,
            email: t.email,
            profileImage: '',
            role: 'teacher'
        }));
    }
}
