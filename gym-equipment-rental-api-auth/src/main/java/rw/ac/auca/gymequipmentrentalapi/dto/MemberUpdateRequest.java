package rw.ac.auca.gymequipmentrentalapi.dto;

import jakarta.validation.constraints.*;
import rw.ac.auca.gymequipmentrentalapi.model.MembershipType;

public record MemberUpdateRequest(
        @NotBlank(message = "Full name is required") String fullName,
        @NotBlank(message = "Phone number is required")
        @Pattern(regexp = "^07[0-9]{8}$", message = "Use the format 07XXXXXXXX (10 digits).") String phone,
        @NotNull(message = "Membership type is required") MembershipType membershipType) {
}
