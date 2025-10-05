import { Todo } from "~/model/todo";
import { TodoService } from "../todo_service";
import { TodoRepository } from "~/repositories/todo_repository";

export class TodoServiceImpl implements TodoService {
  todoRepository: TodoRepository;

  constructor(todoRepository: TodoRepository) {
    this.todoRepository = todoRepository;
  }

  create(title: string, user_id: number): Promise<Todo> {
    return this.todoRepository.create(title, user_id);
  }

  update(
    id: number,
    body: { title: string; completed: boolean }
  ): Promise<Todo> {
    return this.todoRepository.update(id, body);
  }

  findAll(): Promise<Todo[]> {
    return this.todoRepository.findAll();
  }

  findByID(id: number): Promise<Todo> {
    return this.todoRepository.findByID(id);
  }

  deleteByID(id: number): Promise<void> {
    return this.todoRepository.deleteByID(id);
  }
}
