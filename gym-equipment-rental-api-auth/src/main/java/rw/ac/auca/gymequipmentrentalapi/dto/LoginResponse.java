package rw.ac.auca.gymequipmentrentalapi.dto;

/** Returned by login. token is sent as "Authorization: Bearer ..." on later requests. */
public record LoginResponse(String token, String role, String userId, String name, String email) {
}
