# Kisan Sahayak App — Project Overview

A full-stack **farmer assistance platform** (Hindi: Kisan = Farmer, Sahayak = Helper) built for rural Indian farmers to manage their farms, finances, livestock, equipment rentals, and more.

---

## 🏗️ Architecture

```
kisan-sahayak-app/
├── client/          # React + Vite + TypeScript + TailwindCSS (Frontend)
├── server/          # Express + TypeScript + Prisma (Backend)
└── docker-compose.yml  # PostgreSQL + Redis Infrastructure
```

**Pattern:** Service-Oriented Controller Pattern.
- **Controllers**: Handle HTTP-specific logic (req/res).
- **Services**: Encapsulate business logic, database transactions, and third-party integrations.
- **Middlewares**: Handle cross-cutting concerns (Auth, Error Handling, Validation).

---

## 🖥️ Frontend (`client/`)

| Item | Detail |
|------|--------|
| Framework | React 19 + Vite 7 |
| Language | TypeScript |
| Styling | TailwindCSS v3 (High-Aesthetics Glassmorphism) |
| Routing | React Router DOM v7 |
| HTTP Client | Axios (with Auth Interceptors) |
| Feedback | React Hot Toast + Loading Spinners |
| Resilience | Global Offline Detection Banner |

### Core UX Features
- **Dynamic Breadcrumbs**: Path-aware navigation with functional back-history.
- **Network Awareness**: Real-time monitoring of connectivity to prevent data loss.
- **High-Aesthetics Cards**: Shadow-rich, icon-driven status cards for high scannability.

---

## ⚙️ Backend (`server/`)

### 🛡️ Security & Robustness
- **Global Error Middleware**: Centralized error mapping with standardized JSON responses.
- **JWT Protection**: Majority of routes are protected via a robust `authMiddleware`.
- **Security Headers**: Hardened with `Helmet`, `CORS`, and `Express-Rate-Limit`.
- **Validation**: All sensitive inputs validated via `Zod` schemas.

### 🍱 Service Layer
| Service | Responsibility |
|---------|----------------|
| `AuthService` | Identity, JWT, OTP, Profile Security, Account Deletion. |
| `FarmService` | Crop Lifecycle, Yield Analytics, Activity Logs. |
| `CacheService` | Redis-backed caching for Weather and Market data. |

### 🚀 API Endpoints (All Protected)
| Prefix | Domain | Status |
|--------|--------|--------|
| `/api/auth` | Login, Register, Profile, OTP | ✅ Hardened |
| `/api/farms` | Crop Management, Analytics | ✅ Hardened |
| `/api/expenses` | Financial Ledger | ✅ Integrated |
| `/api/husbandry`| Livestock Bazaar | ✅ Integrated |
| `/api/market` | Live Mandi Rates | ✅ Caching active |
| `/api/weather` | Open-Meteo Proxy | ✅ Caching active |
| `/api/community`| Farmer Social Feed | ✅ Active |

---

## 🗃️ Database (Prisma Schema)
- **Primary ID Design**: Most relations resolve via `phoneNumber` for regional consistency.
- **Transactional Safety**: Account deletion and financial logs are handled via ACID transactions.

---

## 🐳 Infrastructure
- **PostgreSQL 15**: Scalable relational storage (Port `5435`).
- **Redis 7**: Caching layer for API rate-limiting and weather data.

---

## ✅ Recent Hardening (v1.1)
- [x] **Fat Controller Refactor**: Moved logic to dedicated Service classes.
- [x] **Error Standard**: Replaced ad-hoc `try-catch` with global Error Middleware.
- [x] **Route Protection**: Audited and secured public endpoints.
- [x] **User Journey**: Integrated dynamic breadcrumbs and offline detection.
- [x] **Offboarding**: Implemented secure "Danger Zone" account deletion.

---

## 🚀 How to Run

1. **Start Infrastructure**: `docker-compose up -d`
2. **Run Backend**: `cd server && npm run dev`
3. **Run Frontend**: `cd client && npm run dev`
