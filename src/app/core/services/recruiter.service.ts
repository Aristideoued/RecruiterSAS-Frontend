import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PageResponse, Recruiter, RegisterRecruiterRequest, UpdateRecruiterRequest } from '../models';

@Injectable({ providedIn: 'root' })
export class RecruiterService {
  private url = `${environment.apiUrl}/admin/recruiters`;

  constructor(private http: HttpClient) {}

  getAll(page = 0, size = 20): Observable<PageResponse<Recruiter>> {
    return this.http.get<PageResponse<Recruiter>>(this.url, { params: { page, size } });
  }
  getById(id: string): Observable<Recruiter> {
    return this.http.get<Recruiter>(`${this.url}/${id}`);
  }
  getBySlug(slug: string): Observable<Recruiter> {
    return this.http.get<Recruiter>(`${environment.apiUrl}/public/recruiters/${slug}`);
  }
  getMyProfile(): Observable<Recruiter> {
    return this.http.get<Recruiter>(`${environment.apiUrl}/recruiter/profile`);
  }
  create(data: RegisterRecruiterRequest): Observable<Recruiter> {
    return this.http.post<Recruiter>(this.url, data);
  }
  update(id: string, data: UpdateRecruiterRequest): Observable<Recruiter> {
    return this.http.put<Recruiter>(`${this.url}/${id}`, data);
  }
  updateMyProfile(id: string, data: UpdateRecruiterRequest): Observable<Recruiter> {
    return this.http.put<Recruiter>(`${this.url}/${id}`, data);
  }
  toggleStatus(id: string): Observable<void> {
    return this.http.patch<void>(`${this.url}/${id}/toggle`, {});
  }
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
