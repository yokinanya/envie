> Having trouble with setup? Don't hesitate to reach out for support via email: <support@envie.cloud>

Envie is available on Docker Hub. To self-host, you need these two images:

- [envie-api](https://hub.docker.com/r/yokinanya/envie-api)
- [envie-web](https://hub.docker.com/r/yokinanya/envie-web)

For a normal self-hosted deployment, set `BILLING_ENABLED=false` for both the API and web containers. With billing disabled, organization creation, invitations, and other collaboration features are available without Stripe.

Other prerequisites:
- A PostgreSQL instance, versions 16.x or 17.x should be fine
- A Redis instance
- GitHub OAuth application (this is used for login). For a guide on how to create one, see <https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app>

To get started, pull the two docker images from the Docker Hub registry:

```bash
docker pull yokinanya/envie-api:latest && \
docker pull yokinanya/envie-web:latest
```

Next, start the containers.

To start the API, run:

```bash
docker run -p 3001:3001 \
-e JWT_SECRET=<your-secret> \
-e DATABASE_URL=<your-postgresql-url> \
-e REDIS_CONNECTION_STRING=<your-redis-connection> \
-e PORT=3001 \
-e GITHUB_CLIENT_ID=<client_id> \
-e GITHUB_CLIENT_SECRET=<client_secret> \
-e GITHUB_CALLBACK_URL="http://localhost:3001/auth/github/callback" \
-e FRONTEND_URL="http://localhost" \
-e APP_DOMAIN="localhost" \
-e BILLING_ENABLED=false \
yokinanya/envie-api:latest
```

Required API environment variables:

- `JWT_SECRET`: signing key for login cookies and JWTs
- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_CONNECTION_STRING`: Redis connection string
- `PORT`: API port inside the container, usually `3001`
- `GITHUB_CLIENT_ID`: GitHub OAuth app client ID
- `GITHUB_CLIENT_SECRET`: GitHub OAuth app client secret
- `GITHUB_CALLBACK_URL`: public callback URL for the API, for example `https://api.example.com/auth/github/callback`
- `FRONTEND_URL`: public URL of the web app, for example `https://envie.example.com`
- `APP_DOMAIN`: cookie domain shared by the browser-facing app, without scheme or port, for example `localhost` or `example.com`
- `BILLING_ENABLED`: set to `false` for a normal self-hosted deployment

To learn how to configure a GitHub OAuth application, see: <https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app>

You can verify that your API is running by pinging the healthcheck endpoint:

```bash
curl http://localhost:3001/health
```

Then start the web Client:

```bash
docker run -p 80:3000 \
-e API_URL="http://localhost:3001" \
-e JWT_SECRET=<same-as-api> \
-e DATABASE_URL=<same-as-api> \
-e BILLING_ENABLED=false \
yokinanya/envie-web:latest
```

Required web environment variables:

- `API_URL`: public URL of the API, for example `https://api.example.com`
- `JWT_SECRET`: same value as the API container
- `DATABASE_URL`: same PostgreSQL connection string as the API container
- `BILLING_ENABLED`: set to `false` for a normal self-hosted deployment

Optional web environment variables:

- `NEXT_PUBLIC_API_URL`: normally not needed. If omitted, the container entrypoint copies `API_URL` into it automatically.
- `APP_URL`: only needed when `BILLING_ENABLED=true`, used for Stripe checkout and billing portal return URLs
- `STRIPE_SECRET_KEY`: only needed when `BILLING_ENABLED=true`
- `STRIPE_TEAM_PRICE_ID`: only needed when `BILLING_ENABLED=true`
- `GOOGLE_ANALYTICS_ID`: optional analytics integration

If you expose the web app on a different host or port than `http://localhost`, update both `FRONTEND_URL` on the API side and `API_URL` on the web side to match your public URLs.

Once it's running, you should be able to open it in your browser at <http://localhost:80>.
