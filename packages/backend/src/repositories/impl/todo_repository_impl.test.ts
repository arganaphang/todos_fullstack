import { describe, it, expect, beforeEach, vi } from "bun:test";
import { TodoRepositoryImpl } from "./todo_repository_impl";
import { PrismaClient } from "~/generated/prisma";
import { Todo } from "~/model/todo";

describe("TodoRepositoryImpl", () => {
  let prismaClient: PrismaClient;
  let repository: TodoRepositoryImpl;

  beforeEach(() => {
    prismaClient = {
      todo: {
        create: vi.fn(),
        update: vi.fn(),
        findMany: vi.fn(),
        findFirstOrThrow: vi.fn(),
        delete: vi.fn(),
      },
    } as any;
    repository = new TodoRepositoryImpl(prismaClient);
  });

  it("should create a todo", async () => {
    const newTodo = {
      id: 1,
      title: "Test",
      completed: false,
      createdAt: new Date(),
      userId: 1,
    };
    (prismaClient.todo.create as any).mockResolvedValue(newTodo);

    const result = await repository.create("Test", 1);
    expect(result).toEqual({
      id: newTodo.id,
      title: newTodo.title,
      completed: newTodo.completed,
      created_at: newTodo.createdAt,
      user_id: newTodo.userId,
    });
    expect(prismaClient.todo.create).toHaveBeenCalledWith({
      data: { title: "Test", userId: 1 },
    });
  });

  it("should update a todo", async () => {
    const updatedTodo = {
      id: 1,
      title: "Updated",
      completed: true,
      createdAt: new Date(),
      userId: 1,
    };
    (prismaClient.todo.update as any).mockResolvedValue(updatedTodo);

    const result = await repository.update(1, {
      title: "Updated",
      completed: true,
    });
    expect(result).toEqual({
      id: updatedTodo.id,
      title: updatedTodo.title,
      completed: updatedTodo.completed,
      created_at: updatedTodo.createdAt,
      user_id: updatedTodo.userId,
    });
    expect(prismaClient.todo.update).toHaveBeenCalledWith({
      data: { title: "Updated", completed: true },
      where: { id: 1 },
    });
  });

  it("should find all todos", async () => {
    const todos = [
      {
        id: 1,
        title: "A",
        completed: false,
        createdAt: new Date(),
        userId: 1,
      },
    ];
    (prismaClient.todo.findMany as any).mockResolvedValue(todos);

    const result = await repository.findAll();
    expect(result).toEqual([
      {
        id: todos[0].id,
        title: todos[0].title,
        completed: todos[0].completed,
        created_at: todos[0].createdAt,
        user_id: todos[0].userId,
      },
    ]);
    expect(prismaClient.todo.findMany).toHaveBeenCalled();
  });

  it("should find todo by ID", async () => {
    const todo = {
      id: 1,
      title: "A",
      completed: false,
      createdAt: new Date(),
      userId: 1,
    };
    (prismaClient.todo.findFirstOrThrow as any).mockResolvedValue(todo);

    const result = await repository.findByID(1);
    expect(result).toEqual({
      id: todo.id,
      title: todo.title,
      completed: todo.completed,
      created_at: todo.createdAt,
      user_id: todo.userId,
    });
    expect(prismaClient.todo.findFirstOrThrow).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it("should delete todo by ID", async () => {
    (prismaClient.todo.delete as any).mockResolvedValue(undefined);

    await repository.deleteByID(1);
    expect(prismaClient.todo.delete).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it("should throw if create fails", async () => {
    (prismaClient.todo.create as any).mockRejectedValue(new Error("DB error"));
    expect(repository.create("Fail", 2)).rejects.toThrow("DB error");
  });

  it("should throw if update fails", async () => {
    (prismaClient.todo.update as any).mockRejectedValue(
      new Error("Update error")
    );
    expect(
      repository.update(99, { title: "X", completed: false })
    ).rejects.toThrow("Update error");
  });

  it("should return empty array if no todos found", async () => {
    (prismaClient.todo.findMany as any).mockResolvedValue([]);
    const result = await repository.findAll();
    expect(result).toEqual([]);
  });

  it("should throw if findByID fails", async () => {
    (prismaClient.todo.findFirstOrThrow as any).mockRejectedValue(
      new Error("Not found")
    );
    expect(repository.findByID(404)).rejects.toThrow("Not found");
  });

  it("should throw if deleteByID fails", async () => {
    (prismaClient.todo.delete as any).mockRejectedValue(
      new Error("Delete error")
    );
    expect(repository.deleteByID(123)).rejects.toThrow("Delete error");
  });
});
