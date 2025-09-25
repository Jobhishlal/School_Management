import { Request,Response } from "express";
import { AddressGetAll } from "../../../../applications/useCases/Address/GetAllAddress";
import { AddressEntity } from "../../../../domain/entities/Address";
import { CreatAddressUseCase } from "../../../../applications/useCases/Address/CreateAddress";
import { StatusCodes } from "../../../../shared/constants/statusCodes";

export class AddressManagementController  {
    constructor(
        private readonly addressgetall: AddressGetAll,
        private readonly createaddress: CreatAddressUseCase
    ) {}

    async create(req: Request, res: Response): Promise<void> {
        try {
            const { street, city, state, pincode } = req.body;

            const newAddress = new AddressEntity(
                "", 
                street,
                city,
                state,
                pincode
            );

            console.log("req.body:", req.body);

            const addressCreated = await this.createaddress.execute(newAddress);

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
        }   catch (err: any) {
  console.error(err.message);
  res.status(StatusCodes.BAD_REQUEST).json({
    message: err.message || "Failed to create parent"
  });
}
    }

    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const getall = await this.addressgetall.execute();
            res.status(StatusCodes.OK).json({ message: "List all", getall });
        } catch (error: any) {
            res.status(StatusCodes.BAD_REQUEST).json({
                message: "Cannot list address data",
                error: error.message || error
            });
        }
    }
}
