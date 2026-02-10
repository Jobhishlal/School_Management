
import { ITokenService } from "../../../infrastructure/services/interfaces/ITokenService";

import { IRefreshTokenUseCase } from "../../../domain/UseCaseInterface/IRefreshTokenUseCase";

export class RefreshTokenUseCase implements IRefreshTokenUseCase {
    constructor(
        private tokenService: ITokenService
    ) { }

    async execute(token: string) {
        try {
            const decoded = this.tokenService.verifyRefreshToken(token);
           
            const authToken = this.tokenService.generateAccessToken({
                email: decoded.email,
                role: decoded.role,
                id: decoded.id,
                studentId: decoded.studentId
            });
            return { authToken, role: decoded.role, id: decoded.id, email: decoded.email };
        } catch (error) {
            throw new Error("Invalid or expired refresh token");
        }
    }
}
