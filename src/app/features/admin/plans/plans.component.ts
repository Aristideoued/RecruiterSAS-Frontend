import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PlanService } from '../../../core/services/plan.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { PlanFormDialogComponent } from './plan-form-dialog/plan-form-dialog.component';
import { Plan } from '../../../core/models';

@Component({
  selector: 'app-plans',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule,
            MatDialogModule, MatProgressSpinnerModule, MatTooltipModule],
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.scss']
})
export class PlansComponent implements OnInit {
  columns = ['name', 'price', 'limits', 'features', 'status', 'actions'];
  dataSource = new MatTableDataSource<Plan>();
  loading = true;

  constructor(private svc: PlanService, private dialog: MatDialog, private notify: NotificationService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.svc.getAll().subscribe({ next: p => { this.dataSource.data = p; this.loading = false; }, error: () => this.loading = false });
  }

  openForm(plan?: Plan): void {
    this.dialog.open(PlanFormDialogComponent, { width: '580px', data: plan || null })
      .afterClosed().subscribe(r => { if (r) { this.load(); this.notify.success(plan ? 'Plan mis à jour' : 'Plan créé'); } });
  }

  toggle(plan: Plan): void {
    this.svc.toggle(plan.id).subscribe({ next: () => { this.load(); this.notify.info(`Plan ${plan.active ? 'désactivé' : 'activé'}`); }, error: () => this.notify.error('Erreur') });
  }
}
