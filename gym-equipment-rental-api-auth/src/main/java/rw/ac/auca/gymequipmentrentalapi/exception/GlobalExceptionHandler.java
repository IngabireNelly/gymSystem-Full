package rw.ac.auca.gymequipmentrentalapi.exception;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Turns exceptions into JSON like {"message": "..."} so the frontend can show the text directly.
 * Validation errors also include "fieldErrors" and a joined "message".
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Object> handleNotFound(ResourceNotFoundException ex) {
        return build(HttpStatus.NOT_FOUND, ex.getMessage(), null);
    }

    @ExceptionHandler(BusinessRuleException.class)
    public ResponseEntity<Object> handleBusinessRule(BusinessRuleException ex) {
        return build(HttpStatus.BAD_REQUEST, ex.getMessage(), null);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Object> handleAccessDenied(AccessDeniedException ex) {
        return build(HttpStatus.FORBIDDEN, ex.getMessage(), null);
    }

    @ExceptionHandler(AuthException.class)
    public ResponseEntity<Object> handleAuth(AuthException ex) {
        return build(ex.getStatus(), ex.getMessage(), null);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Object> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> fieldErrors = new LinkedHashMap<>();
        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            fieldErrors.putIfAbsent(error.getField(), error.getDefaultMessage());
        }
        return build(HttpStatus.BAD_REQUEST, String.join(" ", fieldErrors.values()), fieldErrors);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Object> handleUnreadable(HttpMessageNotReadableException ex) {
        return build(HttpStatus.BAD_REQUEST, "Malformed request body.", null);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleGeneral(Exception ex) {
        return build(HttpStatus.INTERNAL_SERVER_ERROR, ex.getMessage(), null);
    }

    private ResponseEntity<Object> build(HttpStatus status, String message, Map<String, String> fieldErrors) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", status.value());
        body.put("error", status.getReasonPhrase());
        body.put("message", message);
        if (fieldErrors != null) {
            body.put("fieldErrors", fieldErrors);
        }
        return new ResponseEntity<>(body, status);
    }
}
