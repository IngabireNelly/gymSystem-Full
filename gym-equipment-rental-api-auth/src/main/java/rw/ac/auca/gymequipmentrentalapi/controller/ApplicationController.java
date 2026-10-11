package rw.ac.auca.gymequipmentrentalapi.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import rw.ac.auca.gymequipmentrentalapi.dto.ApplicationRequest;
import rw.ac.auca.gymequipmentrentalapi.model.Member;
import rw.ac.auca.gymequipmentrentalapi.service.MemberService;

/** /api/applications — public membership application (staff approve it later). */
@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    @Autowired
    private MemberService memberService;

    @PostMapping
    public ResponseEntity<Member> apply(@Valid @RequestBody ApplicationRequest request) {
        return new ResponseEntity<>(memberService.applyForMembership(request), HttpStatus.CREATED);
    }
}
