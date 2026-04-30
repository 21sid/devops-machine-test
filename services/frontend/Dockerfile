# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app

COPY src/ ./src/

# Stage 2: Production with Nginx
FROM nginx:1.25-alpine

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /usr/share/nginx/html

COPY --from=builder /app/src/ ./

# FIX: nginx must listen on 8080 for non-root users in AKS
RUN sed -i 's/listen       80;/listen 8080;/' /etc/nginx/conf.d/default.conf

# FIX permissions (VERY IMPORTANT for AKS)
RUN chown -R appuser:appgroup /usr/share/nginx/html \
    && chown -R appuser:appgroup /var/cache/nginx \
    && chown -R appuser:appgroup /var/log/nginx \
    && chown -R appuser:appgroup /var/run

USER appuser

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:8080/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
