
import { LoginComponent } from './login/login.component';
import { Routes, RouterModule } from '@angular/router';


const appRoutes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: '**', redirectTo: '/login', pathMatch: 'full' }
];

export const APP_ROUTES = RouterModule.forRoot(appRoutes, { useHash: true, relativeLinkResolution: 'legacy' });