export const MONTHLY_PRICE_INR = 199;
export const YEARLY_DISCOUNT_PERCENT = 50;
export const YEARLY_FULL_PRICE_INR = MONTHLY_PRICE_INR * 12;
export const YEARLY_PRICE_INR = Math.round(
  YEARLY_FULL_PRICE_INR * (1 - YEARLY_DISCOUNT_PERCENT / 100),
);
export const YEARLY_EFFECTIVE_MONTHLY_INR = YEARLY_PRICE_INR / 12;

export const formatInrAmount = (amount: number) =>
  amount.toLocaleString("en-IN", {
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2,
  });

export const inrLabel = (amount: number) => `₹${formatInrAmount(amount)}`;
