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
import { CompetenciaComponent } from './competencia/competencia.component';
import { ProcesoComponent } from './proceso/proceso.component';
import { ActividadComponent } from './actividad/actividad.component';
import { PuestoComponent } from './puesto/puesto.component';
import { ActividadPuestoComponent } from './actividad-puesto/actividad-puesto.component';
import { ValorizacionComponent } from './valorizacion/valorizacion.component';
import { ActPuestCompetenciaComponent } from './act-puest-competencia/act-puest-competencia.component';



@NgModule({
  declarations: [HomeComponent, PagesComponent, RolComponent, GrupoOcupacionalComponent, AmbitoComponent, CompetenciaComponent, ProcesoComponent, ActividadComponent, PuestoComponent, ActividadPuestoComponent, ValorizacionComponent, ActPuestCompetenciaComponent],
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
