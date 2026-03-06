import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthResponse, LoginRequest } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'rs_token';
  private readonly REFRESH_KEY = 'rs_refresh';
  private readonly USER_KEY = 'rs_user';

  private userSubject = new BehaviorSubject<AuthResponse | null>(this.storedUser);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, request).pipe(
      tap(res => {
        localStorage.setItem(this.TOKEN_KEY, res.token);
        localStorage.setItem(this.REFRESH_KEY, res.refreshToken);
        localStorage.setItem(this.USER_KEY, JSON.stringify(res));
        this.userSubject.next(res);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  get token(): string | null { return localStorage.getItem(this.TOKEN_KEY); }
  get currentUser(): AuthResponse | null { return this.userSubject.value; }
  get isAdmin(): boolean { return this.currentUser?.role === 'SUPER_ADMIN'; }
  get isRecruiter(): boolean { return this.currentUser?.role === 'RECRUITER'; }
  get isAuthenticated(): boolean { return !!this.token; }

  private get storedUser(): AuthResponse | null {
    const s = localStorage.getItem(this.USER_KEY);
    return s ? JSON.parse(s) : null;
  }
}
