export interface IGenarateTempPassword{
    execute():Promise<{plain:string,hashed:string}>
}