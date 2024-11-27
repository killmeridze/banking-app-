package com.bankist.service;

import com.bankist.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.bankist.annotations.LogService;
import com.bankist.model.*;
import com.bankist.repo.CardRepository;
import com.bankist.repo.LoanRepository;
import com.bankist.repo.TransactionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.transaction.annotation.Transactional;

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
    @Autowired
    private CurrencyService currencyService;

    private static final double DEFAULT_INTEREST_RATE = 5.0; 
    private static final double BASE_MIN_LOAN_AMOUNT_USD = 1000.0;
    private static final double BASE_MAX_LOAN_AMOUNT_USD = 50000.0;

    @Transactional
    public Loan issueLoan(User user, double amountInUSD, Long cardId) {
        
        Card card = cardRepository.findById(cardId)
                .orElseThrow(() -> new IllegalArgumentException("Карта с ID " + cardId + " не найдена."));


        double amountInCardCurrency = currencyService.convertAmount(amountInUSD, "USD", card.getCurrency());

        card.setBalance(card.getBalance() + amountInCardCurrency);
        Card savedCard = cardRepository.save(card);

        Loan loan = new Loan();
        loan.setUser(user);
        loan.setAmount(amountInUSD); 
        loan.setInterestRate(calculateInterestRate(amountInUSD));
        loan.setIssueDate(new Date());
        loan.setDueDate(calculateDueDate(amountInUSD));
        loan.setInterestAmount(calculateInterestAmount(amountInUSD));
        loan.setTotalAmount(amountInUSD + calculateInterestAmount(amountInUSD));
        loan.setPaidAmount(0.0);
        loan.setActive(true);
        loan.setCard(savedCard); 
        
        Loan savedLoan = loanRepository.save(loan);

        Transaction loanTransaction = new Transaction();
        loanTransaction.setUser(user);
        loanTransaction.setCard(card);
        loanTransaction.setAmount(amountInCardCurrency);
        loanTransaction.setTransactionDate(new Date());
        loanTransaction.setTransactionType(TransactionType.LOAN_ISSUE);
        loanTransaction.setLoan(savedLoan);
        transactionRepository.save(loanTransaction);

        return savedLoan;
    }

    private double calculateInterestAmount(double amount) {
        return amount * (calculateInterestRate(amount) / 100);
    }

    public double getMinLoanAmount(String currency) {
        return currencyService.convertAmount(BASE_MIN_LOAN_AMOUNT_USD, "USD", currency);
    }

    public double getMaxLoanAmount(String currency) {
        return currencyService.convertAmount(BASE_MAX_LOAN_AMOUNT_USD, "USD", currency);
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

    private Date calculateDueDate(double amount) {
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

    public void repayLoan(Long loanId, Double repaymentAmountInCardCurrency) throws Exception {
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

        double repaymentAmountInUSD = currencyService.convertAmount(
            repaymentAmountInCardCurrency, 
            card.getCurrency(), 
            "USD"
        );

        double remainingAmountInUSD = loan.getTotalAmount() - loan.getPaidAmount();
        
        if (repaymentAmountInUSD <= 0) {
            throw new Exception("Repayment amount must be greater than zero");
        }
        
        if (repaymentAmountInUSD > remainingAmountInUSD) {
            throw new Exception(String.format(
                "Repayment amount (%.2f USD) exceeds the remaining loan amount (%.2f USD)", 
                repaymentAmountInUSD, remainingAmountInUSD));
        }

        if (repaymentAmountInCardCurrency > card.getBalance()) {
            throw new Exception("Insufficient card balance");
        }

        card.setBalance(card.getBalance() - repaymentAmountInCardCurrency);
        cardRepository.save(card);

        loan.setPaidAmount(loan.getPaidAmount() + repaymentAmountInUSD);
        
        if (loan.getPaidAmount() >= loan.getTotalAmount()) {
            loan.setActive(false);
        }
        
        loanRepository.save(loan);

        Transaction transaction = new Transaction();
        transaction.setUser(user);
        transaction.setCard(card);
        transaction.setLoan(loan);
        transaction.setAmount(-repaymentAmountInCardCurrency);
        transaction.setTransactionDate(new Date());
        transaction.setTransactionType(TransactionType.LOAN_REPAYMENT);
        transactionRepository.save(transaction);
    }

    public List<Loan> getLoansByUserId(Long userId) {
        return loanRepository.findByUserId(userId);
    }

    public Optional<Loan> findLoanById(Long loanId) {
        return loanRepository.findById(loanId);
    }

    public boolean hasUnpaidLoans(Long userId) {
    List<Loan> loans = loanRepository.findByUserId(userId);
    return loans.stream().anyMatch(loan -> loan.getAmount() > 0);
    }
}
