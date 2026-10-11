package rw.ac.auca.gymequipmentrentalapi.exception;

import org.springframework.http.HttpStatus;

/** Login failures: 401 for wrong credentials, 403 for pending/inactive accounts. */
public class AuthException extends RuntimeException {
    private final HttpStatus status;

    public AuthException(HttpStatus status, String message) {
        super(message);
        this.status = status;
    }

    public HttpStatus getStatus() {
        return status;
    }
}
