const CURRENCY_SYMBOLS = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  INR: "₹"
};

export const getCurrencySymbol = (currencyCode) => {
  return CURRENCY_SYMBOLS[currencyCode] || "$";
};

export const formatPrice = (amount, currencyCode) => {
  const symbol = getCurrencySymbol(currencyCode);
  const number = Number(amount);
  const formatted = Number.isInteger(number) ? number : number.toFixed(2);
  return `${symbol}${formatted}`;
};