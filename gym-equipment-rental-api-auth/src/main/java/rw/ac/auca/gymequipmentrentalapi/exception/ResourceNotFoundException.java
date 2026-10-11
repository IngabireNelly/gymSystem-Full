package rw.ac.auca.gymequipmentrentalapi.exception;

/** A requested equipment, member, or rental does not exist. Returns 404. */
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
