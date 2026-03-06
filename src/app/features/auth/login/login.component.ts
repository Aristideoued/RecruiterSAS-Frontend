import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule,
            MatInputModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  form: FormGroup;
  loading = false;
  hidePassword = true;

  constructor(private fb: FormBuilder, private auth: AuthService,
              private router: Router, private notify: NotificationService) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
    // Rediriger si déjà connecté
    if (this.auth.isAdmin) this.router.navigate(['/admin/dashboard']);
    else if (this.auth.isRecruiter) this.router.navigate(['/recruiter/dashboard']);
  }

  submit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.auth.login(this.form.value).subscribe({
      next: res => {
        this.loading = false;
        if (res.role === 'SUPER_ADMIN') this.router.navigate(['/admin/dashboard']);
        else this.router.navigate(['/recruiter/dashboard']);
      },
      error: err => {
        this.loading = false;
        this.notify.error(err.error?.message || 'Email ou mot de passe incorrect');
      }
    });
  }
}
