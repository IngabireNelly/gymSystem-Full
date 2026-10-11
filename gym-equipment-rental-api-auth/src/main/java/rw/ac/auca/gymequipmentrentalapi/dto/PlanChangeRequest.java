package rw.ac.auca.gymequipmentrentalapi.dto;

import jakarta.validation.constraints.NotNull;
import rw.ac.auca.gymequipmentrentalapi.model.MembershipType;

public record PlanChangeRequest(@NotNull(message = "Membership type is required") MembershipType membershipType) {
}
