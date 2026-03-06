import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { ApplicationService } from '../../../core/services/application.service';
import { NotificationService } from '../../../core/services/notification.service';
import { RecruiterService } from '../../../core/services/recruiter.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { ApplicationDetailDialogComponent } from './application-detail-dialog/application-detail-dialog.component';
import { JobApplication, ApplicationStatus } from '../../../core/models';

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatButtonModule,
            MatIconModule, MatDialogModule, MatProgressSpinnerModule, MatTooltipModule,
            MatSelectModule, MatFormFieldModule, FormsModule],
  templateUrl: './applications.component.html'
})
export class ApplicationsComponent implements OnInit {
  columns = ['candidate', 'offer', 'status', 'rating', 'files', 'date', 'actions'];
  dataSource = new MatTableDataSource<JobApplication>();
  statusLabels: Record<string, string> = {
    PENDING: 'En attente', REVIEWED: 'Examinée', SHORTLISTED: 'Présélectionnée',
    REJECTED: 'Rejetée', HIRED: 'Recrutée'
  };
  loading = true;
  total = 0;
  page = 0;
  size = 20;
  statusFilter: ApplicationStatus | '' = '';
  offerId: string | null = null;
  cvParsingEnabled = false;

  constructor(
    private svc: ApplicationService,
    private dialog: MatDialog,
    private notify: NotificationService,
    private route: ActivatedRoute,
    private recruiterSvc: RecruiterService
  ) {}

  ngOnInit(): void {
    this.offerId = this.route.snapshot.paramMap.get('id');
    this.recruiterSvc.getMyProfile().subscribe({
      next: r => this.cvParsingEnabled = r.subscription?.plan?.cvParsingEnabled ?? false
    });
    this.load();
  }

  load(): void {
    this.loading = true;
    const obs = this.offerId
      ? this.svc.getByOffer(this.offerId, this.statusFilter || undefined, this.page, this.size)
      : this.svc.getAll(this.statusFilter || undefined, this.page, this.size);
    obs.subscribe({
      next: p => { this.dataSource.data = p.content; this.total = p.totalElements; this.loading = false; },
      error: () => this.loading = false
    });
  }

  openDetail(app: JobApplication): void {
    this.dialog.open(ApplicationDetailDialogComponent, { width: '740px', data: { app, cvParsingEnabled: this.cvParsingEnabled } })
      .afterClosed().subscribe(updated => { if (updated) this.load(); });
  }

  delete(app: JobApplication): void {
    this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Supprimer la candidature', message: `Supprimer la candidature de ${app.candidateFirstName} ${app.candidateLastName} ?`, confirmLabel: 'Supprimer', confirmColor: 'warn' }
    }).afterClosed().subscribe(ok => {
      if (ok) this.svc.delete(app.id).subscribe({ next: () => { this.load(); this.notify.success('Candidature supprimée'); }, error: () => this.notify.error('Erreur') });
    });
  }

  onPage(e: PageEvent): void { this.page = e.pageIndex; this.size = e.pageSize; this.load(); }
  stars(n: number): number[] { return Array(Math.max(0, n)).fill(0); }
}
