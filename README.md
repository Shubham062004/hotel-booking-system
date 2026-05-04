# Hotel Booking System

A full-stack hotel booking platform built with **Spring Boot** and **Angular**, featuring JWT authentication, role-based access control, and a clean Material Design UI.

---

## Overview

| Feature | Details |
|---|---|
| Authentication | JWT-based login with role support (USER / ADMIN) |
| Hotel Browsing | View available hotels and selectable dates via datepicker |
| Booking | Date-guarded booking with double-booking prevention |
| Admin Dashboard | Sortable, paginated bookings table with revenue summary |
| Security | Stateless sessions, BCrypt passwords, CORS-controlled |

---

## Architecture

```
hotel-booking-system/
├── auth-service/          ← Spring Boot backend (REST API + Security)
│   ├── controller/        ← AuthController, HotelController, BookingController
│   ├── service/           ← AuthService, HotelService, BookingService
│   ├── repository/        ← MongoDB repositories
│   ├── model/             ← User, Hotel, Booking documents
│   ├── config/            ← SecurityConfig, JwtUtil, CorsConfig, DataInitializer
│   ├── dto/               ← Request/Response DTOs
│   └── exception/         ← GlobalExceptionHandler
│
└── web-app/               ← Angular frontend (Material UI)
    └── src/app/
        ├── components/    ← login, hotel-list, admin-dashboard
        ├── services/      ← auth.service, booking.service
        ├── interceptors/  ← auth.interceptor (JWT), error.interceptor (global)
        ├── guards/        ← auth.guard (role-based route protection)
        └── models/        ← Shared TypeScript interfaces
```

---

## Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Spring Boot 3.3 | REST API framework |
| Spring Security 6 | Authentication & authorisation |
| Spring Data MongoDB | Database ORM |
| jjwt 0.12 | JWT generation & validation |
| Lombok | Boilerplate reduction |
| Docker | Containerised deployment |

### Frontend
| Technology | Purpose |
|---|---|
| Angular 17+ | SPA framework (standalone components) |
| Angular Material | UI component library |
| RxJS | Reactive HTTP & state management |
| TypeScript | Type-safe development |

### Infrastructure
| Technology | Purpose |
|---|---|
| MongoDB | Document database |
| MongoDB Atlas | Cloud database (production) |
| Render | Backend hosting |

---

## API Reference

### Auth
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/auth/login` | Public | Returns JWT token + role |

### Hotels
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/hotels` | Authenticated | List all hotels with available dates |

### Bookings
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/book` | Authenticated | Create a booking for a hotel + date |
| `GET` | `/bookings` | ADMIN only | List all bookings |

### Error Responses
| Status | Meaning |
|---|---|
| `401` | Invalid credentials or expired JWT |
| `403` | Insufficient role |
| `404` | Hotel not found |
| `409` | Date unavailable or already booked |
| `500` | Internal server error |

---

## Local Setup

### Prerequisites
- Java 17+
- Maven 3.9+
- Node.js 18+
- MongoDB (local or Atlas URI)

---

### 1. Clone the repository

```bash
git clone https://github.com/Shubham062004/hotel-booking-system.git
cd hotel-booking-system
```

---

### 2. Start the backend

```bash
cd auth-service
mvn spring-boot:run
```

> Runs on **http://localhost:8081**
>
> On first startup, `DataInitializer` seeds the following accounts:
>
> | Username | Password | Role |
> |---|---|---|
> | `admin` | `admin123` | ADMIN |
> | `user` | `user123` | USER |
>
> And three sample hotels: **Grand Palace**, **Ocean Breeze**, **Mountain Lodge**.

---

### 3. Start the frontend

```bash
cd web-app
npm install
npm start
```

> Runs on **http://localhost:4200**
>
> The Angular dev server proxies `/api/*` → `http://localhost:8081` via `proxy.conf.json`, eliminating CORS issues during development.

---

### 4. Environment variables (backend)

| Variable | Default | Description |
|---|---|---|
| `MONGODB_URI` | `mongodb://localhost:27017/hotelDB` | MongoDB connection string |
| `PORT` | `8081` | Server port (auto-injected by Render) |
| `JWT_SECRET` | *(bundled base64 key)* | 256-bit Base64-encoded HMAC secret |
| `JWT_EXPIRATION` | `86400000` | Token TTL in milliseconds (24 h) |
| `FRONTEND_URL` | `http://localhost:4200` | Allowed CORS origin |

---

## Deployment

### Backend — Render (Docker)

1. Push the repository to GitHub.

2. On [Render](https://render.com), create a **New Web Service**:
   - **Runtime:** Docker
   - **Root Directory:** `auth-service`
   - **Dockerfile Path:** `auth-service/Dockerfile`

3. Add the following **Environment Variables** in the Render dashboard:

   ```
   MONGODB_URI   = mongodb+srv://<user>:<pass>@cluster.mongodb.net/hotelDB
   JWT_SECRET    = <your-256-bit-base64-secret>
   FRONTEND_URL  = https://your-angular-app.netlify.app
   ```

4. Deploy. Render will:
   - Build the Docker image (multi-stage: Maven → JRE Alpine)
   - Inject `$PORT` automatically
   - Start the container via `java -jar app.jar`

---

### Frontend — Netlify / Vercel

1. Build the Angular app:
   ```bash
   cd web-app
   npm run build
   ```

2. Deploy the `dist/web-app/browser/` folder to Netlify or Vercel.

3. Set the deployed backend URL as the API base in your Angular environment files.

---

## Testing the API

```bash
# 1 — Login (returns JWT)
curl -X POST http://localhost:8081/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user","password":"user123"}'

# 2 — List hotels
curl http://localhost:8081/hotels \
  -H "Authorization: Bearer <TOKEN>"

# 3 — Book a hotel
curl -X POST http://localhost:8081/book \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"hotelId":"<ID>","date":"2025-08-01"}'

# 4 — Admin: all bookings
curl http://localhost:8081/bookings \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

---

## License

MIT