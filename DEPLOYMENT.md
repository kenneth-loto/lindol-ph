# Deploy

## How it works

Push to `main` → GitHub Actions (`deploy.yml`) builds the Docker image with BuildKit secrets, pushes to GHCR, then triggers Render to pull and deploy.

The Dockerfile uses `--mount=type=secret` — secrets exist only during the builder `RUN` step, never in image layers or the runner stage.

## GitHub Secrets

Set these in **GitHub → Settings → Secrets and variables → Actions**:

| Secret                   | Required | Notes                                          |
| ------------------------ | -------- | ---------------------------------------------- |
| `USGS_URL`               | ✅       |                                                |
| `FDSN_BASE_URL`          | ✅       |                                                |
| `SENTRY_AUTH_TOKEN`      | ✅       | Sentry source map upload auth token            |
| `NEXT_PUBLIC_SENTRY_DSN` | ✅       | Sentry DSN for client-side error reporting     |
| `NEXT_PUBLIC_SITE_URL`   | ✅       | Used by CI build; should match production URL  |
| `RENDER_DEPLOY_HOOK`     | ✅       | From Render dashboard → Settings → Deploy Hook |

## Render Setup

### 1. Create Deploy Hook

Render Dashboard → **Your Service** → **Settings** → **Deploy Hook** → generate a hook URL. Add it as `RENDER_DEPLOY_HOOK` in GitHub Secrets.

### 2. Switch to Existing Image

Render Dashboard → **Your Service** → **Settings** → **Service** → **Source**:

- **Source:** Select **Existing Image**
- **Image:** `ghcr.io/kenneth-loto/lindol-ph:latest`
- **Registry:** GitHub Container Registry (GHCR)

### 3. GHCR Credentials

Render needs a token to pull a private GHCR image:

1. GitHub → **Settings → Developer settings → Personal access tokens → Tokens (classic)**
2. Create a token with scope `read:packages`
3. Render Dashboard → **Your Service** → **Settings** → **Registry Credentials**
4. Add:
   - **Username:** `kenneth-loto`
   - **Password:** (the PAT you just created)

Alternatively, make the package **public** (no credentials needed):

- After first push to GHCR, go to **github.com → Packages → lindol-ph → Package settings → Change visibility → Public**

### 4. Environment Variables (Runtime)

Render Dashboard → **Your Service** → **Environment Variables**:

| Variable                 | Masked |
| ------------------------ | ------ |
| `PORT`                   | No     |
| `NODE_ENV`               | No     |
| `USGS_URL`               | ✅     |
| `FDSN_BASE_URL`          | ✅     |
| `SENTRY_AUTH_TOKEN`      | ✅     |
| `NEXT_PUBLIC_SENTRY_DSN` | ✅     |
| `NEXT_PUBLIC_SITE_URL`   | No     |

(`PORT` and `NODE_ENV` are already baked into the Dockerfile; override only if needed.)

## Trigger a Deploy

Push to `main`:

```bash
git push origin main
```

Or trigger manually from **GitHub → Actions → Deploy → Run workflow**.

## URL

After deploy, Render provides `https://<service-name>.onrender.com`.

## Local Build (same Dockerfile)

```bash
docker compose build
docker compose up
```
