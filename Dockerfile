# Build stage
FROM docker.io/node:16-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Runtime: nginx de Red Hat (puerto 8080, usuario no root — compatible con OpenShift)
FROM registry.redhat.io/ubi9/nginx-120
COPY --chown=1001:0 nginx-spa.conf /opt/app-root/etc/nginx.default.d/spa.conf
COPY --chown=1001:0 --from=build /app/dist/who-is-that-pokemon /opt/app-root/src
EXPOSE 8080
CMD ["/usr/libexec/s2i/run"]
