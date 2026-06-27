# Karmana – Database Quick Reference

## Connect

```bash
# Interactive psql session
psql karmana

# Run a single query and exit
psql karmana -c "<query>"
```

---

## Tables

| Table | Purpose |
|-------|---------|
| `users` | Accounts (name, email, BCrypt password, role) |
| `user_profiles` | Onboarding data (age, height, weight, goals…) |
| `user_goals` | Goals list linked to each profile |
| `morning_reflections` | Daily mood / energy / sleep entries |
| `subscriptions` | Plan (FREE / MONTHLY / YEARLY / LIFETIME) per user |

```bash
# List all tables
psql karmana -c "\dt"

# Describe columns of a specific table
psql karmana -c "\d users"
psql karmana -c "\d user_profiles"
psql karmana -c "\d morning_reflections"
```

---

## Users

```bash
# All users
psql karmana -c "SELECT id, name, email, role, created_at FROM users;"

# Find a specific user by email
psql karmana -c "SELECT * FROM users WHERE email = 'you@example.com';"

# Count total users
psql karmana -c "SELECT COUNT(*) FROM users;"

# Delete a test user (by email)
psql karmana -c "DELETE FROM users WHERE email = 'test@karmana.com';"
```

---

## User Profiles (Onboarding)

```bash
# All profiles
psql karmana -c "SELECT u.name, u.email, p.age, p.gender, p.occupation, p.height_cm, p.weight_kg, p.activity_level FROM user_profiles p JOIN users u ON u.id = p.user_id;"

# Goals for all users
psql karmana -c "SELECT u.name, g.goal FROM user_goals g JOIN user_profiles p ON p.id = g.profile_id JOIN users u ON u.id = p.user_id;"

# Check if a user has completed onboarding
psql karmana -c "SELECT u.email, CASE WHEN p.id IS NOT NULL THEN 'Yes' ELSE 'No' END AS onboarded FROM users u LEFT JOIN user_profiles p ON p.user_id = u.id;"
```

---

## Morning Reflections

```bash
# All reflections (newest first)
psql karmana -c "SELECT u.name, r.reflection_date, r.mood, r.energy, r.sleep, r.notes FROM morning_reflections r JOIN users u ON u.id = r.user_id ORDER BY r.reflection_date DESC;"

# Today's reflections
psql karmana -c "SELECT u.name, r.mood, r.energy, r.sleep FROM morning_reflections r JOIN users u ON u.id = r.user_id WHERE r.reflection_date = CURRENT_DATE;"

# Reflections for a specific user
psql karmana -c "SELECT r.reflection_date, r.mood, r.energy, r.sleep, r.notes FROM morning_reflections r JOIN users u ON u.id = r.user_id WHERE u.email = 'you@example.com' ORDER BY r.reflection_date DESC;"
```

---

## Subscriptions

```bash
# All subscriptions
psql karmana -c "SELECT u.name, u.email, s.plan, s.status, s.expires_at FROM subscriptions s JOIN users u ON u.id = s.user_id;"

# Active paid subscribers
psql karmana -c "SELECT u.name, u.email, s.plan FROM subscriptions s JOIN users u ON u.id = s.user_id WHERE s.plan != 'FREE' AND s.status = 'ACTIVE';"
```

---

## Useful psql Shell Commands

Open an interactive session with `psql karmana`, then:

| Command | Description |
|---------|-------------|
| `\dt` | List all tables |
| `\d <table>` | Describe columns of a table |
| `\x` | Toggle expanded (vertical) output — useful for wide rows |
| `\timing` | Show query execution time |
| `\l` | List all databases |
| `\q` | Quit |

---

## Start / Stop Postgres

```bash
brew services start postgresql@16
brew services stop postgresql@16
brew services restart postgresql@16

# Check status
brew services list | grep postgres
```

---

## Start Backend Server

```bash
cd /Applications/YogicWellness/backend

JAVA_HOME=/Users/harshshaw/Library/Java/JavaVirtualMachines/jbr-21/Contents/Home \
  mvn spring-boot:run
```

> **Tip:** Add `export JAVA_HOME=...` to `~/.zshrc` to avoid typing it every time.
