package rw.ac.auca.gymequipmentrentalapi.notification;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.AmqpException;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;
import rw.ac.auca.gymequipmentrentalapi.model.Member;

import java.time.Instant;

@Service
public class NotificationPublisher {

    private static final Logger log = LoggerFactory.getLogger(NotificationPublisher.class);

    private final RabbitTemplate rabbitTemplate;

    public NotificationPublisher(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void publishMembershipNotification(Member member, String type, String subject, String body) {
        NotificationMessage message = new NotificationMessage(
                type,
                member.getId(),
                member.getFullName(),
                member.getEmail(),
                member.getPhone(),
                subject,
                body,
                Instant.now());

        publish(RabbitMqConfig.EMAIL_ROUTING_KEY, message);
        publish(RabbitMqConfig.SMS_ROUTING_KEY, message);
    }

    private void publish(String routingKey, NotificationMessage message) {
        try {
            rabbitTemplate.convertAndSend(RabbitMqConfig.NOTIFICATION_EXCHANGE, routingKey, message);
        } catch (AmqpException e) {
            log.warn("Could not publish {} notification for member {}. Is RabbitMQ running?",
                    routingKey, message.memberId(), e);
        }
    }
}
