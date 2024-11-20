package com.bankist.dto;

import lombok.Data;

import java.util.Date;

@Data // Lombok annotation that generates getters, setters, toString, equals, and hashCode methods
public class CardUserDTO {
    private Long id; // Unique identifier for the card
    private String cardNumber; // Card number
    private Date expirationDate; // Expiration date of the card
    private int cvv; // CVV code of the card
    private Long userId; // User ID associated with the card

    // Constructor to initialize all fields
    public CardUserDTO(Long id, String cardNumber, Date expirationDate, int cvv, Long userId) {
        this.id = id;
        this.cardNumber = cardNumber;
        this.expirationDate = expirationDate;
        this.cvv = cvv;
        this.userId = userId;
    }
}
