import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { JobOfferService } from '../../../core/services/job-offer.service';
import { JobOffer, JobOfferStatus } from '../../../core/models';

@Component({
  selector: 'app-all-offers',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatButtonModule,
            MatIconModule, MatProgressSpinnerModule, MatTooltipModule,
            MatSelectModule, MatFormFieldModule, FormsModule],
  templateUrl: './all-offers.component.html'
})
export class AllOffersComponent implements OnInit {
  columns = ['title', 'recruiter', 'status', 'applications', 'dates'];
  dataSource = new MatTableDataSource<JobOffer>();
  loading = true;
  total = 0;
  page = 0;
  size = 20;
  statusFilter: JobOfferStatus | '' = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private svc: JobOfferService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.svc.getAllOffers(this.statusFilter || undefined, this.page, this.size).subscribe({
      next: p => {
        this.dataSource.data = p.content;
        this.total = p.totalElements;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  onPage(e: PageEvent): void {
    this.page = e.pageIndex;
    this.size = e.pageSize;
    this.load();
  }
}
