import { Request, Response } from "express";
import { AddressGetAll } from "../../../../applications/useCases/Address/GetAllAddress";
import { AddressEntity } from "../../../../domain/entities/Address";
import { CreatAddressUseCase } from "../../../../applications/useCases/Address/CreateAddress";
import { StatusCodes } from "../../../../shared/constants/statusCodes";
import { IAddressUpdateUseCase } from "../../../../applications/interface/UseCaseInterface/IAddressUpdateUseCase";
import { validateAddressCreate, validateAddressUpdate } from '../../../validators/AddressValidation/AddressValidators';

export class AddressManagementController {
    constructor(
        private readonly _addressgetall: AddressGetAll,
        private readonly _createaddress: CreatAddressUseCase,
        private readonly _addressupdate: IAddressUpdateUseCase
    ) { }

    async create(req: Request, res: Response): Promise<void> {
        try {
            const addressCreated = await this._createaddress.execute(req.body);
            console.log("created", addressCreated)
            res.status(StatusCodes.OK).json({
                message: "Successfully created address",
                address: {
                    _id: addressCreated.id || "",
                    street: addressCreated.street,
                    city: addressCreated.city,
                    state: addressCreated.state,
                    pincode: addressCreated.pincode
                }
            });
        } catch (err: any) {
            console.error(err.message);
            res.status(StatusCodes.BAD_REQUEST).json({
                message: err.message || "Failed to create parent"
            });
        }
    }

    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const getall = await this._addressgetall.execute();
            res.status(StatusCodes.OK).json({ message: "List all", getall });
        } catch (error: any) {
            res.status(StatusCodes.BAD_REQUEST).json({
                message: "Cannot list address data",
                error: error.message || error
            });
        }
    }
    async update(req: Request, res: Response): Promise<void> {

        try {
            const { id } = req.params;
            const update = req.body;

            validateAddressUpdate(update);
            const updateaddress = await this._addressupdate.execute({ id, ...update })
            console.log(updateaddress)
            if (!updateaddress) {
                res.status(StatusCodes.UNAUTHORIZED).json({ message: "Does not existed" })
            }
            res.status(StatusCodes.CREATED).json({ message: "Address update succesfuly", address: updateaddress })

        } catch (error: any) {
            console.error("Error updating class:", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: error.message || "Failed to update class"
            });
        }

    }
}
