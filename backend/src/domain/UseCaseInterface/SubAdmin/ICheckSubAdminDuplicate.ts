export interface ICheckSubAdminDuplicate{
    execute(email:string,phone:string):Promise<void>
}