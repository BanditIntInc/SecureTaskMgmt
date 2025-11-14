import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Organization,
  CreateOrganizationDto,
  UpdateOrganizationDto,
  AddUserToOrgDto,
  UserOrganization
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {
  private readonly API_URL = `${environment.apiUrl}/organizations`;

  private organizationsSignal = signal<Organization[]>([]);
  private loadingSignal = signal<boolean>(false);

  organizations = this.organizationsSignal.asReadonly();
  loading = this.loadingSignal.asReadonly();

  constructor(private http: HttpClient) {}

  getAll(): Observable<Organization[]> {
    this.loadingSignal.set(true);
    return this.http.get<Organization[]>(this.API_URL).pipe(
      tap(organizations => {
        this.organizationsSignal.set(organizations);
        this.loadingSignal.set(false);
      })
    );
  }

  getOne(id: string): Observable<Organization> {
    return this.http.get<Organization>(`${this.API_URL}/${id}`);
  }

  create(dto: CreateOrganizationDto): Observable<Organization> {
    return this.http.post<Organization>(this.API_URL, dto).pipe(
      tap(organization => {
        this.organizationsSignal.update(orgs => [...orgs, organization]);
      })
    );
  }

  update(id: string, dto: UpdateOrganizationDto): Observable<Organization> {
    return this.http.put<Organization>(`${this.API_URL}/${id}`, dto).pipe(
      tap(updated => {
        this.organizationsSignal.update(orgs =>
          orgs.map(org => org.id === id ? updated : org)
        );
      })
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`).pipe(
      tap(() => {
        this.organizationsSignal.update(orgs =>
          orgs.filter(org => org.id !== id)
        );
      })
    );
  }

  addUser(organizationId: string, dto: AddUserToOrgDto): Observable<UserOrganization> {
    return this.http.post<UserOrganization>(`${this.API_URL}/${organizationId}/users`, dto);
  }

  removeUser(organizationId: string, userId: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${organizationId}/users/${userId}`);
  }
}
