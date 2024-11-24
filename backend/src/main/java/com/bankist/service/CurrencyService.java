package com.bankist.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Service
public class CurrencyService {
    private Map<String, Double> currencyRates;

    public CurrencyService() {
        loadCurrencyRates();
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
        return currencyRates;
    }

    public double convertAmount(double amount, String fromCurrency, String toCurrency) {
        double rateFrom = currencyRates.getOrDefault(fromCurrency, 1.0);
        double rateTo = currencyRates.getOrDefault(toCurrency, 1.0);
        return (amount / rateFrom) * rateTo;
    }
}