import Elysia from "elysia";

export const todoRoute = () => {
  return new Elysia({ prefix: "/todos" });
};
