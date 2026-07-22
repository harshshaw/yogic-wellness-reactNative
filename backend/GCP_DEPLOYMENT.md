# Karmana – GCP Deployment Guide (Cloud Run + Cloud SQL)

Deploys the Spring Boot backend to Cloud Run with a managed Postgres database.
The AWS setup in `terraform/` is untouched and still valid — this is a parallel
target, not a migration.

**Status: deployed and verified 2026-07-22.** Live at
`https://karmana-backend-894590249756.europe-west1.run.app`. The steps below are
the corrected order that actually worked — see *Gotchas* at the bottom for the
four things that failed on the first pass and why.

```
Mobile App (Expo / React Native)
            ↓  HTTPS
      Cloud Run  (Spring Boot container, autoscaling, TLS included)
            ↓  unix socket (no public IP on the DB)
   Cloud SQL – PostgreSQL 16
```

| Service | Purpose |
|---|---|
| **Cloud Run** | Runs the container; provides HTTPS + autoscaling |
| **Cloud SQL (Postgres)** | Managed production database |
| **Artifact Registry** | Stores the container image |
| **Cloud Build** | Builds the image (no local Docker needed) |
| **Secret Manager** | Holds `JWT_SECRET` and the DB password |

---

## Live configuration

| Setting | Value |
|---|---|
| Project | `karmana-prod` (org `286638272116`) |
| Region | `europe-west1` |
| Cloud SQL instance | `karmana-db` — Postgres 16, **Enterprise** edition, `db-f1-micro`, backups 03:00 |
| Connection name | `karmana-prod:europe-west1:karmana-db` |
| Cloud Run service | `karmana-backend` — 1 vCPU / 1 GiB, `min-instances=0` |
| Image | `europe-west1-docker.pkg.dev/karmana-prod/karmana/karmana-backend:v1` |
| Secrets | `db-password`, `jwt-secret` |

Set these once — every command below reuses them:

```bash
export PROJECT_ID=karmana-prod
export REGION=europe-west1
export INSTANCE=karmana-db
export SERVICE=karmana-backend
export CONN_NAME=$PROJECT_ID:$REGION:$INSTANCE
```

---

## Step 0 – CLI and project

```bash
brew install --cask google-cloud-sdk
gcloud auth login
gcloud config set project $PROJECT_ID
```

Billing must be linked before Cloud SQL will provision:

```bash
gcloud billing projects link $PROJECT_ID --billing-account=<ACCOUNT_ID>
```

## Step 1 – Enable the APIs

```bash
gcloud services enable \
  run.googleapis.com \
  sqladmin.googleapis.com \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com \
  secretmanager.googleapis.com
```

## Step 2 – Grant service-account permissions **(do this early)**

New GCP projects grant the Compute Engine default service account **no roles**.
It is used both by Cloud Build and as the Cloud Run runtime identity, so nothing
works until these are in place. Doing this before the build and deploy avoids two
separate failures.

```bash
export PROJECT_NUM=$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')
export SA=$PROJECT_NUM-compute@developer.gserviceaccount.com

for ROLE in \
  roles/cloudbuild.builds.builder \
  roles/secretmanager.secretAccessor \
  roles/cloudsql.client
do
  gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$SA" --role="$ROLE" --condition=None
done
```

## Step 3 – Create the database

`--edition=ENTERPRISE` is **required**: Postgres 16 now defaults to Enterprise
Plus, which rejects shared-core tiers like `db-f1-micro` with a 400.

```bash
gcloud sql instances create $INSTANCE \
  --database-version=POSTGRES_16 \
  --edition=ENTERPRISE \
  --tier=db-f1-micro \
  --region=$REGION \
  --storage-auto-increase \
  --backup-start-time=03:00

gcloud sql databases create karmana --instance=$INSTANCE
```

Takes ~10 minutes. Then create the user and store the password without it ever
touching your terminal history:

```bash
openssl rand -base64 32 | tr -d '\n' > /tmp/.dbpw
gcloud sql users create karmana --instance=$INSTANCE --password="$(cat /tmp/.dbpw)"
gcloud secrets create db-password --data-file=/tmp/.dbpw
rm -f /tmp/.dbpw

printf '%s' "$(openssl rand -base64 48)" | gcloud secrets create jwt-secret --data-file=-
```

## Step 4 – Build and push the image

```bash
gcloud artifacts repositories create karmana \
  --repository-format=docker --location=$REGION

cd /Applications/YogicWellness/backend
gcloud builds submit --region=$REGION \
  --tag $REGION-docker.pkg.dev/$PROJECT_ID/karmana/$SERVICE:v1
```

Cloud Build runs the `Dockerfile` server-side, so no local Docker daemon is
required. `.gcloudignore` keeps `target/` out of the upload — `.dockerignore`
does **not** apply to `gcloud builds submit`.

## Step 5 – Deploy to Cloud Run

The `^@^` prefix sets `@` as the delimiter so the `&` inside the JDBC URL isn't
parsed as a separator.

