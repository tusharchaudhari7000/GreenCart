# Project Scope — GreenCart

## Problem Statement

Farmers, especially smallholders, often lack direct access to buyers and depend on
middlemen who reduce their profit margins. GreenCart is a digital marketplace that
connects farmers directly with buyers, enabling fair pricing and transparent
transactions, managed by a robust administrative system.

## Objectives

- Provide farmers a platform to list and manage their produce and stock
- Allow buyers to browse, add to cart, and place orders directly
- Ensure secure, role-based authentication (Admin, Farmer, Buyer)
- Give admins oversight and reporting across the platform
- Demonstrate interoperability between Java (Spring Boot) and .NET services

## In Scope

- User registration, login, logout, and profile retrieval (`/user/*`)
- Forgot-password flow via security questions
- Product catalog: create, update, delete, list by seller (`/api/products/*`)
- Category and sub-category management (`/api/categories`)
- Stock management per seller (`/stocks/*`)
- Shopping cart: add, view, update, remove items, clear cart (`/api/cart/*`)
- Order placement and retrieval by buyer (`/api/orders/*`)
- Seller-side order visibility (`/api/farmer/orders/*`)
- Admin oversight and reporting via .NET Admin Service
- Service discovery (Eureka) and centralized routing (API Gateway)

## Out of Scope (This Phase)

- Logistics / delivery tracking integration
- Multi-language / regional language support
- Advanced analytics or recommendation engine
- Native mobile apps (web-first, React SPA only)
- Automated refund/dispute resolution workflows

## Architecture Approach

- Microservices architecture: User Service, Product Service, Buyer Service (all Spring Boot),
  Admin Service (.NET 8), registered via Eureka Discovery Server
- Single entry point via API Gateway
- MySQL (`greencartdb`) as the shared relational datastore
- React.js + Redux Toolkit frontend consuming all services via Axios

## Deliverables

- Working microservices with REST APIs (documented via Swagger/OpenAPI)
- SRS and BRS documentation
- Functional React frontend integrated with all backend services
