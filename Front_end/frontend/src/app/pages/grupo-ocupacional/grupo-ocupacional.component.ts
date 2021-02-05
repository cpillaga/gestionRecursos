import { Component, OnInit, ViewChild } from '@angular/core';
import { GrupoOcupacionalService } from '../../services/grupo-ocupacional.service';
import { GrupoOcupacional } from '../../models/grupoOcupacional.models';
import { Usuario } from '../../models/usuario.model';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-grupo-ocupacional',
  templateUrl: './grupo-ocupacional.component.html',
  styleUrls: ['./grupo-ocupacional.component.css']
})
export class GrupoOcupacionalComponent implements OnInit {

  gruposOcupacionales:GrupoOcupacional[] = [];
  desGrup: String = "";
  minval: String = "";
  maxval: String = "";
  getDataGrup: GrupoOcupacional;
  desGrupU: string;
  minGrupU: string;
  maxGrupU: string;
  dataUpdGrup:Boolean= false;
  coincidencia:Boolean= false;
  buscarGrup: string = "";
  empRol: Usuario;
  contGrup: string = "";
  @ViewChild('closebuttonadd',  {static: false}) closebuttonadd;
   @ViewChild('closebuttonupd',  {static: false}) closebuttonupd;
  constructor(
    public _grupoOcupacional: GrupoOcupacionalService,
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
    this.getGrupoOcupacional();
    this.ContarGrupo();
  }

  getGrupoOcupacional(){
    this._grupoOcupacional.getGrupoOcupacional().subscribe(resp => {
      console.log(resp);
      this.gruposOcupacionales = resp.grupoOcp;
    })
  }


  addGruposOcupacionales(grupoOcupacional:NgForm){
       for (let i = 0; i < this.gruposOcupacionales.length; i++) {
      if (grupoOcupacional.value.desGrup === this.gruposOcupacionales[i].descripcion) {
        Swal.fire({
          title: 'ya exise el grupo Ocupacional!',
           icon: 'warning'
         });
          return;
      }
    }
    this._grupoOcupacional.agregarGrupoOcupacional(grupoOcupacional.value.desGrup, grupoOcupacional.value.minval, grupoOcupacional.value.maxval).subscribe(resp => {
      console.log(resp);
      this.getGrupoOcupacional();
      this.ContarGrupo();
      this.closebuttonadd.nativeElement.click();
      this.toastr.success('Agregado Correctamente', 'Correcto');
    })
  }

  getDataGrupoOcupacional(grupoOcupacional: GrupoOcupacional){
    this.getDataGrup = grupoOcupacional;
    this.desGrupU = grupoOcupacional.descripcion;
    this.minGrupU = grupoOcupacional.minVal;
    this.maxGrupU = grupoOcupacional.maxVal;
    this.dataUpdGrup = true;
  }

  updGrupos(form: NgForm){
console.log(form.value);
    this._grupoOcupacional.updGrupo(form.value.desGrupU, this.getDataGrup._id, form.value.minGrupU, form.value.maxGrupU).subscribe(correcto => {
      this.getGrupoOcupacional();
       this.closebuttonupd.nativeElement.click();
       this.toastr.success('Modificado Correctamente', 'Correcto');
    });
  }

  eliminarGrupo(form:GrupoOcupacional){
  Swal.fire({
    title: 'Esta seguro?',
    text: 'desea elimniar el registro!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Si, eliminar!',
    cancelButtonText: 'No, Cancelar'
  }).then((result) => {
    if (result.value) {
    this._grupoOcupacional.delGrup(form._id).subscribe(resp =>{
     this.getGrupoOcupacional();
     this.ContarGrupo();
     this.toastr.success('Eliminado Correctamente', 'Correcto');
   })
    } 
  })
  
  }
  
    
  habilitarGrupo(form: GrupoOcupacional){
  Swal.fire({
    title: 'Esta seguro?',
    text: 'desea Habilitar el registro!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Si, Habilitar!',
    cancelButtonText: 'No, Cancelar'
  }).then((result) => {
    if (result.value) {
      this._grupoOcupacional.habGrup(form._id).subscribe(resp =>{
        this.getGrupoOcupacional();
        this.ContarGrupo();
        this.toastr.success('Habilitado Correctamente', 'Correcto');
      })
    }
  })
  }
  
searchGrup(buscar: NgForm){
  console.log("entrooo");
  if(buscar.value.buscarGrup == "" ){
    this.coincidencia = true;
    this.getGrupoOcupacional();
  }else{
    this._grupoOcupacional.searchGrup(buscar.value.buscarGrup).subscribe(correcto => {
      if(correcto.length === 0 ){
          this.coincidencia = false;
          return;
      }else{
        this.coincidencia = true;
        this.gruposOcupacionales = correcto;
      }
    });
  }
}
ContarGrupo(){
  this._grupoOcupacional.countGrup().subscribe(resp=>{
    this.contGrup = resp.total;
  })
}

}
