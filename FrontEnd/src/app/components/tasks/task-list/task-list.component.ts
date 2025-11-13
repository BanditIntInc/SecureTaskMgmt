import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TaskService } from '../../../core/services/task.service';
import { Task, TaskStatus, TaskPriority } from '../../../core/models';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingComponent],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  tasks;
  loading;
  error = signal<string | null>(null);

  // Expose enums to template
  TaskStatus = TaskStatus;
  TaskPriority = TaskPriority;

  constructor(public taskService: TaskService) {
    this.tasks = this.taskService.tasks;
    this.loading = this.taskService.loading;
  }

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getMyTasks().subscribe({
      error: (err) => {
        this.error.set(err.error?.message || 'Failed to load tasks');
      }
    });
  }

  deleteTask(taskId: string): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(taskId).subscribe({
        error: (err) => {
          this.error.set(err.error?.message || 'Failed to delete task');
        }
      });
    }
  }

  getStatusClass(status: TaskStatus): string {
    const classes: Record<TaskStatus, string> = {
      [TaskStatus.TODO]: 'bg-gray-100 text-gray-800',
      [TaskStatus.IN_PROGRESS]: 'bg-blue-100 text-blue-800',
      [TaskStatus.DONE]: 'bg-green-100 text-green-800',
      [TaskStatus.ARCHIVED]: 'bg-gray-100 text-gray-500'
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
  }

  getPriorityClass(priority: TaskPriority): string {
    const classes: Record<TaskPriority, string> = {
      [TaskPriority.LOW]: 'bg-blue-100 text-blue-800',
      [TaskPriority.MEDIUM]: 'bg-yellow-100 text-yellow-800',
      [TaskPriority.HIGH]: 'bg-orange-100 text-orange-800',
      [TaskPriority.URGENT]: 'bg-red-100 text-red-800'
    };
    return classes[priority] || 'bg-gray-100 text-gray-800';
  }

  getStatusLabel(status: TaskStatus): string {
    const labels: Record<TaskStatus, string> = {
      [TaskStatus.TODO]: 'To Do',
      [TaskStatus.IN_PROGRESS]: 'In Progress',
      [TaskStatus.DONE]: 'Done',
      [TaskStatus.ARCHIVED]: 'Archived'
    };
    return labels[status] || status;
  }
}
