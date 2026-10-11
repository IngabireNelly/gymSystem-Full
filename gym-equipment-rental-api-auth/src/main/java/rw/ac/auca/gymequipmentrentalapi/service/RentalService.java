package rw.ac.auca.gymequipmentrentalapi.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import rw.ac.auca.gymequipmentrentalapi.dto.RentalRequest;
import rw.ac.auca.gymequipmentrentalapi.exception.BusinessRuleException;
import rw.ac.auca.gymequipmentrentalapi.exception.ResourceNotFoundException;
import rw.ac.auca.gymequipmentrentalapi.model.*;
import rw.ac.auca.gymequipmentrentalapi.repository.EquipmentRepository;
import rw.ac.auca.gymequipmentrentalapi.repository.MemberRepository;
import rw.ac.auca.gymequipmentrentalapi.repository.RentalRepository;
import rw.ac.auca.gymequipmentrentalapi.security.Access;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

/**
 * Core rental rules:
 * - Equipment must be AVAILABLE; renting sets it to RENTED, returning sets it back to AVAILABLE.
 * - Only an ACTIVE member can rent.
 * - dueDate must be after today; cost = days x daily rate.
 * - A late return adds a fee of 1.5x the daily rate per late day.
 */
@Service
public class RentalService {

    private static final double LATE_FEE_MULTIPLIER = 1.5;

    @Autowired private RentalRepository rentalRepository;
    @Autowired private EquipmentRepository equipmentRepository;
    @Autowired private MemberRepository memberRepository;
    @Autowired private Access access;

    public Rental createRental(RentalRequest request) {
        // A member may only book for themselves; staff may book for anyone
        if (!access.isStaff()) {
            access.requireStaffOrSelf(request.clientId());
        }
        Equipment equipment = equipmentRepository.findById(request.equipmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Equipment not found with id: " + request.equipmentId()));
        Member member = memberRepository.findById(request.clientId())
                .orElseThrow(() -> new ResourceNotFoundException("Member not found with id: " + request.clientId()));

        if (equipment.getStatus() != EquipmentStatus.AVAILABLE) {
            throw new BusinessRuleException("'" + equipment.getName() + "' is not available for rental (current status: "
                    + equipment.getStatus().getLabel() + ")");
        }
        if (member.getStatus() != ClientStatus.ACTIVE) {
            throw new BusinessRuleException("Only active members can rent equipment");
        }

        LocalDate today = LocalDate.now();
        if (!request.dueDate().isAfter(today)) {
            throw new BusinessRuleException("dueDate must be after today's date");
        }

        int days = (int) ChronoUnit.DAYS.between(today, request.dueDate());
        double dailyRate = equipment.getDailyRate();

        Rental rental = new Rental();
        rental.setEquipment(equipment);
        rental.setMember(member);
        rental.setStartDate(today);
        rental.setDueDate(request.dueDate());
        rental.setDays(days);
        rental.setDailyRate(dailyRate);
        rental.setTotalCost(days * dailyRate);
        rental.setStatus(RentalStatus.ACTIVE);

        equipment.setStatus(EquipmentStatus.RENTED);
        equipmentRepository.save(equipment);

        return rentalRepository.save(rental);
    }

    public Rental returnRental(Long rentalId) {
        Rental rental = getRentalById(rentalId);
        access.requireStaffOrSelf(rental.getMember().getId());
        if (rental.getStatus() == RentalStatus.RETURNED) {
            throw new BusinessRuleException("This rental has already been marked as returned");
        }

        LocalDate today = LocalDate.now();
        rental.setReturnedDate(today);

        if (today.isAfter(rental.getDueDate())) {
            long lateDays = ChronoUnit.DAYS.between(rental.getDueDate(), today);
            rental.setLateFee(lateDays * rental.getDailyRate() * LATE_FEE_MULTIPLIER);
        }
        rental.setStatus(RentalStatus.RETURNED);

        Equipment equipment = rental.getEquipment();
        if (equipment.getStatus() == EquipmentStatus.RENTED) {
            equipment.setStatus(EquipmentStatus.AVAILABLE);
            equipmentRepository.save(equipment);
        }
        return rentalRepository.save(rental);
    }

    public List<Rental> getRentalsForMember(Long memberId) {
        return rentalRepository.findByMemberId(memberId);
    }

    public List<Rental> getAllRentals() {
        return rentalRepository.findAll();
    }

    public Rental getRentalById(Long id) {
        return rentalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Rental not found with id: " + id));
    }

    // Business report: rentals past their due date that haven't been returned yet
    public List<Rental> getOverdueRentals() {
        List<Rental> overdue = rentalRepository.findByStatusAndDueDateBefore(RentalStatus.ACTIVE, LocalDate.now());
        overdue.forEach(r -> r.setStatus(RentalStatus.OVERDUE));
        return rentalRepository.saveAll(overdue);
    }

    public void deleteRental(Long id) {
        Rental rental = getRentalById(id);
        if (rental.getStatus() == RentalStatus.ACTIVE || rental.getStatus() == RentalStatus.OVERDUE) {
            throw new BusinessRuleException("Cannot delete a rental that is still active; return it first");
        }
        rentalRepository.delete(rental);
    }
}
