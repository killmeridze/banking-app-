package com.bankist.service;

import com.bankist.model.*;
import com.bankist.repo.CardRepository;
import com.bankist.repo.TransactionRepository;
import com.bankist.repo.UserRepository;
import com.bankist.security.UserPrincipal;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.bankist.annotations.LogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.io.IOException;
import java.util.*;

@Service
@LogService
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository; 
    @Autowired
    private UserRepository userRepository; 
    @Autowired
    private CardRepository cardRepository; 
    @Autowired
    private CurrencyService currencyService;
    private Map<String, Double> currencyRates;
    @Autowired
    private LoanService loanService;


    public TransactionService() {
        loadCurrencyRates();
    }

    public List<Transaction> findAllTransactions() {
        return transactionRepository.findAll();
    }

    public Optional<Transaction> findTransactionById(Long id) {
        return transactionRepository.findById(id);
    }

    public Transaction saveTransaction(Transaction transaction) {
        return transactionRepository.save(transaction);
    }

    public void deleteTransaction(Long id) {
        transactionRepository.deleteById(id);
    }

    public List<Transaction> getTransactionsForUser(Long userId) {
        return transactionRepository.findByUserId(userId);
    }

    private void loadCurrencyRates() {
        ObjectMapper mapper = new ObjectMapper();
        try {
            Resource resource = new ClassPathResource("exchange-rates.json");
            Map<String, Map<String, Double>> data = mapper.readValue(resource.getInputStream(), HashMap.class);
            currencyRates = data.get("rates");
        } catch (IOException e) {
            e.printStackTrace();
            currencyRates = new HashMap<>();
        }
    }

    public Map<String, Double> getCurrencyRates() {
        if (currencyRates == null || currencyRates.isEmpty()) {
            loadCurrencyRates();
        }
        return Collections.unmodifiableMap(currencyRates);
    }

    public double convertAmount(double amount, String fromCurrency, String toCurrency) {
        return currencyService.convertAmount(amount, fromCurrency, toCurrency);
    }


    @Transactional
    public boolean transferByCardNumber(String fromCardNumber, String toCardNumber, double amount) {
        try {
            fromCardNumber = fromCardNumber.replaceAll("\\s+", "");
            toCardNumber = toCardNumber.replaceAll("\\s+", "");
            
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            UserPrincipal userPrincipal = (UserPrincipal) auth.getPrincipal();
            
            Card senderCard = cardRepository.findByCardNumberAndUserId(fromCardNumber, userPrincipal.getId());
            if (senderCard == null) {
                throw new IllegalArgumentException("Sender card not found");
            }

            Card recipientCard = cardRepository.findByCardNumber(toCardNumber);
            if (recipientCard == null) {
                throw new IllegalArgumentException("Recipient card not found");
            }

            if (senderCard.getBalance() < amount) {
                throw new IllegalArgumentException("Insufficient funds");
            }

            double amountToDebit = amount;
            double amountToCredit = amount;
            
            if (!senderCard.getCurrency().equals(recipientCard.getCurrency())) {
                amountToCredit = currencyService.convertAmount(
                    amount,
                    senderCard.getCurrency(),
                    recipientCard.getCurrency()
                );
            }

            senderCard.setBalance(senderCard.getBalance() - amountToDebit);
            recipientCard.setBalance(recipientCard.getBalance() + amountToCredit);

            cardRepository.save(senderCard);
            cardRepository.save(recipientCard);

            Transaction senderTx = new Transaction();
            senderTx.setUser(senderCard.getUser());
            senderTx.setCard(senderCard);
            senderTx.setAmount(-amountToDebit); 
            senderTx.setTransactionDate(new Date());
            senderTx.setTransactionType(TransactionType.TRANSFER);
            Transaction savedSenderTx = transactionRepository.save(senderTx);

            Transaction recipientTx = new Transaction();
            recipientTx.setUser(recipientCard.getUser());
            recipientTx.setCard(recipientCard);
            recipientTx.setAmount(amountToCredit); 
            recipientTx.setTransactionDate(new Date());
            recipientTx.setTransactionType(TransactionType.TRANSFER);
            Transaction savedRecipientTx = transactionRepository.save(recipientTx);

            if (savedSenderTx.getId() == null || savedRecipientTx.getId() == null) {
                throw new RuntimeException("Failed to save transfer transactions");
            }

            return true;

        } catch (Exception e) {
            throw new IllegalArgumentException("Transfer failed: " + e.getMessage());
        }
    }

    @Transactional
    public List<Transaction> getTransactionsByCardId(Long cardId) {
        return transactionRepository.findByCardId(cardId);
    }
}
