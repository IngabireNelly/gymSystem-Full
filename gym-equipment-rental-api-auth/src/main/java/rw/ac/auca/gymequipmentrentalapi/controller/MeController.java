package rw.ac.auca.gymequipmentrentalapi.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import rw.ac.auca.gymequipmentrentalapi.dto.RentalResponse;
import rw.ac.auca.gymequipmentrentalapi.model.Member;
import rw.ac.auca.gymequipmentrentalapi.model.Payment;
import rw.ac.auca.gymequipmentrentalapi.security.Access;
import rw.ac.auca.gymequipmentrentalapi.service.MemberService;
import rw.ac.auca.gymequipmentrentalapi.service.PaymentService;
import rw.ac.auca.gymequipmentrentalapi.service.RentalService;

import java.util.List;

/** /api/me — a member's own profile, rentals, and payments. Staff get 403 here. */
@RestController
@RequestMapping("/api/me")
public class MeController {

    @Autowired private Access access;
    @Autowired private MemberService memberService;
    @Autowired private RentalService rentalService;
    @Autowired private PaymentService paymentService;

    @GetMapping
    public ResponseEntity<Member> me() {
        access.requireClient();
        return ResponseEntity.ok(memberService.getMemberById(access.current().id()));
    }

    @GetMapping("/rentals")
    public ResponseEntity<List<RentalResponse>> myRentals() {
        access.requireClient();
        return ResponseEntity.ok(rentalService.getRentalsForMember(access.current().id())
                .stream().map(RentalResponse::from).toList());
    }

    @GetMapping("/payments")
    public ResponseEntity<List<Payment>> myPayments() {
        access.requireClient();
        return ResponseEntity.ok(paymentService.getPaymentsForClient(access.current().id()));
    }
}
