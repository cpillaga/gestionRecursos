import { PagesComponent } from './pages.component';
import { HomeComponent } from './home/home.component';
import { RouterModule, Routes } from '@angular/router';
import { RolComponent } from './rol/rol.component';
import { GrupoOcupacionalComponent } from './grupo-ocupacional/grupo-ocupacional.component';
import { AmbitoComponent } from './ambito/ambito.component';
import { CompetenciaComponent } from './competencia/competencia.component';
import { ProcesoComponent } from './proceso/proceso.component';
import { ActividadComponent } from './actividad/actividad.component';
import { PuestoComponent } from './puesto/puesto.component';
import { ActividadPuestoComponent } from './actividad-puesto/actividad-puesto.component';



const pagesRoutes: Routes = [
    {
        path: '',
        component: PagesComponent,
        children: [
        { path: 'inicio', component: HomeComponent },
        { path: 'rol', component: RolComponent },
        { path: 'grupoOcupacional', component: GrupoOcupacionalComponent }, 
        { path: 'competencia', component: CompetenciaComponent }, 
        { path: 'ambito', component: AmbitoComponent },
        { path: 'proceso', component: ProcesoComponent },
        { path: 'actividad', component: ActividadComponent },
        { path: 'puesto', component: PuestoComponent },
        { path: 'actividadPuesto', component: ActividadPuestoComponent },
        { path: '', redirectTo: '/login', pathMatch: 'full' }
        ]
    }
];

export const PAGES_ROUTES = RouterModule.forChild(pagesRoutes);