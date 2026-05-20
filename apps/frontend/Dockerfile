# 1. Build Stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# We use Vite to build the static production assets
RUN npm run build

# 2. Production Server Stage (NGINX)
FROM nginx:alpine
# Copy the built React app to NGINX's web root
COPY --from=builder /app/dist /usr/share/nginx/html
# Copy custom NGINX config if needed (we'll use default for now, routing falls back to index.html for React Router)
RUN echo 'server { listen 80; location / { root /usr/share/nginx/html; index index.html; try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
