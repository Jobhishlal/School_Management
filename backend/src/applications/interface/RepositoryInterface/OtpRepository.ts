import { Otp } from "../../../domain/entities/Otp";

export interface IOTPRepository{
    create(otp:Otp):Promise<Otp>;
    findByEmail(email:string):Promise<Otp|null>;
    findByUserName(username:string):Promise<ReturnType<typeof JSON.parse>>;
    markUsed(email:string):Promise<void>;
    deleteOtp(email:string):Promise<void>;
}
