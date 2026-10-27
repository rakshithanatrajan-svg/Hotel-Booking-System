package com.examly.springapp.dto.response;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class JwtResponse {

    private String token;
    private String role;
    private String message;

    public JwtResponse(String token, String role, String message) {
        this.token = token;
        this.role = role;
        this.message = message;
    }
}