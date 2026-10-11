package rw.ac.auca.gymequipmentrentalapi.model;

import com.fasterxml.jackson.annotation.JsonValue;

/** Membership plans with their length in months and price (USD, as shown in the frontend). */
public enum MembershipType {
    MONTHLY("Monthly", 1, 19.0),
    QUARTERLY("Quarterly", 3, 49.0),
    ANNUAL("Annual", 12, 180.0);

    private final String label;
    private final int months;
    private final double price;

    MembershipType(String label, int months, double price) {
        this.label = label;
        this.months = months;
        this.price = price;
    }

    @JsonValue
    public String getLabel() {
        return label;
    }

    public int getMonths() {
        return months;
    }

    public double getPrice() {
        return price;
    }
}
