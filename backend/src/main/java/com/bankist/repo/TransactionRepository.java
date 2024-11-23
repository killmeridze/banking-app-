package com.bankist.repo;

import com.bankist.model.TransactionType;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.bankist.annotations.LogRepository;
import com.bankist.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

@Repository
@LogRepository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByUserId(Long userId);
    List<Transaction> findByLoanId(Long loanId);
    List<Transaction> findByUserIdAndTransactionType(Long userId, TransactionType transactionType);

    @Query("SELECT t FROM Transaction t WHERE t.loan.id = :loanId AND t.transactionType IN (com.bankist.model.TransactionType.LOAN_ISSUE, com.bankist.model.TransactionType.LOAN_REPAYMENT)")
    List<Transaction> findLoanTransactions(@Param("loanId") Long loanId);

    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.user.id = :userId AND t.transactionType = :transactionType")
    Double sumAmountByUserIdAndType(@Param("userId") Long userId, @Param("transactionType") TransactionType transactionType);
}
