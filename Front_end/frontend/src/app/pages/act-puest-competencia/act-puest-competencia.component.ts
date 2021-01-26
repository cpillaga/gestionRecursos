import { Component, OnInit, ViewChild } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { ActPuestCompetenciaService } from '../../services/act-puest-competencia.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Actpuescomp } from '../../models/actpuescomp.models';

@Component({
  selector: 'app-act-puest-competencia',
  templateUrl: './act-puest-competencia.component.html',
  styleUrls: ['./act-puest-competencia.component.css']
})
export class ActPuestCompetenciaComponent implements OnInit {
  empRol: Usuario;
  actsPuestsComps:Actpuescomp[] = [];
  @ViewChild('closebuttonadd',  {static: false}) closebuttonadd;
  @ViewChild('closebuttonupd',  {static: false}) closebuttonupd;

  constructor(
    
    public _actPuestComp: ActPuestCompetenciaService,
    public router:Router,
    public toastr: ToastrService, 
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
      return;
    }
    this.getActPuestCompetencia);  
  this.ContarActPuestCompetencia();
  }

  getActPuestCompetencia(){
    this._actPuestComp.getActPuestCompetencia().subscribe(resp => {
      console.log(resp);
      this.actsPuestsComps = resp.actividad;
    })
  }
  
  ContarActividad(){
    this._actividad.countAct().subscribe(resp=>{
      this.contAct = resp.total;
    })
  }
 
}
