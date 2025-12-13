export interface IGETALLCLASSTEACHER{
    execute():Promise<{teacherId:string,name:string}[]>
}