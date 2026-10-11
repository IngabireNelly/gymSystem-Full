package rw.ac.auca.gymequipmentrentalapi.security;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

/**
 * Ownership checks that URL rules can't express, e.g. "a member may only rent for themselves".
 * Staff can act on any record; clients only on their own.
 */
@Component
public class Access {

    public AuthUser current() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof AuthUser user)) {
            throw new AccessDeniedException("Please log in to continue.");
        }
        return user;
    }

    public boolean isStaff() {
        return "STAFF".equals(current().role());
    }

    public boolean isClient() {
        return "CLIENT".equals(current().role());
    }

    public void requireStaff() {
        if (!isStaff()) {
            throw new AccessDeniedException("Only staff can do that.");
        }
    }

    public void requireClient() {
        if (!isClient()) {
            throw new AccessDeniedException("Only members have a membership profile.");
        }
    }

    /** Staff may act on any member; a client may act only on their own membership id. */
    public void requireStaffOrSelf(Long memberId) {
        if (isStaff()) return;
        if (isClient() && current().id().equals(memberId)) return;
        throw new AccessDeniedException("You can only access your own membership and rentals.");
    }
}
