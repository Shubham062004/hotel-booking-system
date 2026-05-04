import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HotelListComponent } from './components/hotel-list/hotel-list.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'hotels',
    component: HotelListComponent,
    canActivate: [authGuard],
  },
  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [authGuard],
    data: { role: 'ADMIN' },
  },
  { path: '**', redirectTo: '/login' },
];
