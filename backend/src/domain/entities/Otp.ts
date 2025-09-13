export class Otp{
    constructor(
        public email:string,
        public code : string,
        public expiresAt:Date,
        public used:Boolean

    ){}
}