package rw.ac.auca.gymequipmentrentalapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import rw.ac.auca.gymequipmentrentalapi.model.StaffAccount;

import java.util.Optional;

public interface StaffAccountRepository extends JpaRepository<StaffAccount, Long> {

    Optional<StaffAccount> findByUsernameIgnoreCase(String username);

    Optional<StaffAccount> findByEmailIgnoreCase(String email);
}
