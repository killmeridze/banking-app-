package com.bankist.rest;

import com.bankist.service.CurrencyService;
import com.bankist.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/exchange-rates")
public class ExchangeRatesController {
    @Autowired
    private CurrencyService currencyService;
    
    @GetMapping
    public ResponseEntity<Map<String, Object>> getExchangeRates() {
        return ResponseEntity.ok(Map.of(
            "base", "USD",
            "rates", currencyService.getCurrencyRates()
        ));
    }
}