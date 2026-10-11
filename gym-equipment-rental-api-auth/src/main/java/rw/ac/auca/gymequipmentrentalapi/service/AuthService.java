package rw.ac.auca.gymequipmentrentalapi.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import rw.ac.auca.gymequipmentrentalapi.dto.LoginRequest;
import rw.ac.auca.gymequipmentrentalapi.dto.LoginResponse;
import rw.ac.auca.gymequipmentrentalapi.dto.MeResponse;
import rw.ac.auca.gymequipmentrentalapi.exception.AuthException;
import rw.ac.auca.gymequipmentrentalapi.exception.ResourceNotFoundException;
import rw.ac.auca.gymequipmentrentalapi.model.ClientStatus;
import rw.ac.auca.gymequipmentrentalapi.model.Member;
import rw.ac.auca.gymequipmentrentalapi.model.StaffAccount;
import rw.ac.auca.gymequipmentrentalapi.repository.MemberRepository;
import rw.ac.auca.gymequipmentrentalapi.repository.StaffAccountRepository;
import rw.ac.auca.gymequipmentrentalapi.security.AuthUser;
import rw.ac.auca.gymequipmentrentalapi.security.JwtService;

import java.util.Optional;

/** Login for staff and members. Issues a JWT on success. */
@Service
public class AuthService {

    private static final String INVALID = "Incorrect username/email or password.";

    @Autowired private StaffAccountRepository staffAccountRepository;
    @Autowired private MemberRepository memberRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JwtService jwtService;

    public LoginResponse login(LoginRequest request) {
        String id = request.identifier().trim().toLowerCase();

        Optional<StaffAccount> staff = staffAccountRepository.findByUsernameIgnoreCase(id)
                .or(() -> staffAccountRepository.findByEmailIgnoreCase(id));
        if (staff.isPresent()) {
            StaffAccount s = staff.get();
            if (!passwordEncoder.matches(request.password(), s.getPassword())) {
                throw new AuthException(HttpStatus.UNAUTHORIZED, INVALID);
            }
            return loginResponse("STAFF", s.getId(), s.getFullName(), s.getEmail());
        }

        Member m = memberRepository.findFirstByUsernameIgnoreCaseAndStatusNot(id, ClientStatus.REJECTED)
                .or(() -> memberRepository.findFirstByEmailIgnoreCaseAndStatusNot(id, ClientStatus.REJECTED))
                .orElseThrow(() -> new AuthException(HttpStatus.UNAUTHORIZED, INVALID));

        if (!passwordEncoder.matches(request.password(), m.getPassword())) {
            throw new AuthException(HttpStatus.UNAUTHORIZED, INVALID);
        }
        if (m.getStatus() == ClientStatus.PENDING) {
            throw new AuthException(HttpStatus.FORBIDDEN,
                    "Your membership application is still pending staff approval. You'll be able to log in once it's approved.");
        }
        if (m.getStatus() == ClientStatus.INACTIVE) {
            throw new AuthException(HttpStatus.FORBIDDEN,
                    "This membership is inactive. Please contact staff to reactivate it.");
        }
        return loginResponse("CLIENT", m.getId(), m.getFullName(), m.getEmail());
    }

    /** Details for the user behind a valid token (used to restore a session on page load). */
    public MeResponse currentUser(AuthUser user) {
        if ("STAFF".equals(user.role())) {
            StaffAccount s = staffAccountRepository.findById(user.id())
                    .orElseThrow(() -> new ResourceNotFoundException("Staff account not found"));
            return new MeResponse("STAFF", String.valueOf(s.getId()), s.getFullName(), s.getEmail());
        }
        Member m = memberRepository.findById(user.id())
                .orElseThrow(() -> new ResourceNotFoundException("Member not found"));
        return new MeResponse("CLIENT", String.valueOf(m.getId()), m.getFullName(), m.getEmail());
    }

    private LoginResponse loginResponse(String role, Long id, String name, String email) {
        return new LoginResponse(jwtService.issue(id, role), role, String.valueOf(id), name, email);
    }
}
