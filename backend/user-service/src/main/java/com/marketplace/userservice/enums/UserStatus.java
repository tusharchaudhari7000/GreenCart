package com.marketplace.userservice.enums;

public enum UserStatus {
    ACTIVE(1),
    PENDING(2);

    private final int code;
    UserStatus(int code) { this.code = code; }
    public int getCode() { return code; }

    public static UserStatus fromCode(int code) {
        for (UserStatus s : values()) if (s.code == code) return s;
        throw new IllegalArgumentException("Invalid UserStatus code: " + code);
    }
}
