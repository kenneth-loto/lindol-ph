# Deploy to Render (Docker Web Service)

## Prerequisites

- GitHub repo pushed and accessible to Render
- Render account (free tier works)

## Environment Variables

Set these in Render dashboard → Environment Variables:

| Variable            | Masked | Notes                                                 |
| ------------------- | ------ | ----------------------------------------------------- |
| `USGS_URL`          | ✅     | Value from `.env.example`                             |
| `SENTRY_AUTH_TOKEN` | ✅     | Only if Sentry is configured (see Monitoring section) |

## Build Command

Render's Docker runtime doesn't support `docker build --secret` directly. Use the Build Command field to inject env vars as secret files before the build:

```bash
echo "$USGS_URL" > /tmp/usgs_url && docker build --secret id=usgs_url,src=/tmp/usgs_url .
```

### Extending for Sentry (future)

When Sentry is added, append the additional secret:

```bash
echo "$USGS_URL" > /tmp/usgs_url && echo "$SENTRY_AUTH_TOKEN" > /tmp/sentry_auth_token && docker build --secret id=usgs_url,src=/tmp/usgs_url --secret id=sentry_auth_token,src=/tmp/sentry_auth_token .
```

Each new secret follows the same `echo "$VAR" > /tmp/file && ... --secret id=name,src=/tmp/file` pattern.

## Steps

1. In Render dashboard: **New +** → **Web Service** → **Connect your GitHub repo**
2. **Runtime:** Select **Docker**
3. **Build Command:** Paste the command from above
4. **Start Command:** Leave blank (defined in `CMD` in Dockerfile)
5. **Plan:** Free
6. Add environment variables (table above)
7. Click **Deploy Web Service**

## URL

After deploy, Render provides `https://<service-name>.onrender.com`.

## Auto-Deploy

Render auto-deploys on every push to the connected branch by default. To disable: Settings → Auto-Deploy → toggle off.

## Monitoring (Sentry — future)

When Sentry is added:

1. Add `SENTRY_AUTH_TOKEN` to Render env vars (masked)
2. Append it to the Build Command (see above)
3. The Dockerfile's `ARG SENTRY_AUTH_TOKEN` + `ENV SENTRY_AUTH_TOKEN=$SENTRY_AUTH_TOKEN` will pick it up during `bun run build`
