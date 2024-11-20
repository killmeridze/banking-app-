package com.bankist.rest;

import com.bankist.annotations.LogController;
import com.bankist.model.Transaction;
import com.bankist.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@LogController // Custom annotation to enable logging for this controller
@RequestMapping("/api/transactions") // Base URL for all endpoints in this controller
public class TransactionController {

    @Autowired
    private TransactionService transactionService; // Injecting the TransactionService dependency

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Transaction>> getUserTransactions(@PathVariable Long userId) {
        // Fetch transactions for a specific user
        List<Transaction> transactions = transactionService.getTransactionsForUser(userId);
        return ResponseEntity.ok(transactions);
    }

    @GetMapping
    public List<Transaction> getAllTransactions() {
        // Fetch all transactions
        return transactionService.findAllTransactions();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Transaction> getTransactionById(@PathVariable Long id) {
        // Fetch a transaction by its ID
        return transactionService.findTransactionById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Transaction createTransaction(@RequestBody Transaction transaction) {
        // Create a new transaction
        return transactionService.saveTransaction(transaction);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTransaction(@PathVariable Long id) {
        // Delete a transaction by its ID
        return transactionService.findTransactionById(id)
                .map(trans -> {
                    transactionService.deleteTransaction(id);
                    return ResponseEntity.ok().build();
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
