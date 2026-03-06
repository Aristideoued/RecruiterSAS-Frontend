import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive,
            MatSidenavModule, MatToolbarModule, MatIconModule, MatButtonModule,
            MatListModule, MatMenuModule, MatDividerModule, MatTooltipModule],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent {
  navItems = [
    { label: 'Dashboard',      icon: 'dashboard',           route: '/admin/dashboard' },
    { label: 'Recruteurs',     icon: 'people',               route: '/admin/recruiters' },
    { label: 'Plans',          icon: 'card_membership',      route: '/admin/plans' },
    { label: 'Abonnements',    icon: 'subscriptions',        route: '/admin/subscriptions' },
    { label: 'Toutes les offres', icon: 'work',             route: '/admin/job-offers' },
    { label: 'Candidatures',   icon: 'folder_special',       route: '/admin/applications' },
    { label: 'Administrateurs', icon: 'admin_panel_settings', route: '/admin/admins' }
  ];

  constructor(public auth: AuthService) {}
  logout(): void { this.auth.logout(); }
  get initials(): string {
    const u = this.auth.currentUser;
    return u ? (u.firstName[0] + u.lastName[0]).toUpperCase() : 'SA';
  }
}
