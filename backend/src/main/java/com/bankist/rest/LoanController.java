package com.bankist.rest;

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

import java.util.List;
import java.util.Map;

@RestController
@LogController 
@RequestMapping("/api/loans") 
public class LoanController {

    @Autowired
    private LoanService loanService; 
    @PostMapping("/request")
    public ResponseEntity<?> requestLoan(
            @RequestBody Map<String, Object> request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        try {
            if (userPrincipal == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
            }

            double amount = Double.parseDouble(request.get("amount").toString());
            User user = userPrincipal.getUser();
            Loan loan = loanService.issueLoan(user, amount);
            
            return ResponseEntity.ok(loan);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error processing loan request: " + e.getMessage());
        }
    }

    @PostMapping("/{loanId}/repay")
    public ResponseEntity<?> repayLoan(@PathVariable Long loanId, @RequestBody Map<String, Double> request) {
        Double repaymentAmount = request.get("amount");
        try {
            loanService.repayLoan(loanId, repaymentAmount);
            return ResponseEntity.ok().body("Loan repaid successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
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
