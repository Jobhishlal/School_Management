export interface IPasswordsubadmin{
    execute():Promise<{plain:string,hashed:string}>;
}