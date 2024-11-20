export const calculateSummary = (movements, loans) => {
  const incomes = movements
    .filter((mov) => mov.amount > 0)
    .reduce((acc, mov) => acc + mov.amount, 0);

  const outgoings = Math.abs(
    movements
      .filter((mov) => mov.amount < 0)
      .reduce((acc, mov) => acc + mov.amount, 0)
  );

  const interests = loans.reduce((acc, loan) => {
    return acc + loan.amount * (loan.interestRate / 100);
  }, 0);

  return { incomes, outgoings, interests };
};
