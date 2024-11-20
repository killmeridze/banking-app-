package com.bankist.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.bankist.annotations.LogController;
import com.bankist.service.LoanService;

import java.util.Map;

@RestController
@LogController // Custom annotation to enable logging for this controller
@RequestMapping("/api/loans") // Base URL for all endpoints in this controller
public class LoanController {

    @Autowired
    private LoanService loanService; // Injecting the LoanService dependency

    @PostMapping("/{loanId}/repay")
    public ResponseEntity<?> repayLoan(@PathVariable Long loanId, @RequestBody Map<String, Double> request) {
        // Extract the repayment amount from the request body
        Double repaymentAmount = request.get("amount");
        try {
            // Attempt to repay the loan
            loanService.repayLoan(loanId, repaymentAmount);
            return ResponseEntity.ok().body("Loan repaid successfully");
        } catch (Exception e) {
            // Return an error response if something goes wrong
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}
