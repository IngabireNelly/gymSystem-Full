package rw.ac.auca.gymequipmentrentalapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import rw.ac.auca.gymequipmentrentalapi.model.Rental;
import rw.ac.auca.gymequipmentrentalapi.model.RentalStatus;

import java.time.LocalDate;
import java.util.List;

public interface RentalRepository extends JpaRepository<Rental, Long> {

    List<Rental> findByStatusAndDueDateBefore(RentalStatus status, LocalDate date);

    List<Rental> findByMemberId(Long memberId);
}
