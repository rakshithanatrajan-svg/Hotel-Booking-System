package com.examly.springapp.dto.request;

import com.examly.springapp.model.Role;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class RegisterRequest {

    private String name;
    private String email;
    private String password;
    private String phoneNumber;
    private Role role;
    private String adminKey;

    public RegisterRequest(String name, String email,
                           String password, String phoneNumber) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.phoneNumber = phoneNumber;
        this.role = Role.GUEST;
    }

    public RegisterRequest(String name, String email,
                           String password, String phoneNumber, Role role) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.phoneNumber = phoneNumber;
        this.role = role;
    }

    public RegisterRequest(String name, String email,
                           String password, String phoneNumber, Role role, String adminKey) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.phoneNumber = phoneNumber;
        this.role = role;
        this.adminKey = adminKey;
    }
}