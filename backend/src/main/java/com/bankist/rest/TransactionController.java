package com.bankist.rest;

import com.bankist.annotations.LogController;
import com.bankist.model.Transaction;
import com.bankist.service.TransactionService;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

@RestController
@LogController 
@RequestMapping("/api/transactions") 
public class TransactionController {

    @Autowired
    private TransactionService transactionService; 

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Transaction>> getUserTransactions(@PathVariable Long userId) {
        List<Transaction> transactions = transactionService.getTransactionsForUser(userId);
        return ResponseEntity.ok(transactions);
    }

    @GetMapping
    public List<Transaction> getAllTransactions() {
        return transactionService.findAllTransactions();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Transaction> getTransactionById(@PathVariable Long id) {
        return transactionService.findTransactionById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/card/{cardId}")
    public ResponseEntity<List<Transaction>> getCardTransactions(@PathVariable Long cardId) {
        List<Transaction> transactions = transactionService.getTransactionsByCardId(cardId);
        
        transactions.forEach(tx -> {
            Hibernate.initialize(tx.getUser());
            if (tx.getLoan() != null) {
                Hibernate.initialize(tx.getLoan());
            }
            if (tx.getCard() != null) {
                Hibernate.initialize(tx.getCard());
            }
        });
        
        return ResponseEntity.ok(transactions);
    }

    @PostMapping
    public Transaction createTransaction(@RequestBody Transaction transaction) {
        return transactionService.saveTransaction(transaction);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTransaction(@PathVariable Long id) {
        return transactionService.findTransactionById(id)
                .map(trans -> {
                    transactionService.deleteTransaction(id);
                    return ResponseEntity.ok().build();
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
