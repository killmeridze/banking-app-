export const formatCurrency = (value, currency = "USD") => {
  if (value === undefined || value === null) {
    return "0.00 " + currency;
  }
  return value.toFixed(2) + " " + currency;
};

export const maskCardNumber = (cardNumber) => {
  const cleaned = cardNumber.replace(/\s/g, "");
  const first4 = cleaned.slice(0, 4);
  const last4 = cleaned.slice(-4);
  return `${first4} •••• •••• ${last4}`;
};

export const formatExpiryDate = (date) => {
  const d = new Date(date);
  return `${String(d.getMonth() + 1).padStart(2, "0")}/${String(
    d.getFullYear()
  ).slice(-2)}`;
};

export const maskCVV = (cvv) => "***";

export const formatCardType = (type) => {
  switch (type) {
    case "CREDIT":
      return "Кредитная карта";
    case "DEBIT":
      return "Дебетовая карта";
    default:
      return type;
  }
};
