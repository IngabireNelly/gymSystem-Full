package rw.ac.auca.gymequipmentrentalapi.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import rw.ac.auca.gymequipmentrentalapi.model.Payment;
import rw.ac.auca.gymequipmentrentalapi.service.PaymentService;

import java.util.List;

/** /api/payments — membership payment history. */
@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @GetMapping
    public ResponseEntity<List<Payment>> getAllPayments() {
        return ResponseEntity.ok(paymentService.getAllPayments());
    }
}
