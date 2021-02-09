import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { PAGES_ROUTES } from './pages.routes';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PagesComponent } from './pages.component';
import { SharedModule } from '../shared/shared.module';
import { HomeComponent } from './home/home.component';
import { RouterModule } from '@angular/router';
import { RolComponent } from './rol/rol.component';
import { GrupoOcupacionalComponent } from './grupo-ocupacional/grupo-ocupacional.component';
import { AmbitoComponent } from './ambito/ambito.component';
import { PuestoComponent } from './puesto/puesto.component';
import { ValorizacionComponent } from './valorizacion/valorizacion.component';
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



@NgModule({
  declarations: [HomeComponent, PagesComponent, RolComponent, GrupoOcupacionalComponent, AmbitoComponent, PuestoComponent, ValorizacionComponent, ConocimientoAdicionalComponent, ActividadEsencialComponent, ActividadCargoComponent, PuestoAddComponent, ExperienciaComponent, ExperienciaPuestoComponent, CompetenciaTecnicaComponent, CompetenciaConductualComponent, CTcomportamientoObsComponent, CccomportamientoObsComponent, CompTecPuestoComponent],
  exports: [
    PagesComponent
],
  imports: [
    BrowserModule,
    SharedModule,
    PAGES_ROUTES,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
],
})
export class PagesModule { }
