import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Plan, PlanRequest } from '../models';

@Injectable({ providedIn: 'root' })
export class PlanService {
  private url = `${environment.apiUrl}/admin/plans`;

  constructor(private http: HttpClient) {}

  getAll(onlyActive = false): Observable<Plan[]> {
    return this.http.get<Plan[]>(this.url, { params: { onlyActive } });
  }
  getPublicPlans(): Observable<Plan[]> {
    return this.http.get<Plan[]>(`${environment.apiUrl}/public/plans`);
  }
  getById(id: string): Observable<Plan> {
    return this.http.get<Plan>(`${this.url}/${id}`);
  }
  create(data: PlanRequest): Observable<Plan> {
    return this.http.post<Plan>(this.url, data);
  }
  update(id: string, data: PlanRequest): Observable<Plan> {
    return this.http.put<Plan>(`${this.url}/${id}`, data);
  }
  toggle(id: string): Observable<void> {
    return this.http.patch<void>(`${this.url}/${id}/toggle`, {});
  }
}
