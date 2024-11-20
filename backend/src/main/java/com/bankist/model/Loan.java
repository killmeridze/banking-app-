package com.bankist.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Entity
@Data
@Table(name = "loans")
public class Loan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonBackReference
    private User user;

    @Column(nullable = false)
    private double amount;

    @Column(nullable = false)
    private double interestRate;

    @Column(nullable = false)
    private Date issueDate;

    @Column(nullable = false)
    private Date dueDate;

    @OneToMany(mappedBy = "loan", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<LoanTransaction> transactions;

    @Override
    public String toString() {
        return String.format("Loan{id=%d, amount=%.2f, interestRate=%.2f%%, issueDate=%s, dueDate=%s}", id, amount, interestRate, issueDate, dueDate);
    }
}
