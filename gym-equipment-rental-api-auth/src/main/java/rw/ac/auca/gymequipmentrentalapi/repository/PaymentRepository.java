package rw.ac.auca.gymequipmentrentalapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import rw.ac.auca.gymequipmentrentalapi.model.Payment;

import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    List<Payment> findByClientId(Long clientId);
}
