package com.bankist.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.bankist.annotations.LogRepository;
import com.bankist.model.Loan;

import java.util.List;
import java.util.Optional;

@Repository
@LogRepository
public interface LoanRepository extends JpaRepository<Loan, Long> {
    List<Loan> findByUserId(Long userId);
    List<Loan> findByUserIdAndIsActiveTrue(Long userId);
    Optional<Loan> findByIdAndUserId(Long id, Long userId);
    boolean existsByUserIdAndIsActiveTrue(Long userId);
}