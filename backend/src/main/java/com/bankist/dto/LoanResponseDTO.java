package com.bankist.dto;

import com.bankist.model.Loan;

import java.util.Date;

public class LoanResponseDTO {
    private Long id;
    private double amount;
    private double interestRate;
    private Date issueDate;
    private Date dueDate;
    private boolean isActive;
    private Long userId;
    public Long cardId;
    
    public static LoanResponseDTO fromLoan(Loan loan) {
        LoanResponseDTO dto = new LoanResponseDTO();
        dto.setId(loan.getId());
        dto.setAmount(loan.getAmount());
        dto.setInterestRate(loan.getInterestRate());
        dto.setIssueDate(loan.getIssueDate());
        dto.setDueDate(loan.getDueDate());
        dto.setActive(loan.isActive());
        dto.setUserId(loan.getUser().getId());
        dto.setCardId(loan.getCard().getId());
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public double getInterestRate() {
        return interestRate;
    }

    public void setInterestRate(double interestRate) {
        this.interestRate = interestRate;
    }

    public Date getIssueDate() {
        return issueDate;
    }

    public void setIssueDate(Date issueDate) {
        this.issueDate = issueDate;
    }

    public Date getDueDate() {
        return dueDate;
    }

    public void setDueDate(Date dueDate) {
        this.dueDate = dueDate;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getCardId() {

        return cardId;
    }

    public void setCardId(Long cardId) {
        this.cardId = cardId;
    }
}