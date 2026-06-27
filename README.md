# Karmana – Wellness App

> Breathe. Rest. Grow.

## Project Structure

```
karmana/
├── ui/               React Native / Expo mobile app
├── backend/          Spring Boot REST API (Java 21)
├── terraform/        AWS infrastructure as code
└── README.md
```

---

## ui/ — Mobile App (Expo)

```bash
cd ui
npm install
npx expo start
```

- **Framework:** React Native + Expo SDK 54
- **Navigation:** React Navigation (native stack + bottom tabs)
- **Theming:** Custom day/night theme with auto time-based switching
- **Auth:** JWT via Spring Boot backend
- **Storage:** expo-file-system for local cache

---

## backend/ — Spring Boot API

```bash
cd backend
JAVA_HOME=/Users/harshshaw/Library/Java/JavaVirtualMachines/jbr-21/Contents/Home \
  mvn spring-boot:run
```

- **Framework:** Spring Boot 3.3 / Java 21
- **Auth:** JWT (JJWT, HS384, 24h expiry)
- **Database:** PostgreSQL via Spring Data JPA
- **Port:** `8080` — API base: `http://localhost:8080/api`

See [backend/DB_COMMANDS.md](backend/DB_COMMANDS.md) for database queries.
See [backend/AWS_DEPLOYMENT.md](backend/AWS_DEPLOYMENT.md) for deployment guide.

---

## terraform/ — AWS Infrastructure

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
# Fill in db_password and jwt_secret in terraform.tfvars

terraform init
terraform plan
terraform apply
```

Provisions:
- **VPC** with public + private subnets across 2 AZs
- **EC2** (t3.small) running the Spring Boot JAR
- **RDS PostgreSQL** (db.t3.micro) in private subnet

---

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/auth/register` | Public | Sign up |
| POST | `/auth/login` | Public | Sign in → JWT |
| GET | `/users/me/profile` | Bearer | Get onboarding profile |
| PUT | `/users/me/profile` | Bearer | Save onboarding profile |
| POST | `/reflections` | Bearer | Save morning reflection |
| GET | `/reflections/today` | Bearer | Today's reflection + scores |
| GET | `/reflections/history` | Bearer | All past reflections |

---

## Environment Variables

### Backend
| Variable | Description |
|----------|-------------|
| `DB_HOST` | Postgres host (default: localhost) |
| `DB_USERNAME` | Postgres user |
| `DB_PASSWORD` | Postgres password |
| `JWT_SECRET` | JWT signing key (32+ chars) |

### UI
Update `ui/lib/apiClient.ts`:
```ts
// Simulator
export const API_BASE = 'http://127.0.0.1:8080/api';

// Physical device (Expo Go) — use Mac's LAN IP
export const API_BASE = 'http://192.168.29.102:8080/api';

// Production
export const API_BASE = 'https://api.karmana.app/api';
```
