package rw.ac.auca.gymequipmentrentalapi.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import rw.ac.auca.gymequipmentrentalapi.dto.ApplicationRequest;
import rw.ac.auca.gymequipmentrentalapi.dto.MemberUpdateRequest;
import rw.ac.auca.gymequipmentrentalapi.dto.RenewalRequest;
import rw.ac.auca.gymequipmentrentalapi.dto.RenewalResponse;
import rw.ac.auca.gymequipmentrentalapi.exception.BusinessRuleException;
import rw.ac.auca.gymequipmentrentalapi.exception.ResourceNotFoundException;
import rw.ac.auca.gymequipmentrentalapi.model.*;
import rw.ac.auca.gymequipmentrentalapi.notification.NotificationPublisher;
import rw.ac.auca.gymequipmentrentalapi.repository.*;

import java.time.LocalDate;
import java.util.List;

/** Members (the frontend's "clients"): applications, approvals, plans, renewals. */
@Service
public class MemberService {

    @Autowired private MemberRepository memberRepository;
    @Autowired private RentalRepository rentalRepository;
    @Autowired private PaymentRepository paymentRepository;
    @Autowired private StaffAccountRepository staffAccountRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private NotificationPublisher notificationPublisher;

    public Member applyForMembership(ApplicationRequest request) {
        String email = request.email().trim().toLowerCase();
        if (memberRepository.existsByEmailIgnoreCaseAndStatusNot(email, ClientStatus.REJECTED)
                || staffAccountRepository.findByEmailIgnoreCase(email).isPresent()) {
            throw new BusinessRuleException("An account with this email already exists.");
        }
        if (memberRepository.existsByPhoneAndStatusNot(request.phone(), ClientStatus.REJECTED)) {
            throw new BusinessRuleException("An account with this phone number already exists.");
        }

        Member member = new Member();
        member.setFullName(request.fullName().trim());
        member.setPhone(request.phone());
        member.setEmail(email);
        member.setUsername(email);
        member.setPassword(passwordEncoder.encode(request.password()));
        member.setMembershipType(request.membershipType());
        member.setAppliedDate(LocalDate.now());
        member.setStatus(ClientStatus.PENDING);
        Member saved = memberRepository.save(member);
        notify(saved, "MEMBERSHIP_APPLICATION_SUBMITTED", "Membership application received",
                "Hi " + saved.getFullName() + ", your membership application was received and is pending staff approval.");
        return saved;
    }

    public List<Member> getAllMembers() {
        return memberRepository.findAll();
    }

    public Member getMemberById(Long id) {
        return memberRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found with id: " + id));
    }

    public Member updateMember(Long id, MemberUpdateRequest request) {
        Member member = getMemberById(id);
        String phone = request.phone();
        if (!phone.equals(member.getPhone())
                && memberRepository.existsByPhoneAndStatusNot(phone, ClientStatus.REJECTED)) {
            throw new BusinessRuleException("An account with this phone number already exists.");
        }
        member.setFullName(request.fullName().trim());
        member.setPhone(phone);
        member.setMembershipType(request.membershipType());
        Member saved = memberRepository.save(member);
        notify(saved, "MEMBERSHIP_PROFILE_UPDATED", "Membership profile updated",
                "Hi " + saved.getFullName() + ", your membership profile was updated.");
        return saved;
    }

    /** Staff approval: the member can log in and the first membership period starts today. */
    public Member approve(Long id) {
        Member member = getMemberById(id);
        LocalDate today = LocalDate.now();
        member.setStatus(ClientStatus.ACTIVE);
        member.setJoinDate(today);
        member.setMembershipExpiry(today.plusMonths(member.getMembershipType().getMonths()));
        Member saved = memberRepository.save(member);
        notify(saved, "MEMBERSHIP_APPROVED", "Membership approved",
                "Hi " + saved.getFullName() + ", your membership is active until " + saved.getMembershipExpiry() + ".");
        return saved;
    }

    public Member reject(Long id) {
        Member member = getMemberById(id);
        member.setStatus(ClientStatus.REJECTED);
        Member saved = memberRepository.save(member);
        notify(saved, "MEMBERSHIP_REJECTED", "Membership application update",
                "Hi " + saved.getFullName() + ", your membership application was reviewed and rejected.");
        return saved;
    }

    public Member setActive(Long id, boolean active) {
        Member member = getMemberById(id);
        if (member.getStatus() == ClientStatus.PENDING || member.getStatus() == ClientStatus.REJECTED) {
            throw new BusinessRuleException("Approve the application before changing the membership status");
        }
        member.setStatus(active ? ClientStatus.ACTIVE : ClientStatus.INACTIVE);
        Member saved = memberRepository.save(member);
        notify(saved, "MEMBERSHIP_STATUS_UPDATED", "Membership status updated",
                "Hi " + saved.getFullName() + ", your membership status is now " + saved.getStatus() + ".");
        return saved;
    }

    public Member changePlan(Long id, MembershipType type) {
        Member member = getMemberById(id);
        member.setMembershipType(type);
        Member saved = memberRepository.save(member);
        notify(saved, "MEMBERSHIP_PLAN_UPDATED", "Membership plan updated",
                "Hi " + saved.getFullName() + ", your membership plan is now " + saved.getMembershipType().getLabel() + ".");
        return saved;
    }

    /**
     * Renewal: expiry stacks on the current expiry if still valid, otherwise starts today.
     * Creates a payment record at the plan price.
     */
    public RenewalResponse renew(Long id, RenewalRequest request) {
        Member member = getMemberById(id);
        MembershipType type = request.membershipType();
        LocalDate today = LocalDate.now();

        LocalDate base = (member.getMembershipExpiry() != null && !member.getMembershipExpiry().isBefore(today))
                ? member.getMembershipExpiry()
                : today;
        LocalDate expiry = base.plusMonths(type.getMonths());

        Payment payment = new Payment();
        payment.setClientId(member.getId());
        payment.setDate(today);
        payment.setDescription(type.getLabel() + " Membership Renewal");
        payment.setAmount(type.getPrice());
        payment.setMethod(request.method());
        payment.setMethodDetail(request.methodDetail());
        payment.setStatus("Paid");
        Payment saved = paymentRepository.save(payment);

        member.setMembershipType(type);
        member.setMembershipExpiry(expiry);
        Member savedMember = memberRepository.save(member);
        notify(savedMember, "MEMBERSHIP_RENEWED", "Membership renewed",
                "Hi " + savedMember.getFullName() + ", your membership was renewed until " + expiry + ".");

        return new RenewalResponse(expiry, saved);
    }

    // Business rule: a member with an active (not yet returned) rental cannot be deleted
    public void deleteMember(Long id) {
        Member member = getMemberById(id);
        boolean hasOpenRental = rentalRepository.findByMemberId(id).stream()
                .anyMatch(r -> r.getStatus() == RentalStatus.ACTIVE || r.getStatus() == RentalStatus.OVERDUE);
        if (hasOpenRental) {
            throw new BusinessRuleException(
                    "Cannot delete member '" + member.getFullName() + "' while they have an active rental");
        }
        memberRepository.delete(member);
    }

    private void notify(Member member, String type, String subject, String body) {
        notificationPublisher.publishMembershipNotification(member, type, subject, body);
    }
}
