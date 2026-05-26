# Fortune Demo Site (GitHub Pages + Railway)

这个项目是一个可演示的最小全栈模板：
- `frontend/`：静态前端，可部署到 GitHub Pages
- `backend/`：Node.js + Express API，可部署到 Railway
- 数据库：MySQL/MariaDB（本地、Railway 或 VPS 都可）

## 项目文档

- 进度管理：`PROGRESS.md`

## 1) 启动后端

```bash
cd backend
npm install
cp .env.example .env
```

编辑 `.env`（至少填好数据库连接和 JWT 密钥），然后：

```bash
npm run dev
```

默认监听 `http://localhost:8080`。

## 2) 打开前端

前端是纯静态页，直接打开 `frontend/index.html` 即可。  
默认 API 地址是 `http://localhost:8080`。

如果你后端部署到了 Railway，请在浏览器控制台执行：

```js
localStorage.setItem("API_BASE", "https://your-backend.up.railway.app");
location.reload();
```

## 3) GitHub Pages 部署前端

1. 将仓库推送到 GitHub
2. 打开仓库 `Settings` -> `Pages`
3. Source 选择 `Deploy from a branch`
4. Branch 选择 `main`，文件夹选择 `/frontend`
5. 保存后会得到 GitHub Pages URL

## 4) Railway 部署后端

1. 在 Railway 新建项目并连接这个 GitHub 仓库
2. 选择 `backend` 目录作为服务根目录
3. 配置环境变量：
   - `PORT=8080`
   - `JWT_SECRET=...`
   - `DB_HOST=...`
   - `DB_PORT=3306`
   - `DB_USER=...`
   - `DB_PASSWORD=...`
   - `DB_NAME=...`
   - `ALLOWED_ORIGIN=https://<your-github-pages-domain>`
4. 启动命令用 `npm start`

## API 概览

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/me` (Bearer token)
- `POST /api/orders` (Bearer token)
- `GET /api/orders` (Bearer token)

## 数据表

后端启动时会自动创建：
- `users`
- `orders`

后续你可以继续扩展：
- `payments`
- `admin_users`
- `order_status_logs`
