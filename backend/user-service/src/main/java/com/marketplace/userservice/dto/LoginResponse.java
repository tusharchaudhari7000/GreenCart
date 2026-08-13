package com.marketplace.userservice.dto;

public class LoginResponse {
    private Integer userId;
    private String username, firstName, lastName, email, phone, role;
    private Integer status;
    private String token;
    private Long expiresIn;

    public LoginResponse(Integer userId, String username, String firstName, String lastName,
            String email, String phone, String role, Integer status, String token, Long expiresIn) {
        this.userId = userId; this.username = username; this.firstName = firstName;
        this.lastName = lastName; this.email = email; this.phone = phone;
        this.role = role; this.status = status; this.token = token; this.expiresIn = expiresIn;
    }
    // getters only needed for serialization — add if required
    public Integer getUserId() { return userId; }
    public String getUsername() { return username; }
    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
    public String getEmail() { return email; }
    public String getPhone() { return phone; }
    public String getRole() { return role; }
    public Integer getStatus() { return status; }
    public String getToken() { return token; }
    public Long getExpiresIn() { return expiresIn; }
}
