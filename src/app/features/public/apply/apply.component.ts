import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { JobOfferService } from '../../../core/services/job-offer.service';
import { ApplicationService } from '../../../core/services/application.service';
import { JobOffer } from '../../../core/models';

@Component({
  selector: 'app-apply',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, MatFormFieldModule,
            MatInputModule, MatButtonModule, MatIconModule,
            MatProgressSpinnerModule, MatSnackBarModule],
  templateUrl: './apply.component.html',
  styleUrls: ['./apply.component.scss']
})
export class ApplyComponent implements OnInit {
  form!: FormGroup;
  offer: JobOffer | null = null;
  loading = true;
  submitting = false;
  submitted = false;
  files: File[] = [];
  dragOver = false;
  offerId = '';
  slug = '';

  readonly MAX_FILES = 5;
  readonly MAX_SIZE = 5 * 1024 * 1024; // 5MB

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private offerSvc: JobOfferService,
    private appSvc: ApplicationService,
    private snack: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.slug = this.route.snapshot.paramMap.get('slug')!;
    this.offerId = this.route.snapshot.paramMap.get('offerId')!;

    this.form = this.fb.group({
      candidateFirstName: ['', Validators.required],
      candidateLastName:  ['', Validators.required],
      candidateEmail:     ['', [Validators.required, Validators.email]],
      candidatePhone:     [''],
      candidateLinkedin:  [''],
      coverLetterText:    ['']
    });

    this.offerSvc.getPublicOffer(this.offerId).subscribe({
      next: o => { this.offer = o; this.loading = false; },
      error: () => this.loading = false
    });
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) this.addFiles(Array.from(input.files));
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragOver = false;
    if (event.dataTransfer?.files) this.addFiles(Array.from(event.dataTransfer.files));
  }

  onDragOver(event: DragEvent): void { event.preventDefault(); this.dragOver = true; }
  onDragLeave(): void { this.dragOver = false; }

  addFiles(newFiles: File[]): void {
    for (const f of newFiles) {
      if (this.files.length >= this.MAX_FILES) {
        this.snack.open(`Maximum ${this.MAX_FILES} fichiers`, '', { duration: 3000 });
        break;
      }
      if (f.size > this.MAX_SIZE) {
        this.snack.open(`${f.name} dépasse 5 MB`, '', { duration: 3000 });
        continue;
      }
      if (!this.files.find(x => x.name === f.name && x.size === f.size)) {
        this.files.push(f);
      }
    }
  }

  removeFile(i: number): void { this.files.splice(i, 1); }

  formatSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1024 / 1024).toFixed(1) + ' MB';
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.submitting = true;
    this.appSvc.submit(this.offerId, this.form.value, this.files).subscribe({
      next: () => { this.submitted = true; this.submitting = false; },
      error: () => {
        this.snack.open('Erreur lors de l\'envoi. Veuillez réessayer.', 'Fermer', { duration: 5000, panelClass: 'snack-error' });
        this.submitting = false;
      }
    });
  }
}