```bash
gcloud run deploy $SERVICE \
  --image=$REGION-docker.pkg.dev/$PROJECT_ID/karmana/$SERVICE:v1 \
  --region=$REGION \
  --platform=managed \
  --allow-unauthenticated \
  --add-cloudsql-instances=$CONN_NAME \
  --set-env-vars="^@^DB_URL=jdbc:postgresql:///karmana?cloudSqlInstance=$CONN_NAME&socketFactory=com.google.cloud.sql.postgres.SocketFactory@DB_USERNAME=karmana" \
  --set-secrets="DB_PASSWORD=db-password:latest,JWT_SECRET=jwt-secret:latest" \
  --memory=1Gi \
  --cpu=1 \
  --min-instances=0 \
  --timeout=300
```

`--allow-unauthenticated` is correct here: the mobile app authenticates with your
own JWTs and Spring Security guards the routes. It means *no IAM layer in front*,
not "no auth".

`--min-instances=0` keeps Cloud Run within its free tier at current volume, at
the cost of ~10s Spring Boot cold starts. Raise to `1` when cold starts become
user-visible — it's the main always-on cost (~$35–65/mo).

## Step 6 – Allow public access (org policy)

If the org enforces **Domain Restricted Sharing**
(`constraints/iam.allowedPolicyMemberDomains`, the Workspace default), the
`--allow-unauthenticated` flag silently fails with:

> FAILED_PRECONDITION: One or more users named in the policy do not belong to a
> permitted customer, perhaps due to an organization policy.

Add a **project-scoped** exception (requires `roles/orgpolicy.policyAdmin` at the
org level — note that `roles/resourcemanager.organizationAdmin` does *not*
include it):

```bash
cat > /tmp/dsr-exception.yaml <<'YAML'
constraint: constraints/iam.allowedPolicyMemberDomains
listPolicy:
  allValues: ALLOW
YAML

gcloud resource-manager org-policies set-policy /tmp/dsr-exception.yaml --project=$PROJECT_ID

gcloud run services add-iam-policy-binding $SERVICE \
  --region=$REGION --member=allUsers --role=roles/run.invoker
```

The policy change takes **1–3 minutes to propagate** — the invoker binding fails
until it does. Retry rather than assuming it's broken.

> ⚠️ This exception applies to the **whole project**, not just this service —
> anything in `karmana-prod` can now be shared publicly. The rest of the org
> keeps the restriction. Consider revoking `orgpolicy.policyAdmin` once applied.

## Step 7 – Verify

```bash
export URL=$(gcloud run services describe $SERVICE --region=$REGION \
  --format='value(status.url)')

# Full round-trip, no credentials
curl -s -X POST "$URL/api/auth/register" -H 'Content-Type: application/json' \
  -d '{"name":"Test","email":"test@example.com","password":"secret123"}'   # 200 + JWT
curl -s -o /dev/null -w '%{http_code}\n' "$URL/api/users/me/profile"       # 403 (no token)

gcloud run services logs read $SERVICE --region=$REGION --limit=50
```

Note the `/api` prefix — it comes from `server.servlet.context-path` and is part
of every route. The app's base URL is set in `ui/lib/apiClient.ts`.

## Subsequent deploys

```bash
gcloud builds submit --region=$REGION \
  --tag $REGION-docker.pkg.dev/$PROJECT_ID/karmana/$SERVICE:v2
gcloud run deploy $SERVICE \
  --image=$REGION-docker.pkg.dev/$PROJECT_ID/karmana/$SERVICE:v2 --region=$REGION
```

Use a fresh tag each time. Redeploying `:v1` after overwriting it can leave Cloud
Run serving the cached old image.

---

## Gotchas (all four hit on the first deploy)

| Symptom | Cause | Fix |
|---|---|---|
| `Invalid Tier (db-f1-micro) for (ENTERPRISE_PLUS) Edition` | Postgres 16 defaults to Enterprise Plus | `--edition=ENTERPRISE` (Step 3) |
| `does not have storage.objects.get access` on the Cloud Build bucket | New projects grant the compute default SA no roles | `roles/cloudbuild.builds.builder` (Step 2) |
| `Permission denied on secret: .../db-password` during deploy | Secrets resolve **during** deploy, not after | Grant `secretmanager.secretAccessor` **before** deploying (Step 2) |
| `FAILED_PRECONDITION: ...not belong to a permitted customer` | Org policy blocks `allUsers` | Project-scoped policy exception (Step 6) |

Also worth knowing: piping gcloud through `| tail` masks the exit code — a failed
create can look like a success. Redirect to a log file and check `$?` instead.

---

## Before real users

- **`ddl-auto: update`** — `application.yml` lets Hibernate mutate the production
  schema on every boot. It never drops columns, so it silently accumulates dead
  ones, and a bad entity change hits prod directly. Move to Flyway and set
  `ddl-auto: validate` before you have data worth keeping.
- **Delete the smoke-test users** created during verification.
- **CORS** — native Expo doesn't enforce it, but the landing site or Expo web
  would need the Cloud Run origin allowed in `SecurityConfig.java`.
- **Cost** — see `docs/COST_ESTIMATE.md`. Infrastructure is ~$50–75/mo; the AI
  companion dominates the total.
