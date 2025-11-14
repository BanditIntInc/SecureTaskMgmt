import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { TaskService } from '../../core/services/task.service';
import { LoadingComponent } from '../../shared/components/loading/loading.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  tasks;
  loading;

  constructor(
    public authService: AuthService,
    public taskService: TaskService
  ) {
    this.tasks = this.taskService.tasks;
    this.loading = this.taskService.loading;
  }

  ngOnInit(): void {
    this.taskService.getMyTasks().subscribe();
  }

  get todoCount(): number {
    return this.tasks().filter(t => t.status === 'todo').length;
  }

  get inProgressCount(): number {
    return this.tasks().filter(t => t.status === 'in_progress').length;
  }

  get doneCount(): number {
    return this.tasks().filter(t => t.status === 'done').length;
  }
}
