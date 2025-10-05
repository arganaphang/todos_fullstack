import Elysia from "elysia";
import { TodoService } from "~/services/todo_service";

export const todoRoute = (todoService: TodoService) => {
  return new Elysia({ prefix: "/todos", tags: ["Todo"] })
    .get("/", () => {
      return { message: "unimplemented" };
    })
    .get("/:id", () => {
      return { message: "unimplemented" };
    })
    .put("/:id", () => {
      return { message: "unimplemented" };
    })
    .post("/", () => {
      return { message: "unimplemented" };
    })
    .delete("/:id", () => {
      return { message: "unimplemented" };
    });
};
