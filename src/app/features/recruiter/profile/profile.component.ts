import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { RecruiterService } from '../../../core/services/recruiter.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Recruiter } from '../../../core/models';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule,
            MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatDividerModule],
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  form!: FormGroup;
  recruiter: Recruiter | null = null;
  loading = true;
  saving = false;

  constructor(
    private fb: FormBuilder,
    private svc: RecruiterService,
    private notify: NotificationService
  ) {}

  ngOnInit(): void {
    this.svc.getMyProfile().subscribe({
      next: r => {
        this.recruiter = r;
        this.form = this.fb.group({
          firstName:      [r.firstName,      Validators.required],
          lastName:       [r.lastName,       Validators.required],
          email:          [r.email,          [Validators.required, Validators.email]],
          companyName:    [r.companyName,    Validators.required],
          companyWebsite: [r.companyWebsite || ''],
          phone:          [r.phone || ''],
          address:        [r.address || ''],
          siret:          [r.siret || '']
        });
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  save(): void {
    if (this.form.invalid || !this.recruiter) return;
    this.saving = true;
    this.svc.updateMyProfile(this.recruiter.id, this.form.value).subscribe({
      next: r => {
        this.recruiter = r;
        this.notify.success('Profil mis à jour');
        this.saving = false;
      },
      error: () => { this.notify.error('Erreur lors de la mise à jour'); this.saving = false; }
    });
  }

  readonly statusLabels: Record<string, string> = {
    TRIAL:     'Période d\'essai',
    ACTIVE:    'Actif',
    SUSPENDED: 'Suspendu',
    CANCELLED: 'Résilié',
    EXPIRED:   'Expiré',
  };

  statusLabel(status: string | undefined): string {
    return status ? (this.statusLabels[status] ?? status) : 'Aucun';
  }

  get publicUrl(): string {
    return this.recruiter ? `${window.location.origin}/p/${this.recruiter.slug}` : '';
  }

  copySlug(): void {
    navigator.clipboard.writeText(this.publicUrl)
      .then(() => this.notify.success('Lien copié !'));
  }
}
