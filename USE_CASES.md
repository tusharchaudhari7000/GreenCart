# Use Cases — GreenCart

## Actors

- **Farmer (Seller)** — lists and sells produce
- **Buyer** — browses and purchases produce
- **Admin** — oversees the platform (via .NET Admin Service)
- **System** — automated processes (auth, stock checks)

## Farmer Use Cases

| ID | Use Case | Endpoint(s) |
|---|---|---|
| F1 | Register / Login | `POST /user/register`, `POST /user/login` |
| F2 | View / Update Profile | `GET /user/me` |
| F3 | Create Product Listing | `POST /api/products/create` |
| F4 | Update Product | `PUT /api/products/update/{productId}` |
| F5 | Delete Product | `DELETE /api/products/{id}` |
| F6 | View Own Products | `GET /api/products/seller` |
| F7 | Manage Stock | `POST /stocks`, `GET /stocks/seller/{sellerId}` |
| F8 | View Orders Received | `GET /api/farmer/orders/seller/{sellerId}` |

## Buyer Use Cases

| ID | Use Case | Endpoint(s) |
|---|---|---|
| B1 | Register / Login | `POST /user/register`, `POST /user/login` |
| B2 | Browse Products | `GET /api/products`, `GET /api/products/{id}` |
| B3 | Browse Categories | `GET /api/categories`, `GET /api/categories/{id}` |
| B4 | Add to Cart | `POST /api/cart/add` |
| B5 | View Cart | `GET /api/cart/{buyerId}` |
| B6 | Update / Remove Cart Item | `PUT /api/cart/item/{cartItemId}`, `DELETE /api/cart/item/{cartItemId}` |
| B7 | Clear Cart | `DELETE /api/cart/{buyerId}/clear` |
| B8 | Place Order | `POST /api/orders/place` |
| B9 | View Order History | `GET /api/orders/buyer/{buyerId}` |
| B10 | View Order Details | `GET /api/orders/{orderId}` |
| B11 | Forgot Password | `GET /user/forgot-password/question`, `POST /user/forgot-password/verify`, `POST /user/forgot-password/reset` |

## Admin Use Cases

| ID | Use Case | Description |
|---|---|---|
| A1 | Login | Admin authenticates via Admin Service |
| A2 | Manage Users | View/manage Farmer and Buyer accounts (`GET /user/getall` cross-referenced) |
| A3 | Reporting | View platform-wide order/user reports via .NET Admin Service |
| A4 | System Orchestration | Oversee overall platform health and configuration |

## System Use Cases

| ID | Use Case | Description |
|---|---|---|
| S1 | JWT Auth | Issue and validate JWT on login for stateless authentication |
| S2 | Service Discovery | All services register with Eureka Discovery Server |
| S3 | Request Routing | API Gateway routes incoming requests to the correct service |
| S4 | Cross-Service Verification | Buyer Service verifies user via User Service and checks stock via Product Service during order placement |

## Sample Flow: Placing an Order (Buyer)

1. Buyer logs in → `POST /user/login` returns JWT
2. Buyer browses catalog → `GET /api/products`
3. Buyer adds item to cart → `POST /api/cart/add`
4. Buyer reviews cart → `GET /api/cart/{buyerId}`
5. Buyer places order → `POST /api/orders/place` (Buyer Service verifies user + checks stock)
6. Buyer views order confirmation → `GET /api/orders/{orderId}`
7. Farmer sees the new order → `GET /api/farmer/orders/seller/{sellerId}`
