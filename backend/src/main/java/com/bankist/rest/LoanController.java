package com.bankist.rest;

import com.bankist.dto.LoanResponseDTO;
import com.bankist.model.Card;
import com.bankist.repo.CardRepository;
import com.bankist.service.CurrencyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import com.bankist.annotations.LogController;
import com.bankist.service.LoanService;
import com.bankist.model.Loan;
import com.bankist.model.User;
import com.bankist.security.UserPrincipal;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@LogController 
@RequestMapping("/api/loans") 
public class LoanController {

    @Autowired
    private LoanService loanService;
    @Autowired
    private CardRepository cardRepository;
    @Autowired
    private CurrencyService currencyService;
    @PostMapping("/request")
    public ResponseEntity<?> requestLoan(
            @RequestBody Map<String, Object> request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        try {
            double amountInUSD = Double.parseDouble(request.get("amount").toString()); 
            Long cardId = Long.parseLong(request.get("cardId").toString());
            
            Card card = cardRepository.findById(cardId).orElseThrow();
            
            if (amountInUSD < 1000 || amountInUSD > 50000) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", String.format(
                        "Сумма кредита в USD (%.2f) должна быть между 1000 и 50000", 
                        amountInUSD)));
            }
            
            User user = userPrincipal.getUser();
            Loan loan = loanService.issueLoan(user, amountInUSD, cardId);
            
            return ResponseEntity.ok(LoanResponseDTO.fromLoan(loan));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{loanId}/repay")
    public ResponseEntity<?> repayLoan(@PathVariable Long loanId, @RequestBody Map<String, Double> request) {
        Double repaymentAmount = request.get("amount");
        try {
            loanService.repayLoan(loanId, repaymentAmount);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Loan repaid successfully");
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Loan>> getUserLoans(@PathVariable Long userId) {
        try {
            List<Loan> loans = loanService.getLoansByUserId(userId);
            return ResponseEntity.ok(loans);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{loanId}")
    public ResponseEntity<Loan> getLoanDetails(@PathVariable Long loanId) {
        try {
            return loanService.findLoanById(loanId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
