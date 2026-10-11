package rw.ac.auca.gymequipmentrentalapi.model;

import com.fasterxml.jackson.annotation.JsonValue;

/** Stored as the enum name; sent to the frontend as its label ("Available", ...). */
public enum EquipmentStatus {
    AVAILABLE("Available"),
    RENTED("Rented"),
    MAINTENANCE("Maintenance");

    private final String label;

    EquipmentStatus(String label) {
        this.label = label;
    }

    @JsonValue
    public String getLabel() {
        return label;
    }
}
