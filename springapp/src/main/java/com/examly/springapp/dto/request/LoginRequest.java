package com.examly.springapp.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class LoginRequest {

    private String email;
    private String password;
    private String adminKey;

    public LoginRequest(String email, String password) {
        this.email = email;
        this.password = password;
    }

    public LoginRequest(String email, String password, String adminKey) {
        this.email = email;
        this.password = password;
        this.adminKey = adminKey;
    }
}