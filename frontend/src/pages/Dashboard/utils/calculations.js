export const calculateSummary = (movements, loans, currency, convert) => {
  let incomes = 0;
  let outgoings = 0;
  let interests = 0;

  if (movements && movements.length > 0) {
    movements.forEach((mov) => {
      const amount = Math.abs(mov.amount);

      switch (mov.transactionType) {
        case "LOAN_ISSUE":
          incomes += amount;
          break;
        case "LOAN_REPAYMENT":
          outgoings += amount;
          break;
        case "TRANSFER":
          if (mov.amount > 0) {
            incomes += amount;
          } else {
            outgoings += amount;
          }
          break;
        case "DEPOSIT":
          incomes += amount;
          break;
        case "WITHDRAWAL":
          outgoings += amount;
          break;
        default:
          if (mov.amount > 0) {
            incomes += amount;
          } else {
            outgoings += amount;
          }
      }
    });
  }

  if (loans && loans.length > 0) {
    loans.forEach((loan) => {
      if (loan.paidAmount < loan.totalAmount) {
        const interestAmount = convert(loan.interestAmount, "USD", currency);
        interests += interestAmount;
      }
    });
  }

  return { incomes, outgoings, interests };
};
