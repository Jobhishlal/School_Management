import { ParentSignUpEntity } from "../../entities/ParentSignupEntity";

export interface IParentRepositorySign{
findByEmail(email:string):Promise<ParentSignUpEntity|null>;
create(parent:ParentSignUpEntity):Promise<ParentSignUpEntity>;
findStudentById(studentId:string):Promise<any>;
linkParenttoStudent(studentId:string,parentId:string):Promise<void>
updatePassword(email: string, hashedPassword: string): Promise<ParentSignUpEntity | null>;
} 