import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { JobOfferService } from '../../../../core/services/job-offer.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { JobOffer } from '../../../../core/models';

@Component({
  selector: 'app-job-offer-form-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule,
            MatInputModule, MatSelectModule, MatButtonModule, MatIconModule, MatCheckboxModule],
  templateUrl: './job-offer-form-dialog.component.html'
})
export class JobOfferFormDialogComponent implements OnInit {
  form!: FormGroup;
  saving = false;

  contractTypes = ['CDI', 'CDD', 'Stage', 'Alternance', 'Freelance', 'Intérim'];
  workModes = ['Présentiel', 'Télétravail', 'Hybride'];
  experienceLevels = ['Junior', 'Confirmé', 'Senior', 'Expert'];
  categories = ['Tech', 'Marketing', 'Finance', 'RH', 'Commercial', 'Design', 'Opérations', 'Autre'];

  constructor(
    private fb: FormBuilder,
    private svc: JobOfferService,
    private notify: NotificationService,
    public dialogRef: MatDialogRef<JobOfferFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: JobOffer | null
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      title:           [this.data?.title || '', Validators.required],
      description:     [this.data?.description || '', Validators.required],
      requirements:    [this.data?.requirements || ''],
      location:        [this.data?.location || ''],
      contractType:    [this.data?.contractType || 'CDI'],
      workMode:        [this.data?.workMode || 'Hybride'],
      salaryRange:     [this.data?.salaryRange || ''],
      experienceLevel: [this.data?.experienceLevel || 'Junior'],
      category:        [this.data?.category || 'Tech'],
      closingDate:     [this.data?.closingDate ? this.data.closingDate.substring(0,10) : '']
    });
  }

  save(): void {
    if (this.form.invalid) return;
    this.saving = true;
    const action = this.data
      ? this.svc.update(this.data.id, this.form.value)
      : this.svc.create(this.form.value);
    action.subscribe({
      next: r => this.dialogRef.close(r),
      error: () => { this.notify.error('Erreur lors de la sauvegarde'); this.saving = false; }
    });
  }
}
