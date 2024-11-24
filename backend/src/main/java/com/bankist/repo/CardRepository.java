package com.bankist.repo;

import com.bankist.annotations.LogRepository;
import com.bankist.model.Card;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

@Repository
@LogRepository
public interface CardRepository extends JpaRepository<Card, Long> {
    Card findByCardNumber(String cardNumber);
    
    Card findByCardNumberAndUserId(String cardNumber, Long userId);

    @Query(value = "SELECT c FROM Card c WHERE c.user.id = :userId ORDER BY c.id ASC LIMIT 1", 
           nativeQuery = false)
    Card findFirstByUserId(@Param("userId") Long userId);

    @Query("SELECT c FROM Card c WHERE c.user.id = :userId ORDER BY c.id ASC")
    List<Card> findAllByUserIdOrderById(@Param("userId") Long userId);
}
