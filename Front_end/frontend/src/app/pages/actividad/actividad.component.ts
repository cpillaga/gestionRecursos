import { Component, OnInit, ViewChild } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { ActividadService } from '../../services/actividad.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import { Actividad } from 'src/app/models/actividad.models';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-actividad',
  templateUrl: './actividad.component.html',
  styleUrls: ['./actividad.component.css']
})
export class ActividadComponent implements OnInit {

  empRol: Usuario;
  desAct: String = "";
  proAct: String = "";
  actividades:Actividad[] = [];
  getDataAct: Actividad;
  dataUpdAct:Boolean= false;
  coincidencia:Boolean= false; 
  buscarAct: string = "";
  desActU: string;
  proActU: string;
  contAct : string= "";
  @ViewChild('closebuttonadd',  {static: false}) closebuttonadd;
   @ViewChild('closebuttonupd',  {static: false}) closebuttonupd;
  constructor(
    public _actividad: ActividadService,
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
    this.getActividad();  
  this.ContarActividad();
  }

  getActividad(){
    this._actividad.getActividad().subscribe(resp => {
      console.log(resp);
      this.actividades = resp.actividad;
    })
  }

 
  addActividades(actividad:NgForm){
    for (let i = 0; i < this.actividades.length; i++) {
   if (actividad.value.desGrup === this.actividades[i].descripcion) {
     alert("ya Existe la Actividad");
     return;
   }
 }
 this._actividad.agregarActividad(actividad.value.desAct, actividad.value.proAct).subscribe(resp => {
   console.log(resp);
   this.getActividad();
   this.ContarActividad();
   this.closebuttonadd.nativeElement.click();
   this.toastr.success('Agregado Correctamente', 'Correcto');
 })
}

getDataActividad(actividad: Actividad){
 this.getDataAct = actividad;
 this.desActU = actividad.descripcion;
 this.proActU = actividad.proceso;
 this.dataUpdAct = true;
}

updActividades(form: NgForm){
  console.log(form.value);
      this._actividad.updActividad(form.value.desActU, this.getDataAct._id, form.value.desActU).subscribe(correcto => {
        this.getActividad();
         this.closebuttonupd.nativeElement.click();
         this.toastr.success('Modificado Correctamente', 'Correcto');
      });
    }
  
    eliminarActividad(form:Actividad){
      Swal.fire({
        title: 'Esta seguro?',
        text: 'desea elimniar el registro!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si, eliminar!',
        cancelButtonText: 'No, Cancelar'
      }).then((result) => {
        if (result.value) {
        this._actividad.delAct(form._id).subscribe(resp =>{
         this.getActividad();
         this.ContarActividad();
         this.toastr.success('Eliminado Correctamente', 'Correcto');
       })
        } 
      })
      
      }
      
        
      habilitarActividad(form: Actividad){
      Swal.fire({
        title: 'Esta seguro?',
        text: 'desea Habilitar el registro!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si, Habilitar!',
        cancelButtonText: 'No, Cancelar'
      }).then((result) => {
        if (result.value) {
          this._actividad.habAct(form._id).subscribe(resp =>{
            this.getActividad();
            this.ContarActividad();
            this.toastr.success('Habilitado Correctamente', 'Correcto');
          })
        }
      })
      }
 
      searchAct(buscar: NgForm){
        console.log("entrooo");
        if(buscar.value.buscarAct == "" ){
          this.coincidencia = true;
          this.getActividad();
        }else{
          this._actividad.searchAct(buscar.value.buscarAct).subscribe(correcto => {
            if(correcto.length === 0 ){
                this.coincidencia = false;
                return;
            }else{
              this.coincidencia = true;
              this.actividades = correcto;
            }
          });
        }
      }

      ContarActividad(){
        this._actividad.countAct().subscribe(resp=>{
          this.contAct = resp.total;
        })
      }

}
