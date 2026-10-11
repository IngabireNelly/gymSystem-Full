package rw.ac.auca.gymequipmentrentalapi.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import rw.ac.auca.gymequipmentrentalapi.dto.LoginRequest;
import rw.ac.auca.gymequipmentrentalapi.dto.LoginResponse;
import rw.ac.auca.gymequipmentrentalapi.dto.MeResponse;
import rw.ac.auca.gymequipmentrentalapi.security.Access;
import rw.ac.auca.gymequipmentrentalapi.service.AuthService;

/** /api/auth — login (public) and the current user for a stored token. */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired private AuthService authService;
    @Autowired private Access access;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/me")
    public ResponseEntity<MeResponse> me() {
        return ResponseEntity.ok(authService.currentUser(access.current()));
    }
}
