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
@LogService 
public class LoanService {

    @Autowired
    private LoanRepository loanRepository; 
    @Autowired
    private TransactionRepository transactionRepository; 
    @Autowired
    private CardRepository cardRepository; 

    private static final double DEFAULT_INTEREST_RATE = 5.0; 
    private static final double MIN_LOAN_AMOUNT = 100.0;
    private static final double MAX_LOAN_AMOUNT = 10000.0;

    public Loan issueLoan(User user, double amount) {
        if (amount < MIN_LOAN_AMOUNT || amount > MAX_LOAN_AMOUNT) {
            throw new IllegalArgumentException(
                "Loan amount must be between " + MIN_LOAN_AMOUNT + " and " + MAX_LOAN_AMOUNT
            );
        }

        if (hasUnpaidLoans(user.getId())) {
            throw new IllegalArgumentException("User has unpaid loans");
        }

        Loan loan = new Loan();
        loan.setUser(user);
        loan.setAmount(amount);
        loan.setInterestRate(calculateInterestRate(amount));
        loan.setIssueDate(new Date());
        loan.setDueDate(calculateDueDate(amount));
        loan.setActive(true);

        Card card = cardRepository.findFirstByUserId(user.getId());
        if (card != null) {
            card.setBalance(card.getBalance() + amount);
            cardRepository.save(card);
        }

        return loanRepository.save(loan);
    }

    public boolean hasUnpaidLoans(Long userId) {
        List<Loan> loans = loanRepository.findByUserId(userId);
        for (Loan loan : loans) {
            if (loan.getAmount() > 0) {
                return true;
            }
        }
        return false;
    }

    public double calculateInterestRate(double amount) {
        if (amount <= 1000) {
            return DEFAULT_INTEREST_RATE;
        } else if (amount <= 5000) {
            return DEFAULT_INTEREST_RATE - 0.5;
        } else {
            return DEFAULT_INTEREST_RATE - 1.0;
        }
    }

    public Date calculateDueDate(double amount) {
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
        Optional<Loan> loanOpt = loanRepository.findById(loanId);
        if (!loanOpt.isPresent()) {
            throw new Exception("Loan not found");
        }

        Loan loan = loanOpt.get();
        User user = loan.getUser();

        Card card = cardRepository.findFirstByUserId(user.getId());
        if (card == null) {
            throw new Exception("No card found for user");
        }

        if (repaymentAmount > loan.getAmount()) {
            throw new Exception("Repayment amount exceeds loan amount");
        }

        if (repaymentAmount > card.getBalance()) {
            throw new Exception("Insufficient balance");
        }

        Transaction transaction = new Transaction();
        transaction.setUser(user);
        transaction.setAmount(-repaymentAmount);
        transaction.setTransactionDate(new Date());
        transaction.setTransactionType(TransactionType.LOAN_REPAYMENT);
        transaction.setLoan(loan);
        transactionRepository.save(transaction);

        card.setBalance(card.getBalance() - repaymentAmount);
        cardRepository.save(card);

        loan.setAmount(loan.getAmount() - repaymentAmount);
        if (loan.getAmount() <= 0) {
            loan.setActive(false);
        }
        loanRepository.save(loan);
    }

    public List<Loan> getLoansByUserId(Long userId) {
        return loanRepository.findByUserId(userId);
    }

    public Optional<Loan> findLoanById(Long loanId) {
        return loanRepository.findById(loanId);
    }
}
