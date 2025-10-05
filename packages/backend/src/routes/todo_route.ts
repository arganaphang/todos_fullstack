import Elysia, { t } from "elysia";
import { TodoService } from "~/services/todo_service";

export const todoRoute = (todoService: TodoService) => {
  return new Elysia({ prefix: "/todos", tags: ["Todo"] })
    .get(
      "/",
      async ({ status }) => {
        try {
          const todos = await todoService.findAll();
          return status(200, { message: "get all todo", data: todos });
        } catch (e) {
          // TODO: Add Log
          return status(400, { message: "failed to get all todo" }); // TODO: Fix Status Code
        }
      },
      {
        detail: {
          summary: "Get All",
          description: "Get all todo",
        },
      }
    )
    .get(
      "/:id",
      async ({ params: { id }, status }) => {
        try {
          const todo = await todoService.findByID(id);
          return status(200, { message: "get todo by id", data: todo });
        } catch (e) {
          // TODO: Add Log
          return status(400, { message: "failed to get todo by id" }); // TODO: Fix Status Code
        }
      },
      {
        detail: {
          summary: "Get by ID",
          description: "Get todo by ID",
        },
        params: t.Object({
          id: t.Number(), // Validation Path Parameter
        }),
      }
    )
    .put(
      "/:id",
      async ({ params: { id }, body, status }) => {
        try {
          const todo = await todoService.update(id, {
            title: body.title,
            completed: body.completed,
          });
          return status(201, { message: "todo created", data: todo });
        } catch (e) {
          // TODO: Add Log
          return status(400, { message: "failed to create new todo" }); // TODO: Fix Status Code
        }
      },
      {
        detail: {
          summary: "Update by ID",
          description: "Update todo by ID",
        },
        params: t.Object({
          id: t.Number(), // Validation Path Parameter
        }),
        body: t.Object({
          title: t.String(),
          completed: t.Boolean(),
        }),
      }
    )
    .post(
      "/",
      async ({ body, status }) => {
        try {
          const todo = await todoService.create(body.title, body.user_id);
          return status(201, { message: "todo created", data: todo });
        } catch (e) {
          // TODO: Add Log
          return status(400, { message: "failed to create new todo" }); // TODO: Fix Status Code
        }
      },
      {
        detail: {
          summary: "Create Todo",
          description: "Create new todo",
        },
        body: t.Object({
          title: t.String(),
          user_id: t.Number(),
        }),
      }
    )
    .delete(
      "/:id",
      async ({ params: { id }, status }) => {
        try {
          await todoService.findByID(id);
          return status(200, { message: "delete todo by id", data: null });
        } catch (e) {
          // TODO: Add Log
          return status(400, { message: "failed to delete todo by id" }); // TODO: Fix Status Code
        }
      },
      {
        detail: {
          summary: "Delete by ID",
          description: "Delete todo by ID",
        },
        params: t.Object({
          id: t.Number(), // Validation Path Parameter
        }),
      }
    );
};
