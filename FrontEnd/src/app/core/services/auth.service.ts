import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  User,
  LoginRequest,
  RegisterRequest,
  AuthResponse
} from '../models';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = `${environment.apiUrl}/auth`;

  // Signals for reactive state management
  private currentUserSignal = signal<User | null>(null);
  private isAuthenticatedSignal = signal<boolean>(false);

  // Computed signals
  currentUser = this.currentUserSignal.asReadonly();
  isAuthenticated = this.isAuthenticatedSignal.asReadonly();
  userFullName = computed(() => {
    const user = this.currentUserSignal();
    return user ? `${user.firstName} ${user.lastName}` : '';
  });

  constructor(
    private http: HttpClient,
    private router: Router,
    private storageService: StorageService
  ) {
    this.loadUserFromStorage();
  }

  /**
   * Load user from storage on app initialization
   */
  private loadUserFromStorage(): void {
    const token = this.storageService.getToken();
    const user = this.storageService.getUser<User>();

    if (token && user) {
      this.currentUserSignal.set(user);
      this.isAuthenticatedSignal.set(true);
    } else if (token || user) {
      // Inconsistent state - clear everything
      this.clearAuth();
    }
  }

  /**
   * Register a new user
   */
  register(data: RegisterRequest, rememberMe: boolean = false): Observable<AuthResponse> {
    this.storageService.setRememberMe(rememberMe);
    return this.http.post<AuthResponse>(`${this.API_URL}/register`, data).pipe(
      tap(response => this.handleAuthSuccess(response))
    );
  }

  /**
   * Login user
   */
  login(credentials: LoginRequest, rememberMe: boolean = false): Observable<AuthResponse> {
    this.storageService.setRememberMe(rememberMe);
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials).pipe(
      tap(response => this.handleAuthSuccess(response))
    );
  }

  /**
   * Get current user profile from server
   */
  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/profile`).pipe(
      tap(user => {
        this.currentUserSignal.set(user);
        this.storageService.setUser(user);
      })
    );
  }

  /**
   * Logout user
   */
  logout(): void {
    this.clearAuth();
    this.router.navigate(['/auth/login']);
  }

  /**
   * Get stored JWT token
   */
  getToken(): string | null {
    return this.storageService.getToken();
  }

  /**
   * Handle successful authentication
   */
  private handleAuthSuccess(response: AuthResponse): void {
    this.storageService.setToken(response.access_token);
    this.storageService.setUser(response.user);
    this.currentUserSignal.set(response.user);
    this.isAuthenticatedSignal.set(true);
  }

  /**
   * Clear authentication data
   */
  private clearAuth(): void {
    this.storageService.clearAuth();
    this.currentUserSignal.set(null);
    this.isAuthenticatedSignal.set(false);
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: string): boolean {
    const user = this.currentUserSignal();
    // This would need to be enhanced based on how roles are stored in the user object
    return false; // Placeholder
  }
}
