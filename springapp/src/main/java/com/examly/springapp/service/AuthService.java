package com.examly.springapp.service;

import com.examly.springapp.dto.request.LoginRequest;
import com.examly.springapp.dto.request.RegisterRequest;
import com.examly.springapp.dto.response.JwtResponse;

public interface AuthService {

    JwtResponse register(RegisterRequest request);

    JwtResponse login(LoginRequest request);
}
