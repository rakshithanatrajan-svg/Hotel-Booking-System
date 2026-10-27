package com.examly.springapp.config;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.examly.springapp.model.Booking;
import com.examly.springapp.model.BookingStatus;
import com.examly.springapp.model.Payment;
import com.examly.springapp.model.Role;
import com.examly.springapp.model.Room;
import com.examly.springapp.model.User;
import com.examly.springapp.repository.BookingRepository;
import com.examly.springapp.repository.PaymentRepository;
import com.examly.springapp.repository.RoomRepository;
import com.examly.springapp.repository.UserRepository;

@Configuration
@ConditionalOnProperty(name = "app.seed-data", havingValue = "true", matchIfMissing = true)
public class DatabaseInitializer {

    @Bean
    CommandLineRunner initDatabase(
            UserRepository userRepository,
            RoomRepository roomRepository,
            BookingRepository bookingRepository,
            PaymentRepository paymentRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {
            if (!userRepository.existsByEmail("admin@hotel.com")) {
                userRepository.save(new User(
                        null,
                        "Admin Manager",
                        "admin@hotel.com",
                        passwordEncoder.encode("admin123"),
                        "+1 555-0100",
                        Role.ADMIN
                ));
            }

            User guest = null;
            if (!userRepository.existsByEmail("guest@hotel.com")) {
                guest = userRepository.save(new User(
                        null,
                        "John Guest",
                        "guest@hotel.com",
                        passwordEncoder.encode("guest123"),
                        "+1 555-0199",
                        Role.GUEST
                ));
            } else {
                guest = userRepository.findByEmail("guest@hotel.com").orElse(null);
            }

            User alice = null;
            if (!userRepository.existsByEmail("alice@hotel.com")) {
                alice = userRepository.save(new User(
                        null,
                        "Alice Johnson",
                        "alice@hotel.com",
                        passwordEncoder.encode("alice123"),
                        "+1 555-0245",
                        Role.GUEST
                ));
            } else {
                alice = userRepository.findByEmail("alice@hotel.com").orElse(null);
            }

            User bob = null;
            if (!userRepository.existsByEmail("bob@hotel.com")) {
                bob = userRepository.save(new User(
                        null,
                        "Bob Smith",
                        "bob@hotel.com",
                        passwordEncoder.encode("bob123"),
                        "+1 555-0378",
                        Role.GUEST
                ));
            } else {
                bob = userRepository.findByEmail("bob@hotel.com").orElse(null);
            }

            Room room101 = null;
            Room room102 = null;
            Room room201 = null;
            Room room301 = null;

            if (roomRepository.count() == 0) {
                room101 = roomRepository.save(new Room(null, "101", "Standard", 100.0, 2, true));
                room102 = roomRepository.save(new Room(null, "102", "Deluxe", 160.0, 3, true));
                roomRepository.save(new Room(null, "103", "Standard", 95.0, 2, true));
                room201 = roomRepository.save(new Room(null, "201", "Suite", 250.0, 4, true));
                roomRepository.save(new Room(null, "202", "Standard", 85.0, 1, true));
                roomRepository.save(new Room(null, "203", "Deluxe", 175.0, 2, true));
                room301 = roomRepository.save(new Room(null, "301", "Suite", 450.0, 4, false));
                roomRepository.save(new Room(null, "302", "Deluxe", 190.0, 2, true));
                roomRepository.save(new Room(null, "401", "Suite", 600.0, 6, true));
                roomRepository.save(new Room(null, "402", "Deluxe", 320.0, 5, true));
            } else {
                room101 = roomRepository.findAll().stream().filter(r -> "101".equals(r.getRoomNumber())).findFirst().orElse(null);
                room102 = roomRepository.findAll().stream().filter(r -> "102".equals(r.getRoomNumber())).findFirst().orElse(null);
                room201 = roomRepository.findAll().stream().filter(r -> "201".equals(r.getRoomNumber())).findFirst().orElse(null);
                room301 = roomRepository.findAll().stream().filter(r -> "301".equals(r.getRoomNumber())).findFirst().orElse(null);
            }

            if (bookingRepository.count() == 0 && room101 != null && guest != null) {
                bookingRepository.save(new Booking(
                        null,
                        guest,
                        room101,
                        "John Guest",
                        "guest@hotel.com",
                        LocalDate.now().plusDays(2),
                        LocalDate.now().plusDays(5),
                        300.0,
                        BookingStatus.PENDING,
                        LocalDateTime.now().minusDays(1)
                ));

                if (room201 != null && alice != null) {
                    Booking b2 = bookingRepository.save(new Booking(
                            null,
                            alice,
                            room201,
                            "Alice Johnson",
                            "alice@hotel.com",
                            LocalDate.now().plusDays(5),
                            LocalDate.now().plusDays(8),
                            750.0,
                            BookingStatus.APPROVED,
                            LocalDateTime.now().minusDays(2)
                    ));
                    paymentRepository.save(new Payment(
                            null,
                            b2,
                            750.0,
                            "TXN_998124",
                            "CREDIT_CARD",
                            "SUCCESS",
                            LocalDateTime.now().minusDays(2)
                    ));
                }

                if (room301 != null && bob != null) {
                    Booking b3 = bookingRepository.save(new Booking(
                            null,
                            bob,
                            room301,
                            "Bob Smith",
                            "bob@hotel.com",
                            LocalDate.now().plusDays(1),
                            LocalDate.now().plusDays(4),
                            1350.0,
                            BookingStatus.APPROVED,
                            LocalDateTime.now().minusDays(3)
                    ));
                    paymentRepository.save(new Payment(
                            null,
                            b3,
                            1350.0,
                            "TXN_998125",
                            "NET_BANKING",
                            "SUCCESS",
                            LocalDateTime.now().minusDays(3)
                    ));
                }

                if (room102 != null) {
                    bookingRepository.save(new Booking(
                            null,
                            guest,
                            room102,
                            "David Miller",
                            "david@example.com",
                            LocalDate.now().plusDays(10),
                            LocalDate.now().plusDays(12),
                            320.0,
                            BookingStatus.REJECTED,
                            LocalDateTime.now().minusDays(4)
                    ));
                }
            }
        };
    }
}
