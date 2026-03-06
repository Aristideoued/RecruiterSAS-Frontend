import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Subscription } from '../models';

@Injectable({ providedIn: 'root' })
export class SubscriptionService {
  private base = `${environment.apiUrl}/admin/recruiters`;

  constructor(private http: HttpClient) {}

  getByRecruiter(recruiterId: string): Observable<Subscription> {
    return this.http.get<Subscription>(`${this.base}/${recruiterId}/subscription`);
  }
  update(recruiterId: string, data: { planId: string; status: string; endDate?: string }): Observable<Subscription> {
    return this.http.put<Subscription>(`${this.base}/${recruiterId}/subscription`, data);
  }
  suspend(recruiterId: string): Observable<void> {
    return this.http.patch<void>(`${this.base}/${recruiterId}/subscription/suspend`, {});
  }
  reactivate(recruiterId: string): Observable<void> {
    return this.http.patch<void>(`${this.base}/${recruiterId}/subscription/reactivate`, {});
  }
  getMySubscription(): Observable<Subscription> {
    return this.http.get<Subscription>(`${environment.apiUrl}/recruiter/profile`);
  }
}
