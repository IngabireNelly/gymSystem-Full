package rw.ac.auca.gymequipmentrentalapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import rw.ac.auca.gymequipmentrentalapi.model.ClientStatus;
import rw.ac.auca.gymequipmentrentalapi.model.Member;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {

    Optional<Member> findFirstByUsernameIgnoreCaseAndStatusNot(String username, ClientStatus status);

    Optional<Member> findFirstByEmailIgnoreCaseAndStatusNot(String email, ClientStatus status);

    boolean existsByEmailIgnoreCaseAndStatusNot(String email, ClientStatus status);

    boolean existsByPhoneAndStatusNot(String phone, ClientStatus status);
}
