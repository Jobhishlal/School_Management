import { ISuperAdminLogin } from "../../domain/repositories/ISuperAdminAuthService";

export class LoginSuperAdmin {
  constructor(private authService: ISuperAdminLogin) {}

  async execute(email: string, password: string): Promise<string> {

    const isValid = await this.authService.login(email, password);

    if (!isValid) {
      throw new Error("Invalid credentials");
    }

   
    const otpToken = await this.authService.generateOtp(email);

    return otpToken; 
  }
}
