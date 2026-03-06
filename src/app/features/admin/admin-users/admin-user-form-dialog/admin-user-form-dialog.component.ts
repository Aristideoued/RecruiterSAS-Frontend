import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AdminUserService } from '../../../../core/services/admin-user.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { AdminUser } from '../../../../core/models';

@Component({
  selector: 'app-admin-user-form-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule,
            MatInputModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './admin-user-form-dialog.component.html'
})
export class AdminUserFormDialogComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  isEdit: boolean;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private svc: AdminUserService,
    private notify: NotificationService,
    public dialogRef: MatDialogRef<AdminUserFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AdminUser | null
  ) {
    this.isEdit = !!data;
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      firstName: [this.data?.firstName || '', Validators.required],
      lastName:  [this.data?.lastName  || '', Validators.required],
      email:     [this.data?.email     || '', [Validators.required, Validators.email]],
      password:  ['', this.isEdit ? [] : [Validators.required, Validators.minLength(8)]]
    });
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    const val = this.form.value;
    const obs = this.isEdit
      ? this.svc.update(this.data!.id, val)
      : this.svc.create(val);
    obs.subscribe({
      next: () => { this.loading = false; this.dialogRef.close(true); },
      error: err => {
        this.loading = false;
        this.notify.error(err.error?.message || 'Erreur lors de la sauvegarde');
      }
    });
  }
}
