import { Component, OnInit, ViewChild } from '@angular/core';
import { ActividadPuestoService } from '../../services/actividad-puesto.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Usuario } from 'src/app/models/usuario.model';
import { ActividadPuesto } from '../../models/actividadPuesto.models';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-actividad-puesto',
  templateUrl: './actividad-puesto.component.html',
  styleUrls: ['./actividad-puesto.component.css']
})
export class ActividadPuestoComponent implements OnInit {
  actividadesPuestos:ActividadPuesto[] = [];
  desActPuest: String = "";
  tipoActPuest: String = "";
  actActPuest: String = "";
  puestActPuest: String = "";
  desActPuestU: String = "";
  tipoActPuestU: String = "";
  actActPuestU: String = "";
  puestActPuestU: String = "";
  buscarActPuest: string = "";
  contActPuest: string = "";
  dataUpdActPuest:Boolean= false;
  coincidencia:Boolean= false;
  getDataActPuest: ActividadPuesto;
  empRol: Usuario;
  @ViewChild('closebuttonadd',  {static: false}) closebuttonadd;
  @ViewChild('closebuttonupd',  {static: false}) closebuttonupd;

  constructor(
    public _actividadPuesto: ActividadPuestoService,
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
    this.getActividadPuesto();
    this.ContarActividadPuesto();
  }
  
  getActividadPuesto(){
    this._actividadPuesto.getActividadPuesto().subscribe(resp => {
      console.log(resp);
      this.actividadesPuestos = resp.actividadPuesto;
    })
  }

  
  addActividadesPuestos(actividadPuesto:NgForm){
    for (let i = 0; i < this.actividadesPuestos.length; i++) {
   if (actividadPuesto.value.desGrup === this.actividadesPuestos[i].descripcion) {
     alert("ya Existe el Actividad-Puesto");
     return;
   }
 }
 this._actividadPuesto.agregarActividadPuesto(actividadPuesto.value.desActPuest, actividadPuesto.value.tipoActPuest, actividadPuesto.value.actActPuest, actividadPuesto.value.puestActPuest).subscribe(resp => {
   console.log(resp);
   this.getActividadPuesto();
   this.ContarActividadPuesto();
   this.closebuttonadd.nativeElement.click();
   this.toastr.success('Agregado Correctamente', 'Correcto');
 })
}

getDataActividadPuesto(actividadPuesto: ActividadPuesto){
 this.getDataActPuest = actividadPuesto;

 this.desActPuestU = actividadPuesto.descripcion;
 this.tipoActPuestU = actividadPuesto.tipo;
 this.actActPuestU = actividadPuesto.actividad;
 this.puestActPuestU = actividadPuesto.puesto;
 this.dataUpdActPuest = true;
}


updActividadPuesto(form: NgForm){
  console.log(form.value);
      this._actividadPuesto.updActividadPuesto(form.value.desActPuestU, this.getDataActPuest._id, form.value.tipoActPuestU, form.value.actActPuestU, form.value.puestActPuestU).subscribe(correcto => {
        this.getActividadPuesto();
         this.closebuttonupd.nativeElement.click();
         this.toastr.success('Modificado Correctamente', 'Correcto');
      });
    }
  

    eliminarActividadPuesto(form:ActividadPuesto){
      Swal.fire({
        title: 'Esta seguro?',
        text: 'desea elimniar el registro!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si, eliminar!',
        cancelButtonText: 'No, Cancelar'
      }).then((result) => {
        if (result.value) {
        this._actividadPuesto.delActPuest(form._id).subscribe(resp =>{
         this.getActividadPuesto();
         this.ContarActividadPuesto();
         this.toastr.success('Eliminado Correctamente', 'Correcto');
       })
        } 
      })
      
      }
      
        
      habilitarActividadPuesto(form: ActividadPuesto){
      Swal.fire({
        title: 'Esta seguro?',
        text: 'desea Habilitar el registro!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si, Habilitar!',
        cancelButtonText: 'No, Cancelar'
      }).then((result) => {
        if (result.value) {
          this._actividadPuesto.habActPuest(form._id).subscribe(resp =>{
            this.getActividadPuesto();
            this.ContarActividadPuesto();
            this.toastr.success('Habilitado Correctamente', 'Correcto');
          })
        }
      })
      }
     
searchActPuest(buscar: NgForm){
  console.log("entrooo");
  if(buscar.value.buscarActPuest == "" ){
    this.coincidencia = true;
    this.getActividadPuesto();
  }else{
    this._actividadPuesto.searchActPuest(buscar.value.buscarActPuest).subscribe(correcto => {
      if(correcto.length === 0 ){
          this.coincidencia = false;
          return;
      }else{
        this.coincidencia = true;
        this.actividadesPuestos = correcto;
      }
    });
  }
}  

ContarActividadPuesto(){
  this._actividadPuesto.countActPuest().subscribe(resp=>{
    this.contActPuest = resp.total;
  })
}

}
