package com.bankist.repo;

import com.bankist.annotations.LogRepository;
import com.bankist.model.Card;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
@LogRepository
public interface CardRepository extends JpaRepository<Card, Long> {
    Card findByCardNumber(String cardNumber);

    Card findFirstByUserId(Long fromUserId);
}
