# Karmana – AWS Deployment Guide

## Architecture

```
Mobile App (Expo / React Native)
            ↓
    AWS API Gateway (optional)
            ↓
  EC2 / Elastic Beanstalk
    (Spring Boot JAR)
            ↓
    RDS – PostgreSQL
    (managed, auto-backups)
```

---

## Services Used

| Service | Purpose |
|---------|---------|
| **EC2 / Elastic Beanstalk** | Runs the Spring Boot backend |
| **RDS (PostgreSQL)** | Managed production database |
| **S3** (future) | Store user uploads / audio files |
| **API Gateway** (optional) | Rate limiting, custom domain routing |
| **ACM** | Free SSL certificate for HTTPS |
| **Route 53** (optional) | Custom domain e.g. `api.karmana.app` |

---

## Step 1 – Build the JAR

```bash
cd /Applications/YogicWellness/backend
mvn clean package -DskipTests

# Output: target/karmana-backend-0.0.1-SNAPSHOT.jar
```

---

## Step 2 – Set Up RDS (PostgreSQL)

1. Go to **AWS Console → RDS → Create database**
2. Choose:
   - Engine: **PostgreSQL**
   - Template: **Free tier** (or Production for live)
   - DB instance: `db.t3.micro` (free tier) / `db.t3.small` (paid)
   - DB name: `karmana`
   - Username: `karmana`
   - Password: `<strong password>`
3. Under **Connectivity** → make sure it's in the same VPC as your EC2
4. Save the **endpoint URL** — looks like:
   ```
   karmana.xxxxxxxxxxxx.us-east-1.rds.amazonaws.com
   ```

---

## Step 3 – Deploy to Elastic Beanstalk (Easiest)

### One-time setup
```bash
# Install EB CLI
pip install awsebcli

# Inside backend folder
cd /Applications/YogicWellness/backend
eb init karmana-backend --platform java --region us-east-1
eb create karmana-prod
```

### Set environment variables on AWS (never hardcode in yml)
```bash
eb setenv \
  DB_USERNAME=karmana \
  DB_PASSWORD=yourprodpassword \
  JWT_SECRET=your-32-char-production-secret-key
```

### Deploy
```bash
eb deploy
```

### View logs
```bash
eb logs
```

---

## Step 4 – Update application.yml for Production

Only the datasource URL changes. Everything else stays the same:

```yaml
# Local
url: jdbc:postgresql://localhost:5432/karmana

# AWS RDS (set via environment variable)
url: jdbc:postgresql://${DB_HOST}:5432/karmana
```

Add `DB_HOST` to your EB environment:
```bash
eb setenv DB_HOST=karmana.xxxxxxxxxxxx.us-east-1.rds.amazonaws.com
```

---

## Step 5 – Update API URL in the App

Once the backend is live on AWS, update [lib/apiClient.ts](../lib/apiClient.ts):

```ts
// Development (local)
export const API_BASE = 'http://192.168.29.102:8080/api';

// Production (AWS)
export const API_BASE = 'https://api.karmana.app/api';
```

---

## Estimated AWS Cost

| Service | Spec | Cost |
|---------|------|------|
| EC2 / Beanstalk | t3.small | ~$15/month |
| RDS PostgreSQL | db.t3.micro | ~$15/month |
| Data transfer | ~10 GB/month | ~$1/month |
| **Total** | | **~$30/month** |

> **Free tier:** New AWS accounts get EC2 t2.micro + RDS db.t3.micro free for **12 months**.

---

## Security Checklist Before Going Live

- [ ] Change `JWT_SECRET` to a random 32+ character string
- [ ] Use a strong RDS password (not `karmana`)
- [ ] RDS should **not** be publicly accessible — only allow EC2 security group
- [ ] Enable HTTPS — attach an SSL cert via **AWS ACM** (free)
- [ ] Set `spring.jpa.hibernate.ddl-auto=validate` in production (not `update`)
- [ ] Enable RDS **automated backups** (7–35 day retention)
- [ ] Remove `spring-boot-devtools` dependency for prod build

---

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `DB_HOST` | RDS endpoint | `karmana.xxx.us-east-1.rds.amazonaws.com` |
| `DB_USERNAME` | DB user | `karmana` |
| `DB_PASSWORD` | DB password | `StrongPassword123!` |
| `JWT_SECRET` | JWT signing key (min 32 chars) | `karmana-prod-secret-xxxxxxxxxxxxx` |

---

## Quick Reference Commands

```bash
# Build JAR
mvn clean package -DskipTests

# Deploy to Beanstalk
eb deploy

# Check running status
eb status

# SSH into EC2 instance
eb ssh

# View live logs
eb logs --all

# Open app in browser
eb open
```

---

## Local vs Production Config

| | Local | AWS Production |
|-|-------|---------------|
| Database | `localhost:5432` | RDS endpoint |
| Auth | JWT (same) | JWT (same) |
| API URL | `http://192.168.29.102:8080` | `https://api.karmana.app` |
| DDL auto | `update` | `validate` |
| Devtools | enabled | disabled |
| HTTPS | no | yes (ACM) |
