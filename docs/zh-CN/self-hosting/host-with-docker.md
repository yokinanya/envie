> 如果你在部署过程中遇到问题，可以发邮件联系我们：<support@envie.cloud>

Envie 已发布到 Docker Hub。要进行自托管部署，你需要下面两个镜像：

- [envie-api](https://hub.docker.com/r/salhdev/envie-api)
- [envie-web](https://hub.docker.com/r/salhdev/envie-web)

对于普通的自托管部署，请同时为 API 和 Web 容器设置 `BILLING_ENABLED=false`。关闭计费后，组织创建、邀请成员以及其他协作功能都可以在没有 Stripe 的情况下使用。

其他前置条件：

- 一个 PostgreSQL 实例，16.x 或 17.x 版本都可以
- 一个 Redis 实例
- 一个 GitHub OAuth 应用（用于登录）。创建方式参见 <https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app>

首先，从 Docker Hub 拉取这两个镜像：

```bash
docker pull salhdev/envie-api:latest && \
docker pull salhdev/envie-web:latest
```

然后启动容器。

启动 API：

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
salhdev/envie-api:latest
```

API 必需的环境变量：

- `JWT_SECRET`：用于登录 Cookie 和 JWT 的签名密钥
- `DATABASE_URL`：PostgreSQL 连接串
- `REDIS_CONNECTION_STRING`：Redis 连接串
- `PORT`：容器内 API 监听端口，通常是 `3001`
- `GITHUB_CLIENT_ID`：GitHub OAuth 应用的 Client ID
- `GITHUB_CLIENT_SECRET`：GitHub OAuth 应用的 Client Secret
- `GITHUB_CALLBACK_URL`：API 对外暴露的回调地址，例如 `https://api.example.com/auth/github/callback`
- `FRONTEND_URL`：Web 应用的公开访问地址，例如 `https://envie.example.com`
- `APP_DOMAIN`：浏览器侧共享 Cookie 的域名，不带协议和端口，例如 `localhost` 或 `example.com`
- `BILLING_ENABLED`：普通自托管部署请设置为 `false`

关于 GitHub OAuth 应用的创建方式，参见：<https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app>

你可以通过健康检查接口确认 API 是否已经正常启动：

```bash
curl http://localhost:3001/health
```

然后启动 Web 客户端：

```bash
docker run -p 80:3000 \
-e API_URL="http://localhost:3001" \
-e JWT_SECRET=<same-as-api> \
-e DATABASE_URL=<same-as-api> \
-e BILLING_ENABLED=false \
salhdev/envie-web:latest
```

Web 必需的环境变量：

- `API_URL`：API 的公开访问地址，例如 `https://api.example.com`
- `JWT_SECRET`：与 API 容器保持一致
- `DATABASE_URL`：与 API 使用同一个 PostgreSQL 连接串
- `BILLING_ENABLED`：普通自托管部署请设置为 `false`

Web 可选的环境变量：

- `NEXT_PUBLIC_API_URL`：通常不需要手动设置。如果省略，容器入口脚本会自动把 `API_URL` 复制到这里
- `APP_URL`：仅在 `BILLING_ENABLED=true` 时需要，用于 Stripe Checkout 和账单门户的返回地址
- `STRIPE_SECRET_KEY`：仅在 `BILLING_ENABLED=true` 时需要
- `STRIPE_TEAM_PRICE_ID`：仅在 `BILLING_ENABLED=true` 时需要
- `GOOGLE_ANALYTICS_ID`：可选的分析集成

### 使用 Nginx 反向代理同域名下的 `/api`

如果你希望用户通过同一个域名访问 Web 和 API，例如：

- `https://example.com/` -> `envie-web:3000`
- `https://example.com/api/...` -> `envie-api:3001/...`

可以使用下面的 Nginx 配置：

```nginx
location /api/ {
    rewrite ^/api/(.*)$ /$1 break;
    proxy_pass http://envie-api:3001;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}

location / {
    proxy_pass http://envie-web:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

这里的 `rewrite` 很重要，因为 API 服务本身监听的是 `/auth/github/callback`、`/health` 这类原始路径，并不知道外部还有 `/api` 这个前缀。

在这种部署方式下，建议使用下面这组环境变量：

```env
FRONTEND_URL=https://example.com
APP_DOMAIN=example.com
API_URL=https://example.com/api
NEXT_PUBLIC_API_URL=https://example.com/api
GITHUB_CALLBACK_URL=https://example.com/api/auth/github/callback
```

说明：

- `FRONTEND_URL` 应该始终填写用户实际访问 Web 的地址，也就是不带 `/api` 的站点地址
- `APP_DOMAIN` 只填写 Cookie 共享域名，例如 `example.com`
- `API_URL` 和 `NEXT_PUBLIC_API_URL` 都应该指向 Nginx 暴露出来的 API 地址，也就是带 `/api` 前缀的公开地址
- `GITHUB_CALLBACK_URL` 也必须使用公开可访问的地址，因此这里要写成 `/api/auth/github/callback`

如果你当前使用的是：

```env
GITHUB_CALLBACK_URL=https://api.example.com/api/auth/github/callback
NEXT_PUBLIC_API_URL=https://api.example.com/api
```

那么只有在你的站点本身就是通过 `https://api.example.com` 这个域名对外提供服务，并且仍然保留 `/api` 这个路径前缀时，这样写才是正确的。

如果实际对外访问 Web 的地址是 `https://example.com`，而 Nginx 只是把 `https://example.com/api` 反代到 API 容器，那么这些值应该改成：

```env
GITHUB_CALLBACK_URL=https://example.com/api/auth/github/callback
NEXT_PUBLIC_API_URL=https://example.com/api
```

如果你把 Web 应用暴露在不同于 `http://localhost` 的主机名或端口上，请同步更新 API 侧的 `FRONTEND_URL` 和 Web 侧的 `API_URL`，确保它们都使用对外可访问的地址。

全部启动后，你应该可以在浏览器中打开 <http://localhost:80> 访问应用。
