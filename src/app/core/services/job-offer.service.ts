import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { JobOffer, JobOfferRequest, JobOfferStatus, PageResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class JobOfferService {
  private recruiterUrl = `${environment.apiUrl}/recruiter/job-offers`;
  private adminUrl = `${environment.apiUrl}/admin/job-offers`;

  constructor(private http: HttpClient) {}

  // Recruteur
  getMyOffers(status?: JobOfferStatus, page = 0, size = 10): Observable<PageResponse<JobOffer>> {
    const params: any = { page, size };
    if (status) params['status'] = status;
    return this.http.get<PageResponse<JobOffer>>(this.recruiterUrl, { params });
  }
  getById(id: string): Observable<JobOffer> {
    return this.http.get<JobOffer>(`${this.recruiterUrl}/${id}`);
  }
  create(data: JobOfferRequest): Observable<JobOffer> {
    return this.http.post<JobOffer>(this.recruiterUrl, data);
  }
  update(id: string, data: JobOfferRequest): Observable<JobOffer> {
    return this.http.put<JobOffer>(`${this.recruiterUrl}/${id}`, data);
  }
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.recruiterUrl}/${id}`);
  }
  publish(id: string): Observable<void> {
    return this.http.patch<void>(`${this.recruiterUrl}/${id}/publish`, {});
  }
  close(id: string): Observable<void> {
    return this.http.patch<void>(`${this.recruiterUrl}/${id}/close`, {});
  }
  archive(id: string): Observable<void> {
    return this.http.patch<void>(`${this.recruiterUrl}/${id}/archive`, {});
  }
  unarchive(id: string): Observable<void> {
    return this.http.patch<void>(`${this.recruiterUrl}/${id}/unarchive`, {});
  }

  // Public
  getPublicOffers(slug: string, page = 0, size = 10): Observable<PageResponse<JobOffer>> {
    return this.http.get<PageResponse<JobOffer>>(`${environment.apiUrl}/public/recruiters/${slug}/offers`, { params: { page, size } });
  }
  getPublicOffer(offerId: string): Observable<JobOffer> {
    return this.http.get<JobOffer>(`${environment.apiUrl}/public/offers/${offerId}`);
  }

  // Admin
  getAllOffers(status?: JobOfferStatus, page = 0, size = 20): Observable<PageResponse<JobOffer>> {
    const params: any = { page, size };
    if (status) params['status'] = status;
    return this.http.get<PageResponse<JobOffer>>(this.adminUrl, { params });
  }
}
