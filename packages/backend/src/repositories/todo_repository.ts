import { Todo } from "~/model/todo";

export interface TodoRepository {
  create(title: string): Promise<Todo>;
  update(todo: Todo): Promise<Todo>;
  findAll(): Promise<Todo[]>;
  findByID(id: number): Promise<Todo>;
  deleteByID(id: number): Promise<void>;
}
