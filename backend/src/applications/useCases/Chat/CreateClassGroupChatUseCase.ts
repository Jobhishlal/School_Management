import { IChatRepository } from "../../../domain/repositories/Chat/IChatRepository";
import { ICreateClassGroupChatUseCase } from "../../interface/UseCaseInterface/Chat/ICreateClassGroupChatUseCase";
import { IClassRepository } from "../../../domain/repositories/Classrepo/IClassRepository";
import { StudentDetails } from "../../../domain/repositories/Admin/IStudnetRepository";
import { ITeacherCreate } from "../../../domain/repositories/TeacherCreate";
import { Conversation } from "../../../domain/entities/Conversation";

export class CreateClassGroupChatUseCase implements ICreateClassGroupChatUseCase {
    constructor(
        private chatRepo: IChatRepository,
        private classRepo: IClassRepository,
        private studentRepo: StudentDetails,
        private teacherRepo: ITeacherCreate
    ) { }

    async execute(classId: string, creatorId: string, customName?: string): Promise<Conversation> {

        const classData = await this.classRepo.findById(classId);
        if (!classData) {
            throw new Error("Class not found");
        }

        const students = await this.studentRepo.findByClassId(classId);

        const allTeachers = await this.teacherRepo.findAll();

        const activeTeachers = allTeachers.filter(t => !t.blocked);

        const relevantTeachers = activeTeachers.filter(teacher => {

            if (classData.classTeacher && teacher.id === classData.classTeacher) {
                return true;
            }

            if (teacher.department !== classData.department) {
                return false;
            }

            const teacherSubjectNames = (teacher.subjects || []).map(s => s.name);
            const hasCommonSubject = teacherSubjectNames.some(subjectName =>
                classData.subjects?.includes(subjectName) ?? false
            );

            return hasCommonSubject;
        });

        const participants: { participantId: string, participantModel: string }[] = [];

        students.forEach(student => {
            participants.push({
                participantId: student.id, 
                participantModel: 'Students'
            });
        });


        relevantTeachers.forEach(teacher => {
            participants.push({
                participantId: teacher.id,
                participantModel: 'Teacher'
            });
        });


        const groupName = customName || `Class ${classData.className} - ${classData.division}`;

        return await this.chatRepo.createGroupConversation(groupName, participants, classId);
    }
}
