import {DocumentDTO} from '../../applications/dto/InstituteProfilet'

export class Institute{
    constructor(
        public _id:string,
        public instituteName:string,
        public contactInformation:string,
        public email:string,
        public phone:string,
        public address: string ,
        public principalName:string,
        public logo: DocumentDTO[] = []
    ){

    }
}