package rw.ac.auca.gymequipmentrentalapi.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

/** Book equipment for a member until dueDate. */
public record RentalRequest(
        @NotNull(message = "equipmentId is required") Long equipmentId,
        @NotNull(message = "clientId is required") Long clientId,
        @NotNull(message = "dueDate is required")
        @Future(message = "dueDate must be a date in the future") LocalDate dueDate) {
}
