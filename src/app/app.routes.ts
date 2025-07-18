import { Routes } from '@angular/router';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { Login } from './components/login/login';
import { AuthGuard } from './guards/auth-guard';
import { Inicio } from './components/inicio/inicio';
import { Core } from './components/core/core';
import { Feliz } from './components/feliz/feliz';
import { Ser } from './components/ser/ser';

export const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'inicio', component: Inicio },
  { path: 'core', component: Core },
  { path: 'feliz', component: Feliz },
  { path: 'ser', component: Ser },
  { path: 'login', component: Login, canActivate: [AuthGuard] },
  { path: 'welcome', component: WelcomeComponent, canActivate: [AuthGuard] }
];
