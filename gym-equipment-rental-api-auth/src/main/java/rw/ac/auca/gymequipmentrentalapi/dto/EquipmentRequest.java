package rw.ac.auca.gymequipmentrentalapi.dto;

import jakarta.validation.constraints.*;
import rw.ac.auca.gymequipmentrentalapi.model.EquipmentStatus;

import java.time.LocalDate;

/** Create/update payload for equipment. status is optional and only used when changing it. */
public record EquipmentRequest(
        @NotBlank(message = "Equipment name is required") String name,
        @NotBlank(message = "Category is required") String category,
        @NotNull(message = "Daily rental rate is required")
        @Positive(message = "Daily rental rate must be greater than zero") Double dailyRate,
        @NotNull(message = "Purchase date is required")
        @PastOrPresent(message = "Purchase date cannot be in the future") LocalDate purchaseDate,
        EquipmentStatus status) {
}
