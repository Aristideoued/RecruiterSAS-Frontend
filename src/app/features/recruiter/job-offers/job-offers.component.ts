import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
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
import { MatMenuModule } from '@angular/material/menu';
import { JobOfferService } from '../../../core/services/job-offer.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { JobOfferFormDialogComponent } from './job-offer-form-dialog/job-offer-form-dialog.component';
import { JobOffer, JobOfferStatus } from '../../../core/models';

@Component({
  selector: 'app-job-offers',
  standalone: true,
  imports: [CommonModule, RouterLink, MatTableModule, MatPaginatorModule, MatButtonModule,
            MatIconModule, MatDialogModule, MatProgressSpinnerModule, MatTooltipModule,
            MatSelectModule, MatFormFieldModule, FormsModule, MatMenuModule],
  templateUrl: './job-offers.component.html'
})
export class JobOffersComponent implements OnInit {
  columns = ['title', 'status', 'applications', 'dates', 'actions'];
  dataSource = new MatTableDataSource<JobOffer>();
  loading = true;
  total = 0;
  page = 0;
  size = 10;
  statusFilter: JobOfferStatus | '' = '';

  constructor(
    private svc: JobOfferService,
    private dialog: MatDialog,
    private notify: NotificationService
  ) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.svc.getMyOffers(this.statusFilter || undefined, this.page, this.size).subscribe({
      next: p => { this.dataSource.data = p.content; this.total = p.totalElements; this.loading = false; },
      error: () => this.loading = false
    });
  }

  openForm(offer?: JobOffer): void {
    this.dialog.open(JobOfferFormDialogComponent, { width: '680px', data: offer || null })
      .afterClosed().subscribe(r => {
        if (r) { this.load(); this.notify.success(offer ? 'Offre mise à jour' : 'Offre créée'); }
      });
  }

  publish(o: JobOffer): void {
    this.svc.publish(o.id).subscribe({ next: () => { this.load(); this.notify.success('Offre publiée'); }, error: () => this.notify.error('Erreur') });
  }

  close(o: JobOffer): void {
    this.svc.close(o.id).subscribe({ next: () => { this.load(); this.notify.info('Offre fermée'); }, error: () => this.notify.error('Erreur') });
  }

  archive(o: JobOffer): void {
    this.svc.archive(o.id).subscribe({ next: () => { this.load(); this.notify.info('Offre archivée'); }, error: () => this.notify.error('Erreur') });
  }

  unarchive(o: JobOffer): void {
    this.svc.unarchive(o.id).subscribe({ next: () => { this.load(); this.notify.success('Offre désarchivée (brouillon)'); }, error: () => this.notify.error('Erreur') });
  }

  delete(o: JobOffer): void {
    this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Supprimer l\'offre', message: `Supprimer "${o.title}" ?`, confirmLabel: 'Supprimer', confirmColor: 'warn' }
    }).afterClosed().subscribe(ok => {
      if (ok) this.svc.delete(o.id).subscribe({ next: () => { this.load(); this.notify.success('Offre supprimée'); }, error: () => this.notify.error('Erreur') });
    });
  }

  onPage(e: PageEvent): void { this.page = e.pageIndex; this.size = e.pageSize; this.load(); }
}
