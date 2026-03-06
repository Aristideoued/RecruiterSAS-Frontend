import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RecruiterService } from '../../../core/services/recruiter.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { RecruiterFormDialogComponent } from './recruiter-form-dialog/recruiter-form-dialog.component';
import { Recruiter } from '../../../core/models';

@Component({
  selector: 'app-recruiters',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatSortModule,
            MatButtonModule, MatIconModule, MatInputModule, MatFormFieldModule,
            MatDialogModule, MatProgressSpinnerModule, MatTooltipModule, MatSlideToggleModule],
  templateUrl: './recruiters.component.html'
})
export class RecruitersComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  columns = ['avatar', 'name', 'company', 'slug', 'status', 'plan', 'createdAt', 'actions'];
  dataSource = new MatTableDataSource<Recruiter>();
  totalElements = 0;
  loading = true;
  page = 0; size = 20;

  constructor(private svc: RecruiterService, private dialog: MatDialog, private notify: NotificationService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.svc.getAll(this.page, this.size).subscribe({
      next: p => { this.dataSource.data = p.content; this.totalElements = p.totalElements; this.loading = false; },
      error: () => this.loading = false
    });
  }

  applyFilter(event: Event): void {
    this.dataSource.filter = (event.target as HTMLInputElement).value.trim().toLowerCase();
  }

  openCreate(): void {
    this.dialog.open(RecruiterFormDialogComponent, { width: '700px', data: null })
      .afterClosed().subscribe(res => { if (res) { this.load(); this.notify.success('Recruteur créé avec succès'); } });
  }

  openEdit(r: Recruiter): void {
    this.dialog.open(RecruiterFormDialogComponent, { width: '700px', data: r })
      .afterClosed().subscribe(res => { if (res) { this.load(); this.notify.success('Recruteur mis à jour'); } });
  }

  toggle(r: Recruiter): void {
    this.svc.toggleStatus(r.id).subscribe({
      next: () => { this.load(); this.notify.success(r.enabled ? 'Compte désactivé' : 'Compte réactivé'); },
      error: () => this.notify.error('Erreur lors de la mise à jour')
    });
  }

  delete(r: Recruiter): void {
    this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Supprimer le recruteur', message: `Supprimer le compte de ${r.firstName} ${r.lastName} (${r.companyName}) ? Cette action est irréversible.` }
    }).afterClosed().subscribe(ok => {
      if (ok) this.svc.delete(r.id).subscribe({
        next: () => { this.load(); this.notify.success('Recruteur supprimé'); },
        error: () => this.notify.error('Erreur lors de la suppression')
      });
    });
  }

  onPage(e: PageEvent): void { this.page = e.pageIndex; this.size = e.pageSize; this.load(); }
  initials(r: Recruiter): string { return (r.firstName[0] + r.lastName[0]).toUpperCase(); }
}
