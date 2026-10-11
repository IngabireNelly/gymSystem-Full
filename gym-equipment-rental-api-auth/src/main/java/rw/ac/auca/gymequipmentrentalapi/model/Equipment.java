package rw.ac.auca.gymequipmentrentalapi.model;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import jakarta.persistence.*;

import java.time.LocalDate;

/** A rentable piece of gym equipment. */
@Entity
@Table(name = "equipment")
public class Equipment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonSerialize(using = ToStringSerializer.class)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private Double dailyRate;

    @Column(nullable = false)
    private LocalDate purchaseDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EquipmentStatus status = EquipmentStatus.AVAILABLE;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public Double getDailyRate() { return dailyRate; }
    public void setDailyRate(Double dailyRate) { this.dailyRate = dailyRate; }
    public LocalDate getPurchaseDate() { return purchaseDate; }
    public void setPurchaseDate(LocalDate purchaseDate) { this.purchaseDate = purchaseDate; }
    public EquipmentStatus getStatus() { return status; }
    public void setStatus(EquipmentStatus status) { this.status = status; }
}
