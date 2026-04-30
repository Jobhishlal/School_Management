import { RESPONSE_MESSAGES } from "../../../../shared/constants/responseMessages";
import { IGetParentProfileUseCase } from "../../../../applications/interface/UseCaseInterface/Parent/IGetParentProfileUseCase";
import { Request, Response } from "express";
import { StatusCodes } from "../../../../shared/constants/statusCodes";
export class ParentProfileController {
    constructor(private readonly repo: IGetParentProfileUseCase) { }

    async ParentProfile(req: Request, res: Response): Promise<void> {
        try {

            const { id } = req.params
            console.log(id)
            const profile = await this.repo.execute(id)
            console.log("profile details ", profile)
            if (!profile) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: RESPONSE_MESSAGES.PROFILE_DATA_FETCHING_ERROR })
            }
            res.status(StatusCodes.OK)

                .json({ message: RESPONSE_MESSAGES.PROFILE_DATA_FETCHING_SUCCESSFULLY, profile })
            console.log("i am reached here", profile)

        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: RESPONSE_MESSAGES.INTERNAL_SERVER_ERROR_1, error })

        }
    }
}