
import { FeeTypeValidation } from "../../../domain/enums/FeeStructure/FeeTypeCreate";
import { CreateFeeTypeDTO } from "../../../applications/dto/FeeDTO/CreateFeeTypeDTO";

export function FeeTypeValidationfunction(data: CreateFeeTypeDTO) {
    if (!data.name || !data.defaultAmount || !data.frequency) {
        throw new Error(FeeTypeValidation.ALL_FIELDS_REQUIRED)
    }
    if (data.name.trim() === "") {
        throw new Error(FeeTypeValidation.INVALID_NAME);
    }
    if (data.defaultAmount <= 0) {
        throw new Error(FeeTypeValidation.NEGATIVE_DISCOUNT)
    }
    if (!["ONCE", "MONTHLY", "YEARLY"].includes(data.frequency)) {
        throw new Error(FeeTypeValidation.INVALID_FREQUENCY);
    }

    if (data.offers && data.offers.length > 0) {
        data.offers.forEach((offer) => {

            if (!offer.type) {
                throw new Error(FeeTypeValidation.INVALID_OFFER);
            }

            if (offer.discountAmount && offer.discountAmount < 0) {
                throw new Error(FeeTypeValidation.NEGATIVE_DISCOUNT);
            }

            if (offer.discountPercentage && offer.discountPercentage < 0) {
                throw new Error(FeeTypeValidation.NEGATIVE_DISCOUNT);
            }

            if (
                offer.finalAmount &&
                offer.finalAmount > data.defaultAmount
            ) {
                throw new Error(FeeTypeValidation.INVALID_FINAL_AMOUNT);
            }
        });
    }

    return true


}
