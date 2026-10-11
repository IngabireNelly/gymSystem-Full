package rw.ac.auca.gymequipmentrentalapi.dto;

import jakarta.validation.constraints.NotNull;

public record StatusRequest(@NotNull(message = "active is required") Boolean active) {
}
