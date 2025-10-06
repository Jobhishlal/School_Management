import bcrypt from 'bcrypt';

export function genaratePassword(length:number=8):string{
    const char = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let password="";
    for(let i=0;i<8;i++){
        password+=char.charAt(Math.floor(Math.random()*char.length))
    }
    console.log("student",password)
    return password
}


export async function hashedPassword(password:string):Promise<string>{
const saltRound = 10;
return await bcrypt.hash(password,saltRound)
}

export async function Samepass(password:string,hashedPassword:string):Promise<boolean>{
    return await bcrypt.compare(password,hashedPassword)
}