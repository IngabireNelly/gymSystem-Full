package rw.ac.auca.gymequipmentrentalapi.dto;

import rw.ac.auca.gymequipmentrentalapi.model.Rental;

import java.time.LocalDate;

/** Flat rental shape the frontend expects (ids as strings, no nested member or equipment). */
public record RentalResponse(
        String id,
        String equipmentId,
        String clientId,
        LocalDate startDate,
        LocalDate dueDate,
        LocalDate returnedDate,
        int days,
        Double dailyRate,
        Double totalCost,
        Double lateFee,
        String status) {

    public static RentalResponse from(Rental r) {
        return new RentalResponse(
                String.valueOf(r.getId()),
                String.valueOf(r.getEquipment().getId()),
                String.valueOf(r.getMember().getId()),
                r.getStartDate(),
                r.getDueDate(),
                r.getReturnedDate(),
                r.getDays(),
                r.getDailyRate(),
                r.getTotalCost(),
                r.getLateFee(),
                r.getStatus().name());
    }
}
