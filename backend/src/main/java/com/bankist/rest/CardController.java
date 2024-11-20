package com.bankist.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.bankist.annotations.LogController;
import com.bankist.model.Card;
import com.bankist.model.CardType;
import com.bankist.service.CardService;
import com.bankist.service.UserService;
import com.bankist.model.User;

import java.util.Map;
import java.util.Optional;

@RestController
@LogController
@RequestMapping("/api/cards")
public class CardController {

    @Autowired
    private CardService cardService;

    @Autowired
    private UserService userService;

    @PostMapping("/create")
    public ResponseEntity<Card> createCard(@RequestBody Map<String, String> requestData) {
        Long userId = Long.parseLong(requestData.get("userId"));
        String currency = requestData.get("currency");
        String pin = requestData.get("pin");
        String cardTypeStr = requestData.get("cardType");

        Optional<User> userOpt = userService.findUserById(userId);

        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        CardType cardType;
        try {
            cardType = CardType.valueOf(cardTypeStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }

        Card newCard = cardService.createCardForUser(userOpt.get(), currency, pin, cardType);
        return ResponseEntity.ok(newCard);
    }
}
