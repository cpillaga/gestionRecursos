import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from '../../models/usuario.model';
import { Rol } from '../../models/rol.models';
import { RolService } from '../../services/rol.service';
import { GrupoOcupacionalService } from '../../services/grupo-ocupacional.service';
import { AmbitoService } from '../../services/ambito.service';
import { CompetenciaService } from 'src/app/services/competencia.service';
import { ProcesoService } from '../../services/proceso.service';
import { ActividadService } from '../../services/actividad.service';
import { PuestoService } from '../../services/puesto.service';
import { ActividadPuestoService } from '../../services/actividad-puesto.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: [
  ]
})
export class HomeComponent implements OnInit {
  empRol: Usuario;
  contRol: string = "";
  contAmb: string = "";
  contGrup: string = "";
  contComp : string = "";
  contPro : string= "";
  contAct : string= "";
  contPuest : string= "";
  contActPuest: string = "";
  constructor(
    public router:Router,
    public _rolService:RolService,
    public _grupoOcupacionalService:GrupoOcupacionalService,
    public _ambitoService: AmbitoService,
    public _competenciaService: CompetenciaService,
    public _procesoService: ProcesoService,
    public _actividadService: ActividadService,
    public _puestoService: PuestoService,
    public _actividadPuesto: ActividadPuestoService,
  ) { }

  ngOnInit(): void {
    if(localStorage.getItem('tokenFact') == null){
      this.router.navigate(['/login'])
      .then(() => {
        window.location.reload();
      });
    }

    this.empRol = JSON.parse(localStorage.getItem('empFact'));
  
    if(this.empRol.rol != "Administrador"){
      this.router.navigate(['/login']);
      console.log("entroo");
      return;
    }
    this.ContarRol();
    this.ContarGrupo();
    this.ContarAmbito();
    this.ContarCompetencia();
    this.ContarProceso();
    this.ContarActividad();
    this.ContarPuestos();
    this.ContarActividadPuesto();

  }

ContarRol(){
  this._rolService.countRol().subscribe(resp=>{
    this.contRol = resp.total;
  })
}

ContarGrupo(){
  this._grupoOcupacionalService.countGrup().subscribe(resp=>{
    this.contGrup = resp.total;
  })
}

ContarAmbito(){
  this._ambitoService.countAmb().subscribe(resp=>{
    this.contAmb = resp.total;
  })
}

ContarCompetencia(){
  this._competenciaService.countComp().subscribe(resp=>{
    this.contComp = resp.total;
  })
}

ContarProceso(){
  this._procesoService.countPro().subscribe(resp=>{
    this.contPro = resp.total;
  })
}
ContarActividad(){
  this._actividadService.countAct().subscribe(resp=>{
    this.contAct = resp.total;
  })
}

ContarPuestos(){
  this._puestoService.countPuest().subscribe(resp=>{
    this.contPuest = resp.total;
  })
}

ContarActividadPuesto(){
  this._actividadPuesto.countActPuest().subscribe(resp=>{
    this.contActPuest = resp.total;
  })
}

}
