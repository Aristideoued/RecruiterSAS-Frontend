import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AdminUserService } from '../../../core/services/admin-user.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { AdminUserFormDialogComponent } from './admin-user-form-dialog/admin-user-form-dialog.component';
import { AdminUser } from '../../../core/models';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatButtonModule,
            MatIconModule, MatDialogModule, MatProgressSpinnerModule, MatTooltipModule],
  templateUrl: './admin-users.component.html'
})
export class AdminUsersComponent implements OnInit {
  columns = ['avatar', 'name', 'email', 'status', 'createdAt', 'actions'];
  dataSource = new MatTableDataSource<AdminUser>();
  total = 0;
  loading = true;
  page = 0;
  size = 20;

  constructor(
    private svc: AdminUserService,
    private dialog: MatDialog,
    private notify: NotificationService
  ) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.svc.getAll(this.page, this.size).subscribe({
      next: p => { this.dataSource.data = p.content; this.total = p.totalElements; this.loading = false; },
      error: () => this.loading = false
    });
  }

  openCreate(): void {
    this.dialog.open(AdminUserFormDialogComponent, { width: '560px', data: null })
      .afterClosed().subscribe(r => { if (r) { this.load(); this.notify.success('Administrateur créé'); } });
  }

  openEdit(u: AdminUser): void {
    this.dialog.open(AdminUserFormDialogComponent, { width: '560px', data: u })
      .afterClosed().subscribe(r => { if (r) { this.load(); this.notify.success('Administrateur mis à jour'); } });
  }

  toggle(u: AdminUser): void {
    this.svc.toggle(u.id).subscribe({
      next: () => { this.load(); this.notify.success(u.enabled ? 'Compte désactivé' : 'Compte réactivé'); },
      error: () => this.notify.error('Erreur')
    });
  }

  delete(u: AdminUser): void {
    this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Supprimer l\'administrateur',
        message: `Supprimer le compte de ${u.firstName} ${u.lastName} ? Cette action est irréversible.`,
        confirmLabel: 'Supprimer',
        confirmColor: 'warn'
      }
    }).afterClosed().subscribe(ok => {
      if (ok) this.svc.delete(u.id).subscribe({
        next: () => { this.load(); this.notify.success('Administrateur supprimé'); },
        error: () => this.notify.error('Erreur lors de la suppression')
      });
    });
  }

  onPage(e: PageEvent): void { this.page = e.pageIndex; this.size = e.pageSize; this.load(); }
  initials(u: AdminUser): string { return (u.firstName[0] + u.lastName[0]).toUpperCase(); }
}
