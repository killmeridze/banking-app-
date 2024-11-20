package com.bankist.service;

import com.bankist.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.bankist.annotations.LogService;
import com.bankist.model.*;
import com.bankist.repo.CardRepository;
import com.bankist.repo.LoanRepository;
import com.bankist.repo.TransactionRepository;

import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
@LogService // Custom annotation to enable logging for this service
public class LoanService {

    @Autowired
    private LoanRepository loanRepository; // Injecting the LoanRepository dependency
    @Autowired
    private TransactionRepository transactionRepository; // Injecting the TransactionRepository dependency
    @Autowired
    private CardRepository cardRepository; // Injecting the CardRepository dependency

    private static final double DEFAULT_INTEREST_RATE = 5.0; // Default interest rate for loans

    public Loan issueLoan(User user, double amount) {
        // Issue a new loan for a user with the specified amount
        if (hasUnpaidLoans(user.getId())) {
            throw new IllegalArgumentException("User has unpaid loans. Cannot issue a new loan.");
        }

        Loan loan = new Loan();
        loan.setUser(user);
        loan.setAmount(amount);
        loan.setInterestRate(calculateInterestRate(amount));
        loan.setIssueDate(new Date());
        loan.setDueDate(calculateDueDate(amount));

        Card card = cardRepository.findFirstByUserId(user.getId());
        if (card != null) {
            card.setBalance(card.getBalance() + amount);
            cardRepository.save(card);
        }

        return loanRepository.save(loan);
    }

    public boolean hasUnpaidLoans(Long userId) {
        // Check if the user has any unpaid loans
        List<Loan> loans = loanRepository.findByUserId(userId);
        for (Loan loan : loans) {
            if (loan.getAmount() > 0) {
                return true;
            }
        }
        return false;
    }

    public double calculateInterestRate(double amount) {
        // Calculate the interest rate based on the loan amount
        if (amount <= 1000) {
            return DEFAULT_INTEREST_RATE;
        } else if (amount <= 5000) {
            return DEFAULT_INTEREST_RATE - 0.5;
        } else {
            return DEFAULT_INTEREST_RATE - 1.0;
        }
    }

    public Date calculateDueDate(double amount) {
        // Calculate the due date based on the loan amount
        Calendar calendar = Calendar.getInstance();
        if (amount <= 1000) {
            calendar.add(Calendar.MONTH, 12);
        } else if (amount <= 5000) {
            calendar.add(Calendar.MONTH, 24);
        } else {
            calendar.add(Calendar.MONTH, 36);
        }
        return calendar.getTime();
    }

    public void repayLoan(Long loanId, Double repaymentAmount) throws Exception {
        // Repay a loan with the specified repayment amount
        Optional<Loan> loanOpt = loanRepository.findById(loanId);
        if (!loanOpt.isPresent()) {
            throw new Exception("Loan not found");
        }

        Loan loan = loanOpt.get();
        User user = loan.getUser();

        Card card = cardRepository.findFirstByUserId(user.getId());
        if (card == null) {
            throw new Exception("No card found for user.");
        }

        if (repaymentAmount > loan.getAmount()) {
            throw new Exception("Repayment amount exceeds the remaining loan amount.");
        }

        double cardBalance = card.getBalance();
        if (repaymentAmount > cardBalance) {
            throw new Exception("Insufficient balance.");
        }

        Transaction transaction = new Transaction();
        transaction.setUser(user);
        transaction.setAmount(-repaymentAmount);
        transaction.setTransactionDate(new Date());
        transaction.setTransactionType(TransactionType.LOAN_REPAYMENT);
        transactionRepository.save(transaction);

        card.setBalance(cardBalance - repaymentAmount);
        cardRepository.save(card);

        loan.setAmount(loan.getAmount() - repaymentAmount);
        if (loan.getAmount() <= 0) {
            loanRepository.delete(loan);
        } else {
            loanRepository.save(loan);
        }
    }
}
