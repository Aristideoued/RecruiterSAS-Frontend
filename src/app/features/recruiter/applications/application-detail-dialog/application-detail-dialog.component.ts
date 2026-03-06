import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ApplicationService } from '../../../../core/services/application.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { JobApplication, ApplicationFile, ApplicationStatus } from '../../../../core/models';

@Component({
  selector: 'app-application-detail-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule,
            MatInputModule, MatSelectModule, MatButtonModule, MatIconModule,
            MatChipsModule, MatDividerModule, MatTooltipModule],
  templateUrl: './application-detail-dialog.component.html'
})
export class ApplicationDetailDialogComponent {
  form: FormGroup;
  saving = false;
  statuses: ApplicationStatus[] = ['PENDING', 'REVIEWED', 'SHORTLISTED', 'REJECTED', 'HIRED'];
  statusLabels: Record<ApplicationStatus, string> = {
    PENDING: 'En attente', REVIEWED: 'Examinée', SHORTLISTED: 'Présélectionnée',
    REJECTED: 'Rejetée', HIRED: 'Recrutée'
  };

  constructor(
    private fb: FormBuilder,
    private svc: ApplicationService,
    private notify: NotificationService,
    public dialogRef: MatDialogRef<ApplicationDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public app: JobApplication
  ) {
    this.form = this.fb.group({
      status:         [app.status],
      recruiterNotes: [app.recruiterNotes || ''],
      rating:         [app.rating || 0]
    });
  }

  save(): void {
    this.saving = true;
    const { status, recruiterNotes, rating } = this.form.value;
    this.svc.updateStatus(this.app.id, status, recruiterNotes, rating).subscribe({
      next: () => { this.dialogRef.close(true); this.notify.success('Candidature mise à jour'); },
      error: () => { this.notify.error('Erreur'); this.saving = false; }
    });
  }

  download(file: ApplicationFile): void {
    this.svc.downloadFile(file.id).subscribe(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = file.originalFileName; a.click();
      URL.revokeObjectURL(url);
    });
  }

  openFile(file: ApplicationFile): void {
    this.svc.downloadFile(file.id).subscribe(blob => {
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    });
  }

  fileIcon(type: string): string {
    const icons: Record<string, string> = { CV: 'description', COVER_LETTER: 'mail', PORTFOLIO: 'folder_zip', OTHER: 'attach_file' };
    return icons[type] || 'attach_file';
  }

  stars(n: number): number[] { return Array(Math.max(0, n)).fill(0); }
  emptyStars(n: number): number[] { return Array(Math.max(0, 5 - n)).fill(0); }

  formatSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1024 / 1024).toFixed(1) + ' MB';
  }
}
