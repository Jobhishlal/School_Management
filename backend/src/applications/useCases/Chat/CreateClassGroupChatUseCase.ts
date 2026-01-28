import { IChatRepository } from "../../../domain/repositories/Chat/IChatRepository";
import { ClassModel } from "../../../infrastructure/database/models/ClassModel";
import { StudentModel } from "../../../infrastructure/database/models/StudentModel";
import { TeacherModel } from "../../../infrastructure/database/models/Teachers";

export interface ICreateClassGroupChatUseCase {
    execute(classId: string, creatorId: string): Promise<any>;
}

export class CreateClassGroupChatUseCase implements ICreateClassGroupChatUseCase {
    constructor(private chatRepo: IChatRepository) { }

    async execute(classId: string, creatorId: string): Promise<any> {

        const classData = await ClassModel.findById(classId);
        if (!classData) {
            throw new Error("Class not found");
        }

        const students = await StudentModel.find({ classId: classId });


        const allTeachers = await TeacherModel.find({ blocked: false });

        const relevantTeachers = allTeachers.filter(teacher => {

            if (classData.classTeacher && teacher._id.toString() === classData.classTeacher.toString()) {
                return true;
            }

            if (teacher.department !== classData.department) {
                return false;
            }

            const teacherSubjectNames = teacher.subjects.map(s => s.name);
            const hasCommonSubject = teacherSubjectNames.some(subjectName =>
                classData.subjects?.includes(subjectName) ?? false
            );

            return hasCommonSubject;
        });

        const participants: { participantId: string, participantModel: string }[] = [];

        students.forEach(student => {
            participants.push({
                participantId: student._id.toString(),
                participantModel: 'Students'
            });
        });

        // Add Relevant Teachers
        relevantTeachers.forEach(teacher => {
            participants.push({
                participantId: teacher._id.toString(),
                participantModel: 'Teacher'
            });
        });


        const groupName = `Class ${classData.className} - ${classData.division}`;

        return await this.chatRepo.createGroupConversation(groupName, participants, classId);
    }
}
