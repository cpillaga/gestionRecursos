import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from '../../models/usuario.model';
import { Rol } from '../../models/rol.models';
import { RolService } from '../../services/rol.service';
import { GrupoOcupacionalService } from '../../services/grupo-ocupacional.service';
import { AmbitoService } from '../../services/ambito.service';
import { PuestoService } from '../../services/puesto.service';

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
    public _puestoService: PuestoService,
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
    this.ContarPuestos();
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


ContarPuestos(){
  this._puestoService.countPuest().subscribe(resp=>{
    this.contPuest = resp.total;
  })
}


}
