package rw.ac.auca.gymequipmentrentalapi.dto;

import jakarta.validation.constraints.*;
import rw.ac.auca.gymequipmentrentalapi.model.MembershipType;

/** A new membership application from the public Apply page. */
public record ApplicationRequest(
        @NotBlank(message = "Full name is required") String fullName,
        @NotBlank(message = "Phone number is required")
        @Pattern(regexp = "^07[0-9]{8}$", message = "Use the format 07XXXXXXXX (10 digits).") String phone,
        @NotBlank(message = "Email is required")
        @Email(message = "Enter a valid email address") String email,
        @NotBlank(message = "Password is required") String password,
        @NotNull(message = "Membership type is required") MembershipType membershipType) {
}
