package com.bankist.service;

import com.bankist.model.*;
import com.bankist.repo.CardRepository;
import com.bankist.repo.LoanTransactionRepository;
import com.bankist.repo.TransactionRepository;
import com.bankist.repo.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.bankist.annotations.LogService;
import com.bankist.model.*;
import com.bankist.repo.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.util.*;

@Service
@LogService // Custom annotation to enable logging for this service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository; // Injecting the TransactionRepository dependency
    @Autowired
    private UserRepository userRepository; // Injecting the UserRepository dependency
    @Autowired
    private CardRepository cardRepository; // Injecting the CardRepository dependency
    @Autowired
    private LoanService loanService; // Injecting the LoanService dependency
    @Autowired
    private LoanTransactionRepository loanTransactionRepository; // Injecting the LoanTransactionRepository dependency
    private Map<String, Double> currencyRates;

    public TransactionService() {
        // Load currency rates from a JSON file
        loadCurrencyRates();
    }

    public List<Transaction> findAllTransactions() {
        // Retrieve all transactions
        return transactionRepository.findAll();
    }

    public Optional<Transaction> findTransactionById(Long id) {
        // Find a transaction by its ID
        return transactionRepository.findById(id);
    }

    public Transaction saveTransaction(Transaction transaction) {
        // Save a transaction to the repository
        return transactionRepository.save(transaction);
    }

    public void deleteTransaction(Long id) {
        // Delete a transaction by its ID
        transactionRepository.deleteById(id);
    }

    public List<Transaction> getTransactionsForUser(Long userId) {
        // Retrieve transactions for a specific user
        return transactionRepository.findByUserId(userId);
    }

    private void loadCurrencyRates() {
        // Load currency rates from a JSON file
        ObjectMapper mapper = new ObjectMapper();
        try {
            Map<String, Map<String, Double>> data = mapper.readValue(new File("src/main/resources/static/bankist/exchangeRates.json"), HashMap.class);
            currencyRates = data.get("rates");
        } catch (IOException e) {
            e.printStackTrace();
            currencyRates = new HashMap<>();
        }
    }

    public double convertAmount(double amount, String fromCurrency, String toCurrency) {
        // Convert an amount from one currency to another
        double rateFrom = currencyRates.getOrDefault(fromCurrency, 1.0);
        double rateTo = currencyRates.getOrDefault(toCurrency, 1.0);
        return (amount * rateFrom) / rateTo;
    }

    public boolean transferMoney(Long fromUserId, Long toUserId, double amount) {
        // Transfer money between two users
        User fromUser = userRepository.findById(fromUserId).orElseThrow(() -> new IllegalArgumentException("User not found"));
        User toUser = userRepository.findById(toUserId).orElseThrow(() -> new IllegalArgumentException("User not found"));

        Card fromCard = cardRepository.findFirstByUserId(fromUserId);
        Card toCard = cardRepository.findFirstByUserId(toUserId);

        if (fromCard == null || toCard == null) {
            throw new IllegalArgumentException("Card not found for one of the users.");
        }

        if (fromCard.getBalance() < amount) {
            throw new IllegalArgumentException("Insufficient balance.");
        }

        double convertedAmount = convertAmount(amount, fromCard.getCurrency(), toCard.getCurrency());

        fromCard.setBalance(fromCard.getBalance() - amount);
        cardRepository.save(fromCard);

        toCard.setBalance(toCard.getBalance() + convertedAmount);
        cardRepository.save(toCard);

        Transaction transaction = new Transaction();
        transaction.setUser(fromUser);
        transaction.setAmount(-amount);
        transaction.setTransactionDate(new Date());
        transaction.setTransactionType(TransactionType.TRANSFER);
        transactionRepository.save(transaction);

        Transaction transactionReceived = new Transaction();
        transactionReceived.setUser(toUser);
        transactionReceived.setAmount(convertedAmount);
        transactionReceived.setTransactionDate(new Date());
        transactionReceived.setTransactionType(TransactionType.TRANSFER);
        transactionRepository.save(transactionReceived);

        return true;
    }

    public boolean requestLoan(Long userId, double amount) {
        // Request a loan for a user
        Optional<User> userOpt = userRepository.findById(userId);
        if (!userOpt.isPresent()) {
            return false;
        }

        try {
            Loan loan = loanService.issueLoan(userOpt.get(), amount);

            LoanTransaction transaction = new LoanTransaction();
            transaction.setLoan(loan);
            transaction.setAmount(loan.getAmount());
            transaction.setTransactionDate(new Date());
            transaction.setType(TransactionType.LOAN_ISSUE);
            loanTransactionRepository.save(transaction);

            return true;
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException(e.getMessage());
        }
    }
}
