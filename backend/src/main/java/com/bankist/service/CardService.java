package com.bankist.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.bankist.annotations.LogService;
import com.bankist.model.Card;
import com.bankist.model.CardType;
import com.bankist.model.User;
import com.bankist.repo.CardRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Date;
import java.util.Random;
import java.util.Calendar;

@Service
@LogService
public class CardService {

    @Autowired
    private CardRepository cardRepository;

    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public Card createCardForUser(User user, String currency, String pin, CardType cardType) {
        Card card = new Card();
        card.setUser(user);
        card.setCardNumber(generateCardNumber());
        card.setCvv(generateCvv());
        card.setExpirationDate(generateExpirationDate());
        card.setPin(passwordEncoder.encode(pin));
        card.setBalance(0.0);
        card.setCurrency(currency);
        card.setCardType(cardType);
        return cardRepository.save(card);
    }

    private String generateCardNumber() {
        Random random = new Random();
        StringBuilder cardNumber = new StringBuilder("5168");
        for (int i = 0; i < 12; i++) { 
            cardNumber.append(random.nextInt(10));
        }
        return cardNumber.toString();
    }

    private int generateCvv() {
        Random random = new Random();
        return 100 + random.nextInt(900);
    }

    private Date generateExpirationDate() {
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.YEAR, 5);
        return calendar.getTime();
    }

    public Card getCardByNumber(String cardNumber) {
        return cardRepository.findByCardNumber(cardNumber);
    }

    public Card getFirstCardByUserId(Long userId) {
        return cardRepository.findFirstByUserId(userId);
    }
}
