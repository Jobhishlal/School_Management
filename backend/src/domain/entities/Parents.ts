export class ParentEntity{
    constructor(
     public id :string,
     public name:string,
     public contactNumber:string,
     public whatsappNumber: string,
     public email:string,
     public relationship?:"Son"|"Daughter"

    ){}
}