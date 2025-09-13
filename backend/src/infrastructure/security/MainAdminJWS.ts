import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "super-secret";


export function genarateSuperAdminToken(email:string){
return jwt.sign({email,role:"MAIN_ADMIN"},SECRET,{expiresIn:"1h"})
}

