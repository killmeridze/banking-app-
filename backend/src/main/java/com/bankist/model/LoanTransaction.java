package com.bankist.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;
import java.util.Date;
import java.util.List;

@Entity
@Data
@Table(name = "loan_transactions")
public class LoanTransaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "loan_id", nullable = false)
    @JsonBackReference
    private Loan loan;

    @Column(nullable = false)
    private double amount;

    @Column(nullable = false)
    private Date transactionDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionType type;

    @Override
    public String toString() {
        return String.format("LoanTransaction{id=%d, loanId=%d, amount=%.2f, transactionDate=%s, type=%s}", id, loan.getId(), amount, transactionDate, type);
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public Date getTransactionDate() {
        return transactionDate;
    }

    public void setTransactionDate(Date transactionDate) {
        this.transactionDate = transactionDate;
    }

    public TransactionType getType() {
        return type;
    }

    public void setType(TransactionType type) {
        this.type = type;
    }

    public Loan getLoan() {
        return loan;
    }

    public void setLoan(Loan loan) {
        this.loan = loan;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setLoanId(Long loanId) {
        this.loan.setId(loanId);
    }

    public Long getLoanId() {
        return loan.getId();
    }

    public void setLoanAmount(double loanAmount) {
        this.loan.setAmount(loanAmount);
    }

    public double getLoanAmount() {
        return loan.getAmount();
    }

    public void setLoanInterestRate(double loanInterestRate) {
        this.loan.setInterestRate(loanInterestRate);
    }

    public double getLoanInterestRate() {
        return loan.getInterestRate();
    }

    public void setLoanIssueDate(Date loanIssueDate) {
        this.loan.setIssueDate(loanIssueDate);
    }

    public Date getLoanIssueDate() {
        return loan.getIssueDate();
    }

    public void setLoanDueDate(Date loanDueDate) {
        this.loan.setDueDate(loanDueDate);
    }

    public Date getLoanDueDate() {
        return loan.getDueDate();
    }

    public void setLoanTransactions(List<LoanTransaction> loanTransactions) {
        this.loan.setTransactions(loanTransactions);
    }

    public List<LoanTransaction> getLoanTransactions() {
        return loan.getTransactions();
    }

    public void setLoanUser(User loanUser) {
        this.loan.setUser(loanUser);
    }

    public User getLoanUser() {
        return loan.getUser();
    }

}
