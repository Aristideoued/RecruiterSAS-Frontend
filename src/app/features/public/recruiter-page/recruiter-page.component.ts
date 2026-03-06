import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { RecruiterService } from '../../../core/services/recruiter.service';
import { JobOfferService } from '../../../core/services/job-offer.service';
import { Recruiter, JobOffer } from '../../../core/models';

@Component({
  selector: 'app-recruiter-page',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule,
            MatProgressSpinnerModule, MatChipsModule],
  templateUrl: './recruiter-page.component.html',
  styleUrls: ['./recruiter-page.component.scss']
})
export class RecruiterPageComponent implements OnInit {
  recruiter: Recruiter | null = null;
  offers: JobOffer[] = [];
  loading = true;
  slug = '';

  constructor(
    private route: ActivatedRoute,
    private recruiterSvc: RecruiterService,
    private offerSvc: JobOfferService
  ) {}

  ngOnInit(): void {
    this.slug = this.route.snapshot.paramMap.get('slug')!;
    this.recruiterSvc.getBySlug(this.slug).subscribe({
      next: r => {
        this.recruiter = r;
        this.offerSvc.getPublicOffers(this.slug, 0, 50).subscribe({
          next: p => { this.offers = p.content; this.loading = false; },
          error: () => this.loading = false
        });
      },
      error: () => this.loading = false
    });
  }
}
