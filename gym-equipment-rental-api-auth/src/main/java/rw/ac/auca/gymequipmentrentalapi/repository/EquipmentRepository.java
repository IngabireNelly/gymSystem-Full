package rw.ac.auca.gymequipmentrentalapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import rw.ac.auca.gymequipmentrentalapi.model.Equipment;

public interface EquipmentRepository extends JpaRepository<Equipment, Long> {
}
