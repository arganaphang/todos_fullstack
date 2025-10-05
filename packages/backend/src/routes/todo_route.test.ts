import { describe, it, expect, beforeEach, vi } from "bun:test";
import { todoRoute } from "./todo_route";
import { TodoService } from "~/services/todo_service";
import { Prisma } from "~/generated/prisma";

describe("todoRoute", () => {
  let todoService: TodoService;
  let app: ReturnType<typeof todoRoute>;

  beforeEach(() => {
    todoService = {
      findAll: vi.fn(),
      findByID: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      deleteByID: vi.fn(),
    };
    app = todoRoute(todoService);
  });

  it("GET / should return all todos", async () => {
    const todos = [
      {
        id: 1,
        title: "A",
        completed: false,
        created_at: new Date(),
        user_id: 1,
      },
    ];
    (todoService.findAll as any).mockResolvedValue(todos);

    const res = await app.handle(
      new Request("http://localhost/todos/", { method: "GET" })
    );
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.data).toEqual(
      todos.map((todo) => ({
        ...todo,
        created_at: todo.created_at.toISOString(),
      }))
    );
    expect(body.message).toBe("get all todo");
  });

  it("GET /:id should return todo by id", async () => {
    const todo = {
      id: 1,
      title: "A",
      completed: false,
      created_at: new Date(),
      user_id: 1,
    };
    (todoService.findByID as any).mockResolvedValue(todo);

    const res = await app.handle(
      new Request("http://localhost/todos/1", { method: "GET" })
    );
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.data).toEqual({
      ...todo,
      created_at: todo.created_at.toISOString(),
    });
    expect(body.message).toBe("get todo by id");
  });

  it("POST / should create a todo", async () => {
    const todo = {
      id: 1,
      title: "A",
      completed: false,
      created_at: new Date(),
      user_id: 1,
    };
    (todoService.create as any).mockResolvedValue(todo);

    const res = await app.handle(
      new Request("http://localhost/todos/", {
        method: "POST",
        body: JSON.stringify({ title: "A", user_id: 1 }),
        headers: { "Content-Type": "application/json" },
      })
    );
    const body = await res.json();

    expect(res.status).toBe(201);
    expect(body.data).toEqual({
      ...todo,
      created_at: todo.created_at.toISOString(),
    });
    expect(body.message).toBe("todo created");
  });

  it("PUT /:id should update a todo", async () => {
    const todo = {
      id: 1,
      title: "B",
      completed: true,
      created_at: new Date(),
      user_id: 1,
    };
    (todoService.update as any).mockResolvedValue(todo);

    const res = await app.handle(
      new Request("http://localhost/todos/1", {
        method: "PUT",
        body: JSON.stringify({ title: "B", completed: true }),
        headers: { "Content-Type": "application/json" },
      })
    );
    const body = await res.json();

    expect(res.status).toBe(201);
    expect(body.data).toEqual({
      ...todo,
      created_at: todo.created_at.toISOString(),
    });
    expect(body.message).toBe("todo created");
  });

  it("DELETE /:id should return 200 on success", async () => {
    (todoService.findByID as any).mockResolvedValue({});
    const res = await app.handle(
      new Request("http://localhost/todos/1", { method: "DELETE" })
    );
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body.data).toBeNull();
    expect(body.message).toBe("delete todo by id");
  });
});

