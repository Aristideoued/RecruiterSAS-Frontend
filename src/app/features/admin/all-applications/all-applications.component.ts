import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApplicationService } from '../../../core/services/application.service';
import { JobApplication } from '../../../core/models';

@Component({
  selector: 'app-all-applications',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatButtonModule,
            MatIconModule, MatProgressSpinnerModule],
  templateUrl: './all-applications.component.html'
})
export class AllApplicationsComponent implements OnInit {
  columns = ['candidate', 'offer', 'status', 'rating', 'submittedAt'];
  dataSource = new MatTableDataSource<JobApplication>();
  statusLabels: Record<string, string> = {
    PENDING: 'En attente', REVIEWED: 'Examinée', SHORTLISTED: 'Présélectionnée',
    REJECTED: 'Rejetée', HIRED: 'Recrutée'
  };
  loading = true;
  total = 0;
  page = 0;
  size = 20;

  constructor(private svc: ApplicationService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.svc.getAdminAll(this.page, this.size).subscribe({
      next: p => { this.dataSource.data = p.content; this.total = p.totalElements; this.loading = false; },
      error: () => this.loading = false
    });
  }

  onPage(e: PageEvent): void { this.page = e.pageIndex; this.size = e.pageSize; this.load(); }

  stars(n: number): number[] { return Array(n).fill(0); }
}
