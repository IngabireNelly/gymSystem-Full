package rw.ac.auca.gymequipmentrentalapi.notification;

import java.time.Instant;

public record NotificationMessage(
        String type,
        Long memberId,
        String fullName,
        String email,
        String phone,
        String subject,
        String body,
        Instant occurredAt) {
}