describe("todoRoute error/edge cases", () => {
  let todoService: TodoService;
  let app: ReturnType<typeof todoRoute>;

  beforeEach(() => {
    todoService = {
      findAll: vi.fn(),
      findByID: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      deleteByID: vi.fn(),
    };
    app = todoRoute(todoService);
  });

  it("GET / should return 400 if PrismaClientKnownRequestError", async () => {
    (todoService.findAll as any).mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError("fail", { code: "P2002" } as any)
    );
    const res = await app.handle(
      new Request("http://localhost/todos/", { method: "GET" })
    );
    const body = await res.json();
    expect(res.status).toBe(400);
    expect(body.message).toBe("failed to get all todo");
  });

  it("GET /:id should return 404 if PrismaClientKnownRequestError P2025", async () => {
    (todoService.findByID as any).mockRejectedValue(
      Object.assign(
        new Prisma.PrismaClientKnownRequestError("fail", {
          code: "P2025",
        } as any),
        { code: "P2025" }
      )
    );
    const res = await app.handle(
      new Request("http://localhost/todos/1", { method: "GET" })
    );
    const body = await res.json();
    expect(res.status).toBe(404);
    expect(body.message).toBe("not found");
  });

  it("GET /:id should return 400 if PrismaClientKnownRequestError not P2025", async () => {
    (todoService.findByID as any).mockRejectedValue(
      Object.assign(
        new Prisma.PrismaClientKnownRequestError("fail", {
          code: "P2002",
        } as any),
        { code: "P2002" }
      )
    );
    const res = await app.handle(
      new Request("http://localhost/todos/1", { method: "GET" })
    );
    const body = await res.json();
    expect(res.status).toBe(400);
    expect(body.message).toBe("failed to get todo by id");
  });

  it("PUT /:id should return 404 if PrismaClientKnownRequestError P2025", async () => {
    (todoService.update as any).mockRejectedValue(
      Object.assign(
        new Prisma.PrismaClientKnownRequestError("fail", {
          code: "P2025",
        } as any),
        { code: "P2025" }
      )
    );
    const res = await app.handle(
      new Request("http://localhost/todos/1", {
        method: "PUT",
        body: JSON.stringify({ title: "B", completed: true }),
        headers: { "Content-Type": "application/json" },
      })
    );
    const body = await res.json();
    expect(res.status).toBe(404);
    expect(body.message).toBe("not found");
  });

  it("PUT /:id should return 400 if PrismaClientKnownRequestError not P2025", async () => {
    (todoService.update as any).mockRejectedValue(
      Object.assign(
        new Prisma.PrismaClientKnownRequestError("fail", {
          code: "P2002",
        } as any),
        { code: "P2002" }
      )
    );
    const res = await app.handle(
      new Request("http://localhost/todos/1", {
        method: "PUT",
        body: JSON.stringify({ title: "B", completed: true }),
        headers: { "Content-Type": "application/json" },
      })
    );
    const body = await res.json();
    expect(res.status).toBe(400);
    expect(body.message).toBe("failed to update todo by id");
  });

  it("DELETE /:id should return 404 if PrismaClientKnownRequestError P2025", async () => {
    (todoService.findByID as any).mockRejectedValue(
      Object.assign(
        new Prisma.PrismaClientKnownRequestError("fail", {
          code: "P2025",
        } as any),
        { code: "P2025" }
      )
    );
    const res = await app.handle(
      new Request("http://localhost/todos/1", { method: "DELETE" })
    );
    const body = await res.json();
    expect(res.status).toBe(404);
    expect(body.message).toBe("not found");
  });

  it("DELETE /:id should return 400 if PrismaClientKnownRequestError not P2025", async () => {
    (todoService.findByID as any).mockRejectedValue(
      Object.assign(
        new Prisma.PrismaClientKnownRequestError("fail", {
          code: "P2002",
        } as any),
        { code: "P2002" }
      )
    );
    const res = await app.handle(
      new Request("http://localhost/todos/1", { method: "DELETE" })
    );
    const body = await res.json();
    expect(res.status).toBe(400);
    expect(body.message).toBe("failed to delete todo by id");
  });

  it("GET / should return 500 for unknown error", async () => {
    (todoService.findAll as any).mockRejectedValue(new Error("unknown"));
    const res = await app.handle(
      new Request("http://localhost/todos/", { method: "GET" })
    );
    const body = await res.json();
    expect(res.status).toBe(500);
    expect(body.message).toBe("failed to get todo");
  });

  it("GET /:id should return 500 for unknown error", async () => {
    (todoService.findByID as any).mockRejectedValue(new Error("unknown"));
    const res = await app.handle(
      new Request("http://localhost/todos/1", { method: "GET" })
    );
    const body = await res.json();
    expect(res.status).toBe(500);
    expect(body.message).toBe("failed to get todo by id");
  });

  it("PUT /:id should return 500 for unknown error", async () => {
    (todoService.update as any).mockRejectedValue(new Error("unknown"));
    const res = await app.handle(
      new Request("http://localhost/todos/1", {
        method: "PUT",
        body: JSON.stringify({ title: "B", completed: true }),
        headers: { "Content-Type": "application/json" },
      })
    );
    const body = await res.json();
    expect(res.status).toBe(500);
    expect(body.message).toBe("failed to update todo by id");
  });

  it("DELETE /:id should return 500 for unknown error", async () => {
    (todoService.findByID as any).mockRejectedValue(new Error("unknown"));
    const res = await app.handle(
      new Request("http://localhost/todos/1", { method: "DELETE" })
    );
    const body = await res.json();
    expect(res.status).toBe(500);
    expect(body.message).toBe("failed to delete todo by id");
  });
});
