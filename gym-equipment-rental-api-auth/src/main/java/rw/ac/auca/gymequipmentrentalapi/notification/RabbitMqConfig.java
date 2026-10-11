package rw.ac.auca.gymequipmentrentalapi.notification;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.annotation.EnableRabbit;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableRabbit
public class RabbitMqConfig {

    public static final String NOTIFICATION_EXCHANGE = "gym.notifications.exchange";
    public static final String EMAIL_QUEUE = "gym.notifications.email";
    public static final String SMS_QUEUE = "gym.notifications.sms";
    public static final String EMAIL_ROUTING_KEY = "notification.email";
    public static final String SMS_ROUTING_KEY = "notification.sms";

    @Bean
    public DirectExchange notificationExchange() {
        return new DirectExchange(NOTIFICATION_EXCHANGE, true, false);
    }

    @Bean
    public Queue emailQueue() {
        return new Queue(EMAIL_QUEUE, true);
    }

    @Bean
    public Queue smsQueue() {
        return new Queue(SMS_QUEUE, true);
    }

    @Bean
    public Binding emailBinding(Queue emailQueue, DirectExchange notificationExchange) {
        return BindingBuilder.bind(emailQueue).to(notificationExchange).with(EMAIL_ROUTING_KEY);
    }

    @Bean
    public Binding smsBinding(Queue smsQueue, DirectExchange notificationExchange) {
        return BindingBuilder.bind(smsQueue).to(notificationExchange).with(SMS_ROUTING_KEY);
    }

    @Bean
    public MessageConverter messageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory, MessageConverter messageConverter) {
        RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setMessageConverter(messageConverter);
        return rabbitTemplate;
    }
}
