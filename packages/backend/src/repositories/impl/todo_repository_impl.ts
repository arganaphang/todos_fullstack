import { Todo } from "~/model/todo";
import { TodoRepository } from "../todo_repository";
import { PrismaClient } from "~/generated/prisma";

export class TodoRepositoryImpl implements TodoRepository {
  prismaClient: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  async create(title: string, user_id: number): Promise<Todo> {
    const newTodo = await this.prismaClient.todo.create({
      data: { title, userId: user_id },
    });
    return {
      id: newTodo.id,
      title: newTodo.title,
      completed: newTodo.completed,
      created_at: newTodo.createdAt,
      user_id: newTodo.userId,
    };
  }

  async update(
    id: number,
    body: { title: string; completed: boolean }
  ): Promise<Todo> {
    const todo = await this.prismaClient.todo.update({
      data: body,
      where: { id },
    });
    return {
      id: todo.id,
      title: todo.title,
      completed: todo.completed,
      created_at: todo.createdAt,
      user_id: todo.userId,
    };
  }

  async findAll(): Promise<Todo[]> {
    return (await this.prismaClient.todo.findMany()).map((item) => {
      return {
        id: item.id,
        title: item.title,
        completed: item.completed,
        created_at: item.createdAt,
        user_id: item.userId,
      };
    });
  }

  async findByID(id: number): Promise<Todo> {
    const todo = await this.prismaClient.todo.findFirstOrThrow({
      where: { id },
    });
    return {
      id: todo.id,
      title: todo.title,
      completed: todo.completed,
      created_at: todo.createdAt,
      user_id: todo.userId,
    };
  }

  async deleteByID(id: number): Promise<void> {
    await this.prismaClient.todo.delete({ where: { id } });
  }
}
