package rw.ac.auca.gymequipmentrentalapi.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import rw.ac.auca.gymequipmentrentalapi.dto.EquipmentRequest;
import rw.ac.auca.gymequipmentrentalapi.exception.BusinessRuleException;
import rw.ac.auca.gymequipmentrentalapi.exception.ResourceNotFoundException;
import rw.ac.auca.gymequipmentrentalapi.model.Equipment;
import rw.ac.auca.gymequipmentrentalapi.model.EquipmentStatus;
import rw.ac.auca.gymequipmentrentalapi.repository.EquipmentRepository;

import java.util.List;

@Service
public class EquipmentService {

    @Autowired
    private EquipmentRepository equipmentRepository;

    public Equipment createEquipment(EquipmentRequest request) {
        Equipment equipment = new Equipment();
        applyFields(equipment, request);
        equipment.setStatus(EquipmentStatus.AVAILABLE);
        return equipmentRepository.save(equipment);
    }

    public List<Equipment> getAllEquipment() {
        return equipmentRepository.findAll();
    }

    public Equipment getEquipmentById(Long id) {
        return equipmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Equipment not found with id: " + id));
    }

    public Equipment updateEquipment(Long id, EquipmentRequest request) {
        Equipment existing = getEquipmentById(id);
        applyFields(existing, request);
        // Status is changed by the rental workflow; staff may only set it directly when the item isn't rented out.
        if (request.status() != null && request.status() != existing.getStatus()) {
            if (existing.getStatus() == EquipmentStatus.RENTED) {
                throw new BusinessRuleException("'" + existing.getName()
                        + "' is currently rented out; its status changes when it is returned");
            }
            existing.setStatus(request.status());
        }
        return equipmentRepository.save(existing);
    }

    // Business rule: equipment currently rented out cannot be deleted
    public void deleteEquipment(Long id) {
        Equipment equipment = getEquipmentById(id);
        if (equipment.getStatus() == EquipmentStatus.RENTED) {
            throw new BusinessRuleException(
                    "Cannot delete equipment '" + equipment.getName() + "' while it is currently rented out");
        }
        equipmentRepository.delete(equipment);
    }

    private void applyFields(Equipment equipment, EquipmentRequest request) {
        equipment.setName(request.name().trim());
        equipment.setCategory(request.category());
        equipment.setDailyRate(request.dailyRate());
        equipment.setPurchaseDate(request.purchaseDate());
    }
}
