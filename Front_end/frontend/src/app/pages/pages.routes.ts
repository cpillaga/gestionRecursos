import { PagesComponent } from './pages.component';
import { HomeComponent } from './home/home.component';
import { RouterModule, Routes } from '@angular/router';
import { RolComponent } from './rol/rol.component';
import { GrupoOcupacionalComponent } from './grupo-ocupacional/grupo-ocupacional.component';
import { AmbitoComponent } from './ambito/ambito.component';
import { PuestoComponent } from './puesto/puesto.component';
import { ConocimientoAdicionalComponent } from './conocimiento-adicional/conocimiento-adicional.component';
import { ActividadEsencialComponent } from './actividad-esencial/actividad-esencial.component';
import { ActividadCargoComponent } from './actividad-cargo/actividad-cargo.component';
import { PuestoAddComponent } from './puesto-add/puesto-add.component';
import { ExperienciaComponent } from './experiencia/experiencia.component';
import { ExperienciaPuestoComponent } from './experiencia-puesto/experiencia-puesto.component';
import { CompetenciaTecnicaComponent } from './competencia-tecnica/competencia-tecnica.component';
import { CompetenciaConductualComponent } from './competencia-conductual/competencia-conductual.component';
import { CTcomportamientoObsComponent } from './ctcomportamiento-obs/ctcomportamiento-obs.component';
import { CccomportamientoObsComponent } from './cccomportamiento-obs/cccomportamiento-obs.component';
import { CompTecPuestoComponent } from './comp-tec-puesto/comp-tec-puesto.component';



const pagesRoutes: Routes = [
    {
        path: '',
        component: PagesComponent,
        children: [
        { path: 'inicio', component: HomeComponent },
        { path: 'rol', component: RolComponent },
        { path: 'grupoOcupacional', component: GrupoOcupacionalComponent }, 
        { path: 'ambito', component: AmbitoComponent },
        { path: 'puesto', component: PuestoComponent }, 
        { path: 'conocimiento', component: ConocimientoAdicionalComponent},  
        { path: 'actividadesEsenciales', component: ActividadEsencialComponent},
        { path: 'actividadesCargo', component: ActividadCargoComponent},
        { path: 'addpuesto', component: PuestoAddComponent},
        { path: 'experiencia', component: ExperienciaComponent},
        { path: 'experienciaPuesto', component: ExperienciaPuestoComponent},
        { path: 'competenciaTecnica', component: CompetenciaTecnicaComponent},
        { path: 'competenciaConductual', component: CompetenciaConductualComponent}, 
        { path: 'ctComportamiento', component: CTcomportamientoObsComponent},
        { path: 'ccComportamiento', component: CccomportamientoObsComponent},
        { path: 'compTecPuesto', component: CompTecPuestoComponent},
        { path: '', redirectTo: '/login', pathMatch: 'full' }
        ]
    }
];

export const PAGES_ROUTES = RouterModule.forChild(pagesRoutes);