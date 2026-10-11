package rw.ac.auca.gymequipmentrentalapi.model;

import jakarta.persistence.*;

import java.time.LocalDate;

/** A rental linking one Equipment to one Member for a period. */
@Entity
@Table(name = "rental")
public class Rental {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "equipment_id", nullable = false)
    private Equipment equipment;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @Column(nullable = false)
    private LocalDate startDate;

    @Column(nullable = false)
    private LocalDate dueDate;

    private LocalDate returnedDate;

    @Column(nullable = false)
    private Integer days;

    /** Daily rate captured at rental time, so later price changes don't alter old rentals. */
    @Column(nullable = false)
    private Double dailyRate;

    @Column(nullable = false)
    private Double totalCost;

    private Double lateFee = 0.0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RentalStatus status = RentalStatus.ACTIVE;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Equipment getEquipment() { return equipment; }
    public void setEquipment(Equipment equipment) { this.equipment = equipment; }
    public Member getMember() { return member; }
    public void setMember(Member member) { this.member = member; }
    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }
    public LocalDate getReturnedDate() { return returnedDate; }
    public void setReturnedDate(LocalDate returnedDate) { this.returnedDate = returnedDate; }
    public Integer getDays() { return days; }
    public void setDays(Integer days) { this.days = days; }
    public Double getDailyRate() { return dailyRate; }
    public void setDailyRate(Double dailyRate) { this.dailyRate = dailyRate; }
    public Double getTotalCost() { return totalCost; }
    public void setTotalCost(Double totalCost) { this.totalCost = totalCost; }
    public Double getLateFee() { return lateFee; }
    public void setLateFee(Double lateFee) { this.lateFee = lateFee; }
    public RentalStatus getStatus() { return status; }
    public void setStatus(RentalStatus status) { this.status = status; }
}
