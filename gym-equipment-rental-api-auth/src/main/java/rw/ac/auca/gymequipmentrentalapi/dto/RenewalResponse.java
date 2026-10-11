package rw.ac.auca.gymequipmentrentalapi.dto;

import rw.ac.auca.gymequipmentrentalapi.model.Payment;

import java.time.LocalDate;

public record RenewalResponse(LocalDate expiry, Payment payment) {
}
