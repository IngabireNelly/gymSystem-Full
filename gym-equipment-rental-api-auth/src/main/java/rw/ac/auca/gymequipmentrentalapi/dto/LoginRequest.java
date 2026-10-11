package rw.ac.auca.gymequipmentrentalapi.dto;

import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @NotBlank(message = "Enter your username or email.") String identifier,
        @NotBlank(message = "Enter your password.") String password) {
}
