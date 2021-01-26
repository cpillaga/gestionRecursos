import { PagesComponent } from './pages.component';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';



const pagesRoutes: Routes = [
    {
        path: '',
        component: PagesComponent,
        children: [
        { path: 'inicio', component: HomeComponent },
        { path: '', redirectTo: '/login', pathMatch: 'full' }
        ]
    }
];

export const PAGES_ROUTES = RouterModule.forChild(pagesRoutes);