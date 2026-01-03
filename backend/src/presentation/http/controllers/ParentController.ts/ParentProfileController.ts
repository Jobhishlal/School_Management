import { IGetParentProfileUseCase } from "../../../../domain/UseCaseInterface/Parent/IGetParentProfileUseCase";
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
                res.status(StatusCodes.BAD_REQUEST).json({ message: "profile data fetching error" })
            }
            res.status(StatusCodes.OK)

                .json({ message: "profile data fetching successfully", profile })
            console.log("i am reached here", profile)

        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: 'internal server error', error })

        }
    }
}