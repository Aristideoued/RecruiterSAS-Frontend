import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RecruiterService } from '../../../../core/services/recruiter.service';
import { PlanService } from '../../../../core/services/plan.service';
import { Plan, Recruiter } from '../../../../core/models';

@Component({
  selector: 'app-recruiter-form-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule,
            MatInputModule, MatSelectModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './recruiter-form-dialog.component.html'
})
export class RecruiterFormDialogComponent implements OnInit {
  form!: FormGroup;
  plans: Plan[] = [];
  loading = false;
  isEdit: boolean;

  constructor(
    private fb: FormBuilder,
    private svc: RecruiterService,
    private planSvc: PlanService,
    public dialogRef: MatDialogRef<RecruiterFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Recruiter | null
  ) {
    this.isEdit = !!data;
  }

  ngOnInit(): void {
    this.planSvc.getAll(true).subscribe(p => this.plans = p);
    this.form = this.fb.group({
      firstName:      [this.data?.firstName || '', Validators.required],
      lastName:       [this.data?.lastName || '', Validators.required],
      email:          [this.data?.email || '', [Validators.required, Validators.email]],
      password:       [this.isEdit ? '' : '', this.isEdit ? [] : [Validators.required, Validators.minLength(8)]],
      companyName:    [this.data?.companyName || '', Validators.required],
      companyWebsite: [this.data?.companyWebsite || ''],
      phone:          [this.data?.phone || ''],
      address:        [this.data?.address || ''],
      siret:          [this.data?.siret || ''],
      planId:         [this.data?.subscription?.plan?.id || '']
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
      error: err => { this.loading = false; alert(err.error?.message || 'Erreur'); }
    });
  }
}
