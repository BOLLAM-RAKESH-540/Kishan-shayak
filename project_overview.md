# Kisan Sahayak App — Project Overview

A full-stack **farmer assistance platform** (Hindi: Kisan = Farmer, Sahayak = Helper) built for rural Indian farmers to manage their farms, finances, livestock, equipment rentals, and more.

---

## 🏗️ Architecture

```
kisan-sahayak-app/
├── client/          # React + Vite + TypeScript + TailwindCSS (Frontend)
├── server/          # Express + TypeScript + Prisma (Backend)
└── docker-compose.yml  # PostgreSQL database (port 5435)
```

**Pattern:** Monorepo with two independently managed packages.

---

## 🖥️ Frontend (`client/`)

| Item | Detail |
|------|--------|
| Framework | React 19 + Vite 7 |
| Language | TypeScript |
| Styling | TailwindCSS v3 |
| Routing | React Router DOM v7 |
| HTTP Client | Axios |
| Icons | Lucide React |

### Pages / Routes

| Route | Component | Purpose |
|-------|-----------|---------|
| `/login` | `Login.tsx` | User login |
| `/register` | `Register.tsx` | User registration |
| `/forgot-password` | `ForgotPassword.tsx` | Password reset |
| `/dashboard` | `Dashboard.tsx` | Main overview |
| `/farm-profile` | `FarmProfile.tsx` | Crop/farm management |
| `/expenses` | `Expenses.tsx` | Expense tracking |
| `/resources` | `Resources.tsx` | Farming resources |
| `/rentals` | `Rentals.tsx` | Vehicle rental listings |
| `/husbandry` | `Husbandry.tsx` | Livestock/milk listings |
| `/vehicles` | `VehicleTracker.tsx` | Vehicle job tracker |
| `/weather` | `Weather.tsx` | Weather info |
| `/market-prices` | `MarketPrices.tsx` | Crop market prices |
| `/diseases` | `Diseases.tsx` | Crop disease guide |
| `/schemes` | `Schemes.tsx` | Government schemes |
| `/crops` | `CropInfo.tsx` | Crop information |
| `/experts` | `Experts.tsx` | Agricultural experts |
| `/help` | `Helpline.tsx` | Helpline numbers |
| `/chat` | `Chatbot.tsx` | AI chatbot |
| `/profile` | `Profile.tsx` | User profile |

### Frontend Structure
- **Auth:** Phone number + password based login/registration
- **Token Storage:** JWT in `localStorage` under key `token`
- **User Info:** Stored in `localStorage` under key `user` (phoneNumber used as primary ID)
- **API Base:** `http://localhost:3000/api`
- **Layout:** Authenticated routes wrapped in `Layout` component with `Sidebar`

---

## ⚙️ Backend (`server/`)

| Item | Detail |
|------|--------|
| Framework | Express 4 |
| Language | TypeScript |
| ORM | Prisma 6 |
| Database | PostgreSQL (via Docker) |
| Auth | JWT + bcryptjs |
| Validation | Zod |
| Security | Helmet + CORS |
| Dev Server | Nodemon + ts-node |

### API Endpoints

| Prefix | Router File | Domain |
|--------|-------------|--------|
| `/api/auth` | `auth.routes.ts` | Login, Register |
| `/api/farms` | `farm.routes.ts` | Farm profiles, activities, yields |
| `/api/market` | `market.routes.ts` | Crop market prices |
| `/api/vehicles` | `vehicle.routes.ts` | Vehicle tracking/jobs |
| `/api/shops` | `shop.routes.ts` | Supplier shops + products |
| `/api/rentals` | `rentals.routes.ts` | Vehicle rentals |
| `/api/diseases` | `disease.routes.ts` | Crop disease data |

> ⚠️ **Note:** `/api/expenses` and `/api/husbandry` are handled in controllers but the routes are **not registered in `app.ts`!** (`expenseRoutes.ts` and `husbandry.routes.ts` exist but are not imported.)

### Controllers
`auth`, `disease`, `expenses`, `farm`, `husbandry`, `market`, `rentals`, `shop`, `vehicle`

### Server services directory is **empty** — all business logic lives in controllers.

---

## 🗃️ Database (Prisma Schema)

| Model | Description |
|-------|-------------|
| `User` | Core user (phone number as unique ID) |
| `FarmProfile` | Crop + field data per user |
| `FieldActivity` | Irrigation/fertilizer/pesticide logs |
| `Expense` | Farm/personal expense records |
| `YieldLog` | Harvest yields with selling price |
| `SupplierShop` | Agri-input shops |
| `Product` | Products sold by shops |
| `VehicleWork` | Job records (tractor hire, etc.) |
| `VehicleRental` | Equipment rental listings |
| `HusbandryListing` | Livestock/milk sale listings |
| `ReferenceCrop` | Reference crop catalog |
| `Disease` | Crop disease info linked to crops |
| `Treatment` | Treatment options per disease |
| `Scheme` | Government schemes |
| `Expert` | Agricultural expert directory |

> **Key Design:** `User.phoneNumber` is used as the **foreign key** in most relationships (not `User.id`).

---

## 🐳 Infrastructure

- **Database:** PostgreSQL 15 via Docker on port `5435` (avoids conflicts with other projects)
- **DB Name:** `kisan_db`, User: `admin`, Password: `kisan_password`
- **Server Port:** `3000`
- **Client Port:** `5173` (Vite default)

---

## ⚠️ Known Issues & Gaps

1. **Missing route registrations in `app.ts`:**
   - `expenseRoutes` — controller exists, route file exists, but NOT mounted
   - `husbandryRoutes` — controller exists, route file exists, but NOT mounted
   - ➜ These features will return 404 at runtime

2. **`server/src/services/` is empty** — no service layer abstraction; all DB logic is in controllers

3. **`ForgotPassword` page exists on frontend** but there is no corresponding backend endpoint for password reset

4. **JWT Secret** is hardcoded as a weak string (`"my_super_secret_key_123"`) — needs to be rotated before production

5. **No authentication middleware** protecting most routes — `apiService.auth` sends JWT but it's unclear if `authMiddleware` is applied globally

6. **`Shops.tsx` page exists** in `pages/` but has **no route** registered in `App.tsx`

---

## 🚀 How to Run

### 1. Start Database
```bash
docker-compose up -d
```

### 2. Run Backend
```bash
cd server
npm run dev    # nodemon + ts-node on port 3000
```

### 3. Run Frontend
```bash
cd client
npm run dev    # Vite on port 5173
```
