package rw.ac.auca.gymequipmentrentalapi.dto;

/** The logged-in user, for restoring a session from a stored token. */
public record MeResponse(String role, String userId, String name, String email) {
}
