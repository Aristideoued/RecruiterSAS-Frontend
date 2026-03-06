import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApplicationStatus, JobApplication, JobApplicationRequest, PageResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class ApplicationService {
  private base = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Recruteur — toutes ses candidatures
  getAll(status?: ApplicationStatus, page = 0, size = 20): Observable<PageResponse<JobApplication>> {
    const params: any = { page, size };
    if (status) params['status'] = status;
    return this.http.get<PageResponse<JobApplication>>(`${this.base}/recruiter/applications`, { params });
  }

  // Par offre
  getByOffer(offerId: string, status?: ApplicationStatus, page = 0, size = 20): Observable<PageResponse<JobApplication>> {
    const params: any = { page, size };
    if (status) params['status'] = status;
    return this.http.get<PageResponse<JobApplication>>(`${this.base}/recruiter/job-offers/${offerId}/applications`, { params });
  }

  getById(id: string): Observable<JobApplication> {
    return this.http.get<JobApplication>(`${this.base}/recruiter/applications/${id}`);
  }

  updateStatus(id: string, status: ApplicationStatus, notes?: string, rating?: number): Observable<JobApplication> {
    return this.http.patch<JobApplication>(`${this.base}/recruiter/applications/${id}/status`, { status, recruiterNotes: notes, rating: rating || null });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/recruiter/applications/${id}`);
  }

  triggerScoring(id: string): Observable<void> {
    return this.http.post<void>(`${this.base}/recruiter/applications/${id}/score`, {});
  }

  // Admin — toutes les candidatures
  getAdminAll(page = 0, size = 20): Observable<PageResponse<JobApplication>> {
    return this.http.get<PageResponse<JobApplication>>(`${this.base}/admin/applications`, { params: { page, size } });
  }

  // Public — postuler
  submit(offerId: string, data: JobApplicationRequest, files: File[]): Observable<JobApplication> {
    const form = new FormData();
    form.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));
    files.forEach(f => form.append('files', f, f.name));
    return this.http.post<JobApplication>(`${this.base}/public/offers/${offerId}/apply`, form);
  }

  // Télécharger un fichier
  downloadFile(fileId: string): Observable<Blob> {
    return this.http.get(`${this.base}/files/${fileId}`, { responseType: 'blob' });
  }
}
