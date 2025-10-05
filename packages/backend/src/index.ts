import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { openapi } from "@elysiajs/openapi";
import { todoRoute } from "~/routes/todo_route";
import { TodoRepositoryImpl } from "./repositories/impl/todo_repository_impl";
import { TodoServiceImpl } from "./services/impl/todo_service_impl";

const todoRepository = new TodoRepositoryImpl();
const todoService = new TodoServiceImpl(todoRepository);

const app = new Elysia()
  .use(
    openapi({
      documentation: {
        tags: [
          { name: "Health", description: "Health check endpoint" },
          { name: "Todo", description: "Todo endpoints" },
        ],
      },
    })
  )
  .use(cors())
  .use(todoRoute(todoService))
  .get("/health", () => ({ message: "OK" }), { detail: { tags: ["Health"] } })
  .listen(3000);

// Initiate Dependencies

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
