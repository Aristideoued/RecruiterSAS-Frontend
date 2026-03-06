import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';
import { recruiterGuard } from './core/guards/recruiter.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Auth
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },

  // Espace Super Admin
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () => import('./layouts/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard',     loadComponent: () => import('./features/admin/dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
      { path: 'recruiters',    loadComponent: () => import('./features/admin/recruiters/recruiters.component').then(m => m.RecruitersComponent) },
      { path: 'plans',         loadComponent: () => import('./features/admin/plans/plans.component').then(m => m.PlansComponent) },
      { path: 'subscriptions', loadComponent: () => import('./features/admin/subscriptions/subscriptions.component').then(m => m.SubscriptionsComponent) },
      { path: 'job-offers',    loadComponent: () => import('./features/admin/all-offers/all-offers.component').then(m => m.AllOffersComponent) },
      { path: 'applications',  loadComponent: () => import('./features/admin/all-applications/all-applications.component').then(m => m.AllApplicationsComponent) },
      { path: 'admins',        loadComponent: () => import('./features/admin/admin-users/admin-users.component').then(m => m.AdminUsersComponent) }
    ]
  },

  // Espace Recruteur
  {
    path: 'recruiter',
    canActivate: [recruiterGuard],
    loadComponent: () => import('./layouts/recruiter-layout/recruiter-layout.component').then(m => m.RecruiterLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard',   loadComponent: () => import('./features/recruiter/dashboard/recruiter-dashboard.component').then(m => m.RecruiterDashboardComponent) },
      { path: 'job-offers',  loadComponent: () => import('./features/recruiter/job-offers/job-offers.component').then(m => m.JobOffersComponent) },
      { path: 'job-offers/:id/applications', loadComponent: () => import('./features/recruiter/applications/applications.component').then(m => m.ApplicationsComponent) },
      { path: 'applications',loadComponent: () => import('./features/recruiter/applications/applications.component').then(m => m.ApplicationsComponent) },
      { path: 'profile',     loadComponent: () => import('./features/recruiter/profile/profile.component').then(m => m.ProfileComponent) }
    ]
  },

  // Espace Public (page candidature par slug)
  {
    path: 'p/:slug',
    loadComponent: () => import('./features/public/recruiter-page/recruiter-page.component').then(m => m.RecruiterPageComponent)
  },
  {
    path: 'p/:slug/apply/:offerId',
    loadComponent: () => import('./features/public/apply/apply.component').then(m => m.ApplyComponent)
  },

  { path: '**', redirectTo: 'login' }
];
