# 🏨 Hotel Room Booking & Management System

A full-stack, enterprise-grade Hotel Room Booking & Management web application built with **Spring Boot 3**, **React 18**, **MySQL**, and secured with **JWT & Role-Based Access Control (RBAC)**.

---

## ✨ Features

### 👤 Guest Experience
- **Room Catalog**: Browse all hotel rooms with high-resolution imagery, pricing, capacity, and amenities.
- **Search & Filters**: Filter rooms dynamically by check-in/out dates, price ranges, room types, and guest capacity.
- **Instant Booking**: Complete booking flow with automatic duration and total price computation.
- **Razorpay Payment Gateway**: Seamless checkout integration with cards, netbanking, and UPI (Google Pay, PhonePe, Paytm).
- **Guest Dashboard**: View booking receipts, status (PENDING, APPROVED, CONFIRMED, CANCELLED), and reservation history.

### 🛡️ Admin Management Suite
- **Secure Admin Registration & Login**: Requires an authorized **Admin Security ID / Access Key** (`ADMIN@2026`) to prevent unauthorized portal access.
- **Inventory Management (CRUD)**: Create new rooms, update pricing, edit details, and toggle room availability.
- **Booking Workflow**: Review pending reservation requests, approve or reject bookings in real-time.
- **Real-Time Analytics**: Dashboard displaying live metrics for Total Rooms, Available Rooms, Total Bookings, Pending Approvals, and Total Revenue.

---

## 🛠️ Tech Stack

- **Backend**: Java 17, Spring Boot 3.4.0, Spring Data JPA, Spring Security, JWT (JSON Web Tokens), Maven
- **Database**: MySQL 8.0+ / Hibernate ORM
- **Payment Gateway**: Razorpay Java SDK 1.4.6 & Razorpay Checkout.js
- **Frontend**: React 18, React Router v6, Axios, Custom Responsive CSS
- **API Documentation**: OpenAPI 3 / Swagger UI (`/swagger-ui.html`)

---

## 🚀 Getting Started

### Prerequisites
- **Java**: JDK 17 or higher
- **Node.js**: v16 or higher & npm
- **Database**: MySQL Server running locally on port `3306`
- **Maven**: 3.8+ (or Maven wrapper)

---

### 1. Database Setup
Ensure MySQL is running and execute:
```sql
CREATE DATABASE IF NOT EXISTS hotel_booking_db;
```
Configure your credentials in `springapp/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/hotel_booking_db?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=your_password
```

---

### 2. Spring Boot Backend Setup
Navigate to the `springapp` directory:
```bash
cd springapp
mvn clean install
mvn spring-boot:run
```
The backend server starts on **`http://localhost:8080`**.
- **Swagger Documentation**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

---

### 3. React Frontend Setup
Navigate to the `reactapp` directory:
```bash
cd reactapp
npm install
npm start
```
The application will launch on **`http://localhost:8081`** (or `http://localhost:3000`).

---

## 🔐 Admin Access Key
To register or sign into the **Admin Portal**, enter the security key:
- **Admin Key**: `ADMIN@2026`

---

## 📁 Repository Structure

```
├── reactapp/                  # React 18 Single Page Application
│   ├── public/                # Static assets & index.html
│   └── src/
│       ├── components/        # Reusable UI components
│       ├── context/           # AuthContext (JWT & state management)
│       ├── pages/             # Route pages (Home, Rooms, Booking, Admin)
│       └── services/          # Axios API client & endpoints
├── springapp/                 # Spring Boot Backend API
│   ├── src/main/java/com/examly/springapp/
│   │   ├── config/            # Security & CORS configuration
│   │   ├── controller/        # REST Controllers (Auth, Rooms, Bookings, Payments)
│   │   ├── dto/               # Request & Response DTOs
│   │   ├── exception/         # Global Exception Handlers
│   │   ├── model/             # JPA Entities (User, Room, Booking, Payment)
│   │   ├── repository/        # Spring Data JPA Repositories
│   │   └── service/           # Business logic layer
│   └── src/main/resources/    # application.properties
└── README.md
```

---

## 📄 License
This project is licensed under the MIT License.
