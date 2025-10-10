export interface IAssignTeacherOnClass{
    execute(classId:string,teacherId:string):Promise<boolean>
}