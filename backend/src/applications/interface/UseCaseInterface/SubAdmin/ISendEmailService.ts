export interface ISendEmailService{
    execute(to:string,subject:string,message:string):Promise<void>
}