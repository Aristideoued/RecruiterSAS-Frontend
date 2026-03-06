import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AdminUser, CreateAdminRequest, UpdateAdminRequest, PageResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class AdminUserService {
  private url = `${environment.apiUrl}/admin/admins`;

  constructor(private http: HttpClient) {}

  getAll(page = 0, size = 20): Observable<PageResponse<AdminUser>> {
    return this.http.get<PageResponse<AdminUser>>(this.url, { params: { page, size } });
  }

  create(data: CreateAdminRequest): Observable<AdminUser> {
    return this.http.post<AdminUser>(this.url, data);
  }

  update(id: string, data: UpdateAdminRequest): Observable<AdminUser> {
    return this.http.put<AdminUser>(`${this.url}/${id}`, data);
  }

  toggle(id: string): Observable<void> {
    return this.http.patch<void>(`${this.url}/${id}/toggle`, {});
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
