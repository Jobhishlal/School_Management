import { FeeType } from "../../../domain/entities/FeeType/FeeType";

export function CalculateAmount(feeType: FeeType, paymentMode: string): number {
  let amount = feeType.defaultAmount;

  const offer = feeType.offers?.find(o => o.type === paymentMode);

  if (offer) {

    if (offer.finalAmount) {
      amount = offer.finalAmount;
    } else if (offer.discountPercentage) {
      amount -= (amount * offer.discountPercentage) / 100;
    } else if (offer.discountAmount) {
      amount -= offer.discountAmount;
    }
  }

  return amount;
}
