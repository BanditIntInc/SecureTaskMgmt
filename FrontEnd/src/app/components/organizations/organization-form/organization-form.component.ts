import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { OrganizationService } from '../../../core/services/organization.service';

@Component({
  selector: 'app-organization-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './organization-form.component.html',
  styleUrls: ['./organization-form.component.css']
})
export class OrganizationFormComponent implements OnInit {
  organizationForm: FormGroup;
  isEditMode = false;
  organizationId: string | null = null;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private organizationService: OrganizationService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.organizationForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.organizationId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.organizationId;

    if (this.isEditMode && this.organizationId) {
      this.loadOrganization(this.organizationId);
    }
  }

  loadOrganization(id: string): void {
    this.loading = true;
    this.organizationService.getOne(id).subscribe({
      next: (organization) => {
        this.organizationForm.patchValue({
          name: organization.name,
          description: organization.description
        });
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load organization';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.organizationForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = null;

    const formData = this.organizationForm.value;

    const request = this.isEditMode && this.organizationId
      ? this.organizationService.update(this.organizationId, formData)
      : this.organizationService.create(formData);

    request.subscribe({
      next: () => {
        this.router.navigate(['/organizations']);
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to save organization';
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/organizations']);
  }
}
