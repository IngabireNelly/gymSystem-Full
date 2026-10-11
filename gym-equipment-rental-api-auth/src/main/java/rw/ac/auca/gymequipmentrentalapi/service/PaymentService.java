package rw.ac.auca.gymequipmentrentalapi.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import rw.ac.auca.gymequipmentrentalapi.model.Payment;
import rw.ac.auca.gymequipmentrentalapi.repository.PaymentRepository;

import java.util.List;

@Service
public class PaymentService {

    @Autowired private PaymentRepository paymentRepository;

    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    public List<Payment> getPaymentsForClient(Long clientId) {
        return paymentRepository.findByClientId(clientId);
    }
}
