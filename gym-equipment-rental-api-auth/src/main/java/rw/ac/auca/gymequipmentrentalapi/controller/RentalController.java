package rw.ac.auca.gymequipmentrentalapi.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import rw.ac.auca.gymequipmentrentalapi.dto.RentalRequest;
import rw.ac.auca.gymequipmentrentalapi.dto.RentalResponse;
import rw.ac.auca.gymequipmentrentalapi.model.Rental;
import rw.ac.auca.gymequipmentrentalapi.security.Access;
import rw.ac.auca.gymequipmentrentalapi.service.RentalService;

import java.util.List;

/** /api/rentals — book, return, and view rentals. Ownership is enforced by the service and this controller. */
@RestController
@RequestMapping("/api/rentals")
public class RentalController {

    @Autowired private RentalService rentalService;
    @Autowired private Access access;

    @GetMapping
    public ResponseEntity<List<RentalResponse>> getAllRentals() {
        return ResponseEntity.ok(rentalService.getAllRentals().stream().map(RentalResponse::from).toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RentalResponse> getRentalById(@PathVariable Long id) {
        Rental rental = rentalService.getRentalById(id);
        access.requireStaffOrSelf(rental.getMember().getId());
        return ResponseEntity.ok(RentalResponse.from(rental));
    }

    @PostMapping
    public ResponseEntity<RentalResponse> createRental(@Valid @RequestBody RentalRequest request) {
        return new ResponseEntity<>(RentalResponse.from(rentalService.createRental(request)), HttpStatus.CREATED);
    }

    @PutMapping("/{id}/return")
    public ResponseEntity<RentalResponse> returnRental(@PathVariable Long id) {
        return ResponseEntity.ok(RentalResponse.from(rentalService.returnRental(id)));
    }

    @GetMapping("/overdue")
    public ResponseEntity<List<RentalResponse>> getOverdueRentals() {
        return ResponseEntity.ok(rentalService.getOverdueRentals().stream().map(RentalResponse::from).toList());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRental(@PathVariable Long id) {
        rentalService.deleteRental(id);
        return ResponseEntity.noContent().build();
    }
}
