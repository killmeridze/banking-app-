package com.bankist.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.bankist.annotations.LogRepository;
import com.bankist.model.LoanTransaction;

@Repository
@LogRepository
public interface LoanTransactionRepository extends JpaRepository<LoanTransaction, Long> {
}