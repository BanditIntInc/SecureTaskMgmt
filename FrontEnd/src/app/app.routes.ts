import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./components/auth/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./components/auth/register/register.component').then(m => m.RegisterComponent)
      }
    ]
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'tasks',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./components/tasks/task-list/task-list.component').then(m => m.TaskListComponent)
      },
      {
        path: 'new',
        loadComponent: () => import('./components/tasks/task-form/task-form.component').then(m => m.TaskFormComponent)
      },
      {
        path: ':id',
        loadComponent: () => import('./components/tasks/task-form/task-form.component').then(m => m.TaskFormComponent)
      }
    ]
  },
  {
    path: 'organizations',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./components/organizations/organization-list/organization-list.component').then(m => m.OrganizationListComponent)
      },
      {
        path: 'new',
        loadComponent: () => import('./components/organizations/organization-form/organization-form.component').then(m => m.OrganizationFormComponent)
      },
      {
        path: ':id',
        loadComponent: () => import('./components/organizations/organization-form/organization-form.component').then(m => m.OrganizationFormComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];
