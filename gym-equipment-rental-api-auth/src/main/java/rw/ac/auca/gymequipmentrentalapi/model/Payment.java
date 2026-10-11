package rw.ac.auca.gymequipmentrentalapi.model;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import jakarta.persistence.*;

import java.time.LocalDate;

/** A membership payment, created when a member renews. */
@Entity
@Table(name = "payment")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonSerialize(using = ToStringSerializer.class)
    private Long id;

    @JsonSerialize(using = ToStringSerializer.class)
    @Column(nullable = false)
    private Long clientId;

    @Column(name = "payment_date", nullable = false)
    private LocalDate date;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private Double amount;

    @Column(nullable = false)
    private String method;

    private String methodDetail;

    @Column(nullable = false)
    private String status = "Paid";

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getClientId() { return clientId; }
    public void setClientId(Long clientId) { this.clientId = clientId; }
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }
    public String getMethod() { return method; }
    public void setMethod(String method) { this.method = method; }
    public String getMethodDetail() { return methodDetail; }
    public void setMethodDetail(String methodDetail) { this.methodDetail = methodDetail; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
