import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PlanService } from '../../../../core/services/plan.service';
import { Plan } from '../../../../core/models';

@Component({
  selector: 'app-plan-form-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule,
            MatInputModule, MatButtonModule, MatCheckboxModule, MatProgressSpinnerModule],
  templateUrl: './plan-form-dialog.component.html'
})
export class PlanFormDialogComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  isEdit: boolean;

  constructor(
    private fb: FormBuilder, private svc: PlanService,
    public dialogRef: MatDialogRef<PlanFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Plan | null
  ) { this.isEdit = !!data; }

  ngOnInit(): void {
    this.form = this.fb.group({
      name:                   [this.data?.name || '', Validators.required],
      description:            [this.data?.description || ''],
      monthlyPrice:           [this.data?.monthlyPrice || 0, [Validators.required, Validators.min(0)]],
      maxJobOffers:           [this.data?.maxJobOffers ?? 5, Validators.required],
      maxApplicationsPerOffer:[this.data?.maxApplicationsPerOffer ?? 50, Validators.required],
      cvParsingEnabled:       [this.data?.cvParsingEnabled ?? false],
      analyticsEnabled:       [this.data?.analyticsEnabled ?? false],
      customBrandingEnabled:  [this.data?.customBrandingEnabled ?? false]
    });
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    const obs = this.isEdit
      ? this.svc.update(this.data!.id, this.form.value)
      : this.svc.create(this.form.value);
    obs.subscribe({
      next: () => { this.loading = false; this.dialogRef.close(true); },
      error: err => { this.loading = false; alert(err.error?.message || 'Erreur'); }
    });
  }
}
