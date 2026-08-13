# 🛒 GreenCart - E-Commerce Platform for Farmers & Buyers

**GreenCart** is a full-stack, microservices-based e-commerce platform designed to connect farmers directly with buyers, eliminating middlemen and empowering agricultural trade with real-time stock handling, secure payments, role-based security, and administrative oversight.

---

## 🏗️ Architecture & Technology Stack

### **Backend Microservices**
* **API Gateway (`api-gateway`)**: Spring Cloud Gateway for routing, security filtering, and JWT verification.
* **Discovery Server (`discovery-server`)**: Netflix Eureka Service Registry for dynamic service registration.
* **User Service (`user-service`)**: Spring Boot service handling authentication, registration, JWT issuance, and profile management.
* **Product Service (`product-service`)**: Spring Boot service for managing farmer produce, inventory, stock status, category filters, and location tags.
* **Buyer Service (`buyer-service`)**: Spring Boot service managing shopping carts, order placements, and buyer history.
* **Admin Service (`admin_service(.NET)`)**: .NET Core web service with EF Core handling platform metrics, user moderation, and administrative workflows.

### **Frontend**
* **React.js & Redux Toolkit**: Dynamic SPA UI with centralized auth & cart state management.
* **Axios**: Configured interceptors for JWT authorization headers.

### **Database & Infrastructure**
* **MySQL**: Shared relational database (`greencartdb`) used across services.
* **Docker & Docker Compose**: Containerization and orchestration (`docker-compose.yml`).
* **Nginx**: Reverse proxy for production web deployments.

---

## 📁 Repository Layout

```
GreenCart/
├── backend/
│   ├── api-gateway/            # Spring Cloud Gateway (Port 8080)
│   ├── discovery-server/       # Eureka Discovery Server (Port 8761)
│   ├── user-service/           # User & Auth Service (Port 8081)
│   ├── product-service/        # Product & Catalog Service (Port 8082)
│   ├── buyer-service/          # Cart & Orders Service (Port 8083)
│   └── admin_service(.NET)/    # Admin & Management Service (.NET)
├── frontend/                   # React Frontend App
├── database/                   # DB SQL scripts & schemas
├── docker-compose.yml          # Container configuration
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
* **Java 17+** & **Maven**
* **.NET 8.0 SDK** (for Admin Service)
* **Node.js 18+** & **npm**
* **MySQL Server**
* **Docker Desktop** *(optional, for containerized run)*

---

### Local Development Setup

#### 1. Database Setup
Create the single shared MySQL database:
```sql
CREATE DATABASE greencartdb;
```
*(Optional: Import initial seed data from `database/seed_data.sql`)*

#### 2. Start Backend Services
Using the provided `startall.bat` (Windows):
```cmd
.\startall.bat
```
*Or start individually:*
1. Start `discovery-server` (`mvn spring-boot:run`)
2. Start `api-gateway`
3. Start `user-service`, `product-service`, `buyer-service`
4. Start `admin_service(.NET)` (`dotnet run`)

#### 3. Start Frontend
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🐳 Running with Docker

Run the full stack via Docker Compose:
```bash
docker-compose up --build -d
```

---

## 🔑 Key Features
* 👨‍🌾 **Farmer Portal**: List fresh produce, update stock levels, set prices per location/area.
* 🛍️ **Buyer Interface**: Browse by category, search products, add items to cart, and checkout.
* 🔐 **Role-Based Security**: Role permissions (`FARMER`, `BUYER`, `ADMIN`) enforced via JWT tokens across the API Gateway and downstream services.
* 📊 **Admin Dashboard**: System health metrics, user management, and order auditing.

---

## 📄 License
This project is developed as part of the C-DAC PG Diploma Capstone Project.
