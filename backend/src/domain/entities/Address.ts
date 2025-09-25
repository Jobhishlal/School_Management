
export class AddressEntity{
    constructor(
        public id:string,
        public street:string,
        public city:string,
        public state:string,
        public pincode:string,
    ){}
}