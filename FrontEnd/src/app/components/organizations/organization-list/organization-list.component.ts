import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrganizationService } from '../../../core/services/organization.service';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';

@Component({
  selector: 'app-organization-list',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingComponent],
  templateUrl: './organization-list.component.html',
  styleUrls: ['./organization-list.component.css']
})
export class OrganizationListComponent implements OnInit {
  organizations;
  loading;
  error = signal<string | null>(null);

  constructor(public organizationService: OrganizationService) {
    this.organizations = this.organizationService.organizations;
    this.loading = this.organizationService.loading;
  }

  ngOnInit(): void {
    this.loadOrganizations();
  }

  loadOrganizations(): void {
    this.organizationService.getAll().subscribe({
      error: (err) => {
        this.error.set(err.error?.message || 'Failed to load organizations');
      }
    });
  }

  deleteOrganization(organizationId: string): void {
    if (confirm('Are you sure you want to delete this organization? This will affect all associated tasks and users.')) {
      this.organizationService.delete(organizationId).subscribe({
        error: (err) => {
          this.error.set(err.error?.message || 'Failed to delete organization');
        }
      });
    }
  }
}
