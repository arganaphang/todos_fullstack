import { Todo } from "~/model/todo";
import { TodoRepository } from "../todo_repository";

export class TodoRepositoryImpl implements TodoRepository {
  create(title: string): Promise<Todo> {
    throw new Error("Method not implemented.");
  }
  update(todo: Todo): Promise<Todo> {
    throw new Error("Method not implemented.");
  }
  findAll(): Promise<Todo[]> {
    throw new Error("Method not implemented.");
  }
  findByID(id: number): Promise<Todo> {
    throw new Error("Method not implemented.");
  }
  deleteByID(id: number): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
