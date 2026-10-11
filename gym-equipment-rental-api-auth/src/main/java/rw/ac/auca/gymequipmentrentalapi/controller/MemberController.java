package rw.ac.auca.gymequipmentrentalapi.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import rw.ac.auca.gymequipmentrentalapi.dto.*;
import rw.ac.auca.gymequipmentrentalapi.model.Member;
import rw.ac.auca.gymequipmentrentalapi.security.Access;
import rw.ac.auca.gymequipmentrentalapi.service.MemberService;

import java.util.List;

/** /api/members — member management, approvals, plan changes, and renewals. */
@RestController
@RequestMapping("/api/members")
public class MemberController {

    @Autowired
    private MemberService memberService;

    @Autowired
    private Access access;

    @GetMapping
    public ResponseEntity<List<Member>> getAllMembers() {
        return ResponseEntity.ok(memberService.getAllMembers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Member> getMemberById(@PathVariable Long id) {
        return ResponseEntity.ok(memberService.getMemberById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Member> updateMember(@PathVariable Long id, @Valid @RequestBody MemberUpdateRequest request) {
        return ResponseEntity.ok(memberService.updateMember(id, request));
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<Member> approve(@PathVariable Long id) {
        return ResponseEntity.ok(memberService.approve(id));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<Member> reject(@PathVariable Long id) {
        return ResponseEntity.ok(memberService.reject(id));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Member> setStatus(@PathVariable Long id, @Valid @RequestBody StatusRequest request) {
        return ResponseEntity.ok(memberService.setActive(id, request.active()));
    }

    @PutMapping("/{id}/plan")
    public ResponseEntity<Member> changePlan(@PathVariable Long id, @Valid @RequestBody PlanChangeRequest request) {
        access.requireStaffOrSelf(id);
        return ResponseEntity.ok(memberService.changePlan(id, request.membershipType()));
    }

    @PostMapping("/{id}/renewals")
    public ResponseEntity<RenewalResponse> renew(@PathVariable Long id, @Valid @RequestBody RenewalRequest request) {
        access.requireStaffOrSelf(id);
        return ResponseEntity.ok(memberService.renew(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMember(@PathVariable Long id) {
        memberService.deleteMember(id);
        return ResponseEntity.noContent().build();
    }
}
