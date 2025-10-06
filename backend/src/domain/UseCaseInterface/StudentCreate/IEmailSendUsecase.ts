

export interface IEmailServiceShare{
    execute(parentName:string,parentEmail:string,studentName:string,studentId:string,tempPassword:string):Promise<void>;
}