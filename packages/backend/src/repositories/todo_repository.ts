import { Todo } from "~/model/todo";

export interface TodoRepository {
  create(title: string, user_id: number): Promise<Todo>;
  update(
    id: number,
    body: { title: string; completed: boolean }
  ): Promise<Todo>;
  findAll(): Promise<Todo[]>;
  findByID(id: number): Promise<Todo>;
  deleteByID(id: number): Promise<void>;
}
