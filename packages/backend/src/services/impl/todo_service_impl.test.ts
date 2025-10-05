import { describe, it, expect, beforeEach, vi } from "bun:test";
import { TodoServiceImpl } from "./todo_service_impl";
import { TodoRepository } from "~/repositories/todo_repository";
import { Todo } from "~/model/todo";

describe("TodoServiceImpl", () => {
  let todoRepository: TodoRepository;
  let service: TodoServiceImpl;

  beforeEach(() => {
    todoRepository = {
      create: vi.fn(),
      update: vi.fn(),
      findAll: vi.fn(),
      findByID: vi.fn(),
      deleteByID: vi.fn(),
    };
    service = new TodoServiceImpl(todoRepository);
  });

  it("should create a todo", async () => {
    const todo: Todo = {
      id: 1,
      title: "Test",
      completed: false,
      created_at: new Date(),
      user_id: 1,
    };
    (todoRepository.create as any).mockResolvedValue(todo);

    const result = await service.create("Test", 1);
    expect(result).toEqual(todo);
    expect(todoRepository.create).toHaveBeenCalledWith("Test", 1);
  });

  it("should update a todo", async () => {
    const todo: Todo = {
      id: 1,
      title: "Updated",
      completed: true,
      created_at: new Date(),
      user_id: 1,
    };
    (todoRepository.update as any).mockResolvedValue(todo);

    const result = await service.update(1, {
      title: "Updated",
      completed: true,
    });
    expect(result).toEqual(todo);
    expect(todoRepository.update).toHaveBeenCalledWith(1, {
      title: "Updated",
      completed: true,
    });
  });

  it("should find all todos", async () => {
    const todos: Todo[] = [
      {
        id: 1,
        title: "A",
        completed: false,
        created_at: new Date(),
        user_id: 1,
      },
    ];
    (todoRepository.findAll as any).mockResolvedValue(todos);

    const result = await service.findAll();
    expect(result).toEqual(todos);
    expect(todoRepository.findAll).toHaveBeenCalled();
  });

  it("should find todo by ID", async () => {
    const todo: Todo = {
      id: 1,
      title: "A",
      completed: false,
      created_at: new Date(),
      user_id: 1,
    };
    (todoRepository.findByID as any).mockResolvedValue(todo);

    const result = await service.findByID(1);
    expect(result).toEqual(todo);
    expect(todoRepository.findByID).toHaveBeenCalledWith(1);
  });

  it("should delete todo by ID", async () => {
    (todoRepository.deleteByID as any).mockResolvedValue(undefined);

    await service.deleteByID(1);
    expect(todoRepository.deleteByID).toHaveBeenCalledWith(1);
  });

  // Edge cases
  it("should throw if create fails", async () => {
    (todoRepository.create as any).mockRejectedValue(new Error("Create error"));
    await expect(service.create("fail", 2)).rejects.toThrow("Create error");
  });

  it("should throw if update fails", async () => {
    (todoRepository.update as any).mockRejectedValue(new Error("Update error"));
    await expect(
      service.update(1, { title: "fail", completed: false })
    ).rejects.toThrow("Update error");
  });

  it("should throw if findAll fails", async () => {
    (todoRepository.findAll as any).mockRejectedValue(
      new Error("FindAll error")
    );
    await expect(service.findAll()).rejects.toThrow("FindAll error");
  });

  it("should throw if findByID fails", async () => {
    (todoRepository.findByID as any).mockRejectedValue(
      new Error("FindByID error")
    );
    await expect(service.findByID(99)).rejects.toThrow("FindByID error");
  });

  it("should throw if deleteByID fails", async () => {
    (todoRepository.deleteByID as any).mockRejectedValue(
      new Error("Delete error")
    );
    await expect(service.deleteByID(99)).rejects.toThrow("Delete error");
  });
});
