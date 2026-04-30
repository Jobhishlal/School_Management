import { RESPONSE_MESSAGES } from "../../../../shared/constants/responseMessages";
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
                message: RESPONSE_MESSAGES.SUCCESSFULLY_CREATED_ADDRESS,
                address: {
                    _id: addressCreated.id || "",
                    street: addressCreated.street,
                    city: addressCreated.city,
                    state: addressCreated.state,
                    pincode: addressCreated.pincode
                }
            });
        } catch (err: unknown) {
            console.error((err as Error).message);
            res.status(StatusCodes.BAD_REQUEST).json({
                message: (err as Error).message || "Failed to create parent"
            });
        }
    }

    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const getall = await this._addressgetall.execute();
            res.status(StatusCodes.OK).json({ message: RESPONSE_MESSAGES.LIST_ALL, getall });
        } catch (error: unknown) {
            res.status(StatusCodes.BAD_REQUEST).json({
                message: RESPONSE_MESSAGES.CANNOT_LIST_ADDRESS_DATA,
                error: (error as Error).message || error
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
                res.status(StatusCodes.UNAUTHORIZED).json({ message: RESPONSE_MESSAGES.DOES_NOT_EXISTED })
            }
            res.status(StatusCodes.CREATED).json({ message: RESPONSE_MESSAGES.ADDRESS_UPDATE_SUCCESFULY, address: updateaddress })

        } catch (error: unknown) {
            console.error("Error updating class:", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: (error as Error).message || "Failed to update class"
            });
        }

    }
}
