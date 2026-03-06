import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-recruiter-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive,
            MatSidenavModule, MatToolbarModule, MatIconModule, MatButtonModule,
            MatMenuModule, MatDividerModule, MatTooltipModule],
  templateUrl: './recruiter-layout.component.html',
  styleUrls: ['./recruiter-layout.component.scss']
})
export class RecruiterLayoutComponent {
  navItems = [
    { label: 'Dashboard',        icon: 'dashboard',         route: '/recruiter/dashboard' },
    { label: 'Mes offres',       icon: 'work',              route: '/recruiter/job-offers' },
    { label: 'Candidatures',     icon: 'people_alt',        route: '/recruiter/applications' },
    { label: 'Mon profil',       icon: 'business',          route: '/recruiter/profile' }
  ];

  constructor(public auth: AuthService) {}
  logout(): void { this.auth.logout(); }
  get initials(): string {
    const u = this.auth.currentUser;
    return u ? (u.firstName[0] + u.lastName[0]).toUpperCase() : 'RH';
  }
}
