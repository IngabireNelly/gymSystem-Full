package rw.ac.auca.gymequipmentrentalapi.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import rw.ac.auca.gymequipmentrentalapi.model.*;
import rw.ac.auca.gymequipmentrentalapi.repository.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

/**
 * Loads the same sample data the frontend used to keep in memory, but only when
 * the database is empty. Demo logins: staff/staff123, client/client123.
 */
@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired private StaffAccountRepository staffRepository;
    @Autowired private EquipmentRepository equipmentRepository;
    @Autowired private MemberRepository memberRepository;
    @Autowired private RentalRepository rentalRepository;
    @Autowired private PaymentRepository paymentRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (staffRepository.count() > 0) {
            return; // already seeded
        }

        StaffAccount staff = new StaffAccount();
        staff.setUsername("staff");
        staff.setEmail("staff@gymrental.rw");
        staff.setPassword(passwordEncoder.encode("staff123"));
        staff.setFullName("Grace Ingabire");
        staffRepository.save(staff);

        Map<String, Equipment> eq = new HashMap<>();
        eq.put("eq-1", equipment("Commercial Treadmill", "Cardio", 15000, "2025-11-04", EquipmentStatus.RENTED));
        eq.put("eq-2", equipment("Adjustable Dumbbell Set", "Strength", 5000, "2026-01-18", EquipmentStatus.AVAILABLE));
        eq.put("eq-3", equipment("Air Rowing Machine", "Cardio", 12000, "2025-08-22", EquipmentStatus.RENTED));
        eq.put("eq-4", equipment("Cork Yoga Mat & Blocks", "Yoga", 1500, "2026-03-09", EquipmentStatus.AVAILABLE));
        eq.put("eq-5", equipment("Percussion Massage Gun", "Recovery", 3000, "2026-05-27", EquipmentStatus.RENTED));
        eq.put("eq-6", equipment("Kettlebell 16kg", "Strength", 2000, "2025-12-02", EquipmentStatus.AVAILABLE));
        eq.put("eq-7", equipment("Spin Bike", "Cardio", 10000, "2025-06-14", EquipmentStatus.MAINTENANCE));
        eq.put("eq-8", equipment("Foam Roller Kit", "Recovery", 1000, "2026-02-20", EquipmentStatus.AVAILABLE));
        eq.put("eq-9", equipment("Olympic Barbell & Plates", "Strength", 8000, "2025-10-01", EquipmentStatus.AVAILABLE));

        Map<String, Member> cl = new HashMap<>();
        cl.put("cl-1", member("Aline Uwase", "0781234567", "aline@example.rw", "client", "client123",
                MembershipType.MONTHLY, "2026-07-28", "2026-07-30", "2026-09-30", ClientStatus.ACTIVE));
        cl.put("cl-2", member("Jean Claude Habimana", "0729876543", "jeanclaude@example.rw", "jeanclaude", "password123",
                MembershipType.ANNUAL, "2026-05-30", "2026-06-02", "2027-06-02", ClientStatus.ACTIVE));
        cl.put("cl-3", member("Patrick Mugisha", "0735550192", "patrick@example.rw", "patrick", "password123",
                MembershipType.QUARTERLY, "2026-03-02", "2026-03-04", "2026-06-04", ClientStatus.INACTIVE));
        cl.put("cl-4", member("Diane Mukamana", "0788112233", "diane@example.rw", "diane@example.rw", "password123",
                MembershipType.QUARTERLY, "2026-09-24", null, null, ClientStatus.PENDING));
        cl.put("cl-5", member("Eric Niyonzima", "0791445566", "eric@example.rw", "eric@example.rw", "password123",
                MembershipType.MONTHLY, "2026-09-25", null, null, ClientStatus.PENDING));

        rentalRepository.save(rental(eq.get("eq-1"), cl.get("cl-1"), "2026-09-24", "2026-10-01", 7, 15000, null, RentalStatus.ACTIVE));
        rentalRepository.save(rental(eq.get("eq-3"), cl.get("cl-2"), "2026-09-20", "2026-09-30", 10, 12000, null, RentalStatus.ACTIVE));
        rentalRepository.save(rental(eq.get("eq-5"), cl.get("cl-1"), "2026-09-15", "2026-09-22", 7, 3000, null, RentalStatus.ACTIVE));
        rentalRepository.save(rental(eq.get("eq-4"), cl.get("cl-1"), "2026-08-30", "2026-09-05", 6, 1500, "2026-09-04", RentalStatus.RETURNED));

        payment(cl.get("cl-1"), "2026-08-30", "Monthly Membership Renewal", 19, "Mobile Money", "MTN MoMo \u00B7 078\u2022\u2022\u2022 4567");
        payment(cl.get("cl-1"), "2026-07-30", "Monthly Membership \u2014 New Member", 19, "Mobile Money", "MTN MoMo \u00B7 078\u2022\u2022\u2022 4567");
        payment(cl.get("cl-2"), "2026-06-02", "Annual Membership \u2014 New Member", 180, "Card", "Card \u2022\u2022\u2022\u2022 4242");
        payment(cl.get("cl-3"), "2026-03-04", "Quarterly Membership \u2014 New Member", 49, "Mobile Money", "Airtel Money \u00B7 073\u2022\u2022\u2022 0192");
    }

    private Equipment equipment(String name, String category, double rate, String purchased, EquipmentStatus status) {
        Equipment e = new Equipment();
        e.setName(name);
        e.setCategory(category);
        e.setDailyRate(rate);
        e.setPurchaseDate(LocalDate.parse(purchased));
        e.setStatus(status);
        return equipmentRepository.save(e);
    }

    private Member member(String name, String phone, String email, String username, String password,
                          MembershipType type, String applied, String joined, String expiry, ClientStatus status) {
        Member m = new Member();
        m.setFullName(name);
        m.setPhone(phone);
        m.setEmail(email);
        m.setUsername(username);
        m.setPassword(passwordEncoder.encode(password));
        m.setMembershipType(type);
        m.setAppliedDate(LocalDate.parse(applied));
        m.setJoinDate(joined == null ? null : LocalDate.parse(joined));
        m.setMembershipExpiry(expiry == null ? null : LocalDate.parse(expiry));
        m.setStatus(status);
        return memberRepository.save(m);
    }

    private Rental rental(Equipment equipment, Member member, String start, String due, int days,
                          double rate, String returned, RentalStatus status) {
        Rental r = new Rental();
        r.setEquipment(equipment);
        r.setMember(member);
        r.setStartDate(LocalDate.parse(start));
        r.setDueDate(LocalDate.parse(due));
        r.setReturnedDate(returned == null ? null : LocalDate.parse(returned));
        r.setDays(days);
        r.setDailyRate(rate);
        r.setTotalCost(days * rate);
        r.setStatus(status);
        return r;
    }

    private void payment(Member member, String date, String description, double amount, String method, String detail) {
        Payment p = new Payment();
        p.setClientId(member.getId());
        p.setDate(LocalDate.parse(date));
        p.setDescription(description);
        p.setAmount(amount);
        p.setMethod(method);
        p.setMethodDetail(detail);
        p.setStatus("Paid");
        paymentRepository.save(p);
    }
}
