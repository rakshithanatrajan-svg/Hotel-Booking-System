package com.examly.springapp.service;

public interface EmailService {

    void sendBookingConfirmation(String to,
                                 String subject,
                                 String message);

    void sendCancellationEmail(String to,
                               String subject,
                               String message);
}