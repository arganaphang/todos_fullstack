import { Elysia } from "elysia";

const app = new Elysia().get("/health", () => ({ message: "OK" })).listen(3000);

// Initiate Dependencies

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
