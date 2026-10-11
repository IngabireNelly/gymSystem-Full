package rw.ac.auca.gymequipmentrentalapi.exception;

/** A request broke a business rule (e.g. renting equipment that is already rented). Returns 400. */
public class BusinessRuleException extends RuntimeException {
    public BusinessRuleException(String message) {
        super(message);
    }
}
