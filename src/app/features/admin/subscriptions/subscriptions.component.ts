import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RecruiterService } from '../../../core/services/recruiter.service';
import { SubscriptionService } from '../../../core/services/subscription.service';
import { PlanService } from '../../../core/services/plan.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { Recruiter, Plan } from '../../../core/models';

@Component({
  selector: 'app-subscriptions',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatDialogModule,
            MatProgressSpinnerModule, MatTooltipModule, MatFormFieldModule, MatInputModule,
            MatSelectModule, ReactiveFormsModule],
  templateUrl: './subscriptions.component.html'
})
export class SubscriptionsComponent implements OnInit {
  columns = ['recruiter', 'plan', 'status', 'dates', 'actions'];
  dataSource = new MatTableDataSource<Recruiter>();
  plans: Plan[] = [];
  loading = true;
  editingId: string | null = null;
  editForm!: FormGroup;

  constructor(
    private recruiterSvc: RecruiterService, private subSvc: SubscriptionService,
    private planSvc: PlanService, private dialog: MatDialog,
    private notify: NotificationService, private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.planSvc.getAll(true).subscribe(p => this.plans = p);
    this.load();
  }

  load(): void {
    this.loading = true;
    this.recruiterSvc.getAll(0, 100).subscribe({
      next: p => { this.dataSource.data = p.content; this.loading = false; },
      error: () => this.loading = false
    });
  }

  startEdit(r: Recruiter): void {
    this.editingId = r.id;
    this.editForm = this.fb.group({
      planId: [r.subscription?.plan?.id || ''],
      status: [r.subscription?.status || 'ACTIVE']
    });
  }

  saveEdit(r: Recruiter): void {
    this.subSvc.update(r.id, this.editForm.value).subscribe({
      next: () => { this.editingId = null; this.load(); this.notify.success('Abonnement mis à jour'); },
      error: () => this.notify.error('Erreur')
    });
  }

  suspend(r: Recruiter): void {
    this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Suspendre l\'abonnement', message: `Suspendre le compte de ${r.companyName} ?`, confirmLabel: 'Suspendre', confirmColor: 'warn' }
    }).afterClosed().subscribe(ok => {
      if (ok) this.subSvc.suspend(r.id).subscribe({ next: () => { this.load(); this.notify.success('Abonnement suspendu'); }, error: () => this.notify.error('Erreur') });
    });
  }

  reactivate(r: Recruiter): void {
    this.subSvc.reactivate(r.id).subscribe({ next: () => { this.load(); this.notify.success('Abonnement réactivé'); }, error: () => this.notify.error('Erreur') });
  }
}
