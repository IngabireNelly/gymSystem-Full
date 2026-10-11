package rw.ac.auca.gymequipmentrentalapi.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import rw.ac.auca.gymequipmentrentalapi.dto.EquipmentRequest;
import rw.ac.auca.gymequipmentrentalapi.model.Equipment;
import rw.ac.auca.gymequipmentrentalapi.service.EquipmentService;

import java.util.List;

/** /api/equipment — list, create, update, delete rentable equipment. */
@RestController
@RequestMapping("/api/equipment")
public class EquipmentController {

    @Autowired
    private EquipmentService equipmentService;

    @GetMapping
    public ResponseEntity<List<Equipment>> getAllEquipment() {
        return ResponseEntity.ok(equipmentService.getAllEquipment());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Equipment> getEquipmentById(@PathVariable Long id) {
        return ResponseEntity.ok(equipmentService.getEquipmentById(id));
    }

    @PostMapping
    public ResponseEntity<Equipment> createEquipment(@Valid @RequestBody EquipmentRequest request) {
        return new ResponseEntity<>(equipmentService.createEquipment(request), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Equipment> updateEquipment(@PathVariable Long id, @Valid @RequestBody EquipmentRequest request) {
        return ResponseEntity.ok(equipmentService.updateEquipment(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEquipment(@PathVariable Long id) {
        equipmentService.deleteEquipment(id);
        return ResponseEntity.noContent().build();
    }
}
