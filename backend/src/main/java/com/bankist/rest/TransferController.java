package com.bankist.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.bankist.service.TransactionService;
import com.bankist.annotations.LogController;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import com.bankist.model.Card;
import com.bankist.repo.CardRepository;
import com.bankist.security.UserPrincipal;

import java.util.Map;

@RestController
@LogController
@RequestMapping("/api/transfers")
public class TransferController {

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private CardRepository cardRepository;

    @PostMapping
    public ResponseEntity<?> transfer(@RequestBody Map<String, Object> request) {
        try {
            String fromCardNumber = (String) request.get("fromCardNumber");
            String toCardNumber = (String) request.get("toCardNumber");
            Double amount = Double.parseDouble(request.get("amount").toString());

            if (fromCardNumber == null || toCardNumber == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Card numbers cannot be null"));
            }

            boolean success = transactionService.transferByCardNumber(
                fromCardNumber,
                toCardNumber,
                amount
            );

            if (success) {
                return ResponseEntity.ok(Map.of("message", "Transfer completed successfully"));
            } else {
                return ResponseEntity.badRequest().body(Map.of("error", "Transfer failed"));
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}