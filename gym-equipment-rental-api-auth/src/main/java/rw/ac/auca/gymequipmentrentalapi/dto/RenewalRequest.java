package rw.ac.auca.gymequipmentrentalapi.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import rw.ac.auca.gymequipmentrentalapi.model.MembershipType;

/** Renewal = plan + payment details. The server computes the price and new expiry. */
public record RenewalRequest(
        @NotNull(message = "Membership type is required") MembershipType membershipType,
        @NotBlank(message = "Payment method is required") String method,
        @NotBlank(message = "Payment details are required") String methodDetail) {
}
