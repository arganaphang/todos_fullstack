FROM oven/bun:1 AS base
WORKDIR /usr/src/app
ARG VITE_BASE_URL=""
ENV VITE_BASE_URL=${VITE_BASE_URL}
COPY . .
RUN bun install --frozen-lockfile
RUN bun run build

FROM caddy:alpine AS release
WORKDIR /usr/src/app
COPY --from=base /usr/src/app/dist /usr/src/app/
EXPOSE 80
ENTRYPOINT [ "caddy", "file-server", "--root", "/usr/src/app" ]