# Frontend Dockerfile (Vite + Nginx)

# 1) Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./
RUN npm ci || npm install
COPY . .
RUN npm run build

# 2) Nginx serve stage
FROM nginx:1.27-alpine
COPY --from=builder /app/dist /usr/share/nginx/html

# Add a default nginx config that can proxy /api to backend
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Environment variable for API base URL can be baked into the app at build time via VITE_API_URL
# For docker-compose, prefer networking: frontend -> backend via service name.
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

