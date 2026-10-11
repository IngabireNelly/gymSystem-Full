package rw.ac.auca.gymequipmentrentalapi.security;

/** The logged-in user, taken from a verified JWT. role is "STAFF" or "CLIENT". */
public record AuthUser(Long id, String role) {
}
