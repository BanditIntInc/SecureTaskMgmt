import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Task,
  CreateTaskDto,
  UpdateTaskDto,
  AssignTaskDto,
  TaskStatus
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly API_URL = `${environment.apiUrl}/tasks`;

  // Signals for task state
  private tasksSignal = signal<Task[]>([]);
  private loadingSignal = signal<boolean>(false);

  tasks = this.tasksSignal.asReadonly();
  loading = this.loadingSignal.asReadonly();

  constructor(private http: HttpClient) {}

  /**
   * Get all tasks (with optional filters)
   */
  getTasks(filters?: { status?: TaskStatus; organizationId?: string }): Observable<Task[]> {
    this.loadingSignal.set(true);
    let params = new HttpParams();

    if (filters?.status) {
      params = params.set('status', filters.status);
    }
    if (filters?.organizationId) {
      params = params.set('organizationId', filters.organizationId);
    }

    return this.http.get<Task[]>(this.API_URL, { params }).pipe(
      tap(tasks => {
        this.tasksSignal.set(tasks);
        this.loadingSignal.set(false);
      })
    );
  }

  /**
   * Get user's tasks
   */
  getMyTasks(): Observable<Task[]> {
    this.loadingSignal.set(true);
    return this.http.get<Task[]>(`${this.API_URL}/my-tasks`).pipe(
      tap(tasks => {
        this.tasksSignal.set(tasks);
        this.loadingSignal.set(false);
      })
    );
  }

  /**
   * Get single task by ID
   */
  getTask(id: string): Observable<Task> {
    return this.http.get<Task>(`${this.API_URL}/${id}`);
  }

  /**
   * Create new task
   */
  createTask(data: CreateTaskDto): Observable<Task> {
    return this.http.post<Task>(this.API_URL, data).pipe(
      tap(task => {
        const current = this.tasksSignal();
        this.tasksSignal.set([...current, task]);
      })
    );
  }

  /**
   * Update existing task
   */
  updateTask(id: string, data: UpdateTaskDto): Observable<Task> {
    return this.http.put<Task>(`${this.API_URL}/${id}`, data).pipe(
      tap(updatedTask => {
        const current = this.tasksSignal();
        const index = current.findIndex(t => t.id === id);
        if (index !== -1) {
          const updated = [...current];
          updated[index] = updatedTask;
          this.tasksSignal.set(updated);
        }
      })
    );
  }

  /**
   * Delete task (soft delete)
   */
  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`).pipe(
      tap(() => {
        const current = this.tasksSignal();
        this.tasksSignal.set(current.filter(t => t.id !== id));
      })
    );
  }

  /**
   * Assign task to user
   */
  assignTask(taskId: string, data: AssignTaskDto): Observable<Task> {
    return this.http.post<Task>(`${this.API_URL}/${taskId}/assign`, data);
  }

  /**
   * Unassign task from user
   */
  unassignTask(taskId: string, userId: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${taskId}/assign/${userId}`);
  }
}
