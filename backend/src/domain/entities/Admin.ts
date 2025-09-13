export class Admin{
    constructor(
   public readonly id : string | null,
   public username : string,
   public email : string,
   public password ?: string

    ){}
}