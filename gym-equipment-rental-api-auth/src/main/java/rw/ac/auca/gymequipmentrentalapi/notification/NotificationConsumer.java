package rw.ac.auca.gymequipmentrentalapi.notification;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
public class NotificationConsumer {

    private static final Logger log = LoggerFactory.getLogger(NotificationConsumer.class);

    @RabbitListener(queues = RabbitMqConfig.EMAIL_QUEUE)
    public void sendEmail(NotificationMessage message) {
        log.info("Email sent to {} <{}>: {}", message.fullName(), message.email(), message.subject());
    }

    @RabbitListener(queues = RabbitMqConfig.SMS_QUEUE)
    public void sendSms(NotificationMessage message) {
        log.info("SMS sent to {} at {}: {}", message.fullName(), message.phone(), message.body());
    }
}
