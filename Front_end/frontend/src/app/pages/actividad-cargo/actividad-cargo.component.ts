import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Usuario } from 'src/app/models/usuario.model';
import { ActividadCargoService } from '../../services/actividad-cargo.service';
import { ActividadCargo } from '../../models/actividadCargo.models';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { Puesto } from '../../models/puesto.models';
import { PuestoService } from '../../services/puesto.service';

@Component({
  selector: 'app-actividad-cargo',
  templateUrl: './actividad-cargo.component.html',
  styleUrls: ['./actividad-cargo.component.css']
})
export class ActividadCargoComponent implements OnInit {

  desActCarg: String = "";
  frActCarg: String = "";
  coActCarg: String = "";
  cmActCarg: String = "";
  totalActCarg: String = "";
  puestoActCarg: String = "";
  desActCargU: String = "";
  frActCargU: String = "";
  coActCargU: String = "";
  cmActCargU: String = "";
  totalActCargU: String = "";
  puestoActCargU: String = "";
  getDataActCarg : ActividadCargo;
  dataUpdActCarg :Boolean= false;
  coincidencia:Boolean= true;
  buscarActCarg: string = "";
  puestos: Puesto[] = [];
  actividadesCargos:ActividadCargo[] = [];
  empRol : Usuario;
  contActCarg: string = "";
  @ViewChild('closebuttonadd',  {static: false}) closebuttonadd;
  @ViewChild('closebuttonupd',  {static: false}) closebuttonupd;
 constructor(
   public _puesto : PuestoService,
   public _activdadCargo: ActividadCargoService,
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
    this.getActividadCargo();
    this.getPuesto();
    this.ContarActividadCargo();

  }

    getActividadCargo(){
    this._activdadCargo.getActividadCargo().subscribe(resp => {
      console.log(resp);
      this.actividadesCargos = resp.actividadCargo;
    })
  }
  getPuesto(){
    this._puesto.getPuesto().subscribe(resp =>{
    this.puestos = resp.puesto;
    console.log(resp);
    })
  }

  ContarActividadCargo(){
    this._activdadCargo.countActCarg().subscribe(resp=>{
      this.contActCarg = resp.total;
    })
  }
  
 
  addActividadesCargos(actividadCargo:NgForm){
    for (let i = 0; i < this.actividadesCargos.length; i++) {
   if (actividadCargo.value.desActCarg === this.actividadesCargos[i].descripcion) {
     Swal.fire({
       title: 'ya exise La Actividad del Puesto!',
        icon: 'error',
        showCancelButton: true,
        confirmButtonColor: '#23CCEF',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Confirmar',
        width: '450px',
        heightAuto: true,
        showClass: {
          popup: 'animated fadeInDown faster'
        },
        hideClass: {
          popup: 'animated fadeOutUp faster'
        }
      });
       return;
   }
 }
 this._activdadCargo.agregarActividadCargo(
                                      actividadCargo.value.desActCarg,
                                      actividadCargo.value.frActCarg,
                                      actividadCargo.value.coActCarg,
                                      actividadCargo.value.cmActCarg,
                                      actividadCargo.value.totalActCarg,
                                      actividadCargo.value.puestoActCarg,
                                  ).subscribe(resp => {
   console.log(resp);
   this.getActividadCargo();
   this.ContarActividadCargo();
   this.closebuttonadd.nativeElement.click();
   this.toastr.success('Agregado Correctamente', 'Correcto');
 })
}

getDataActividadCargo(actividadCargo: ActividadCargo){
 this.getDataActCarg = actividadCargo;

this.puestoActCargU = actividadCargo.puesto;
this.desActCargU = actividadCargo.descripcion;
this.frActCargU = actividadCargo.fr;
this.coActCargU = actividadCargo.co;
this.cmActCargU = actividadCargo.cm;
this.totalActCargU = actividadCargo.total;
this.dataUpdActCarg = true;
} 
   

updActividadesCargos(form: NgForm){
  console.log(form.value);
      this._activdadCargo.updActividadCargo(
                              form.value.desActCargU,
                              this.getDataActCarg._id, 
                              form.value.frActCargU,
                              form.value.coActCargU,
                              form.value.cmActCargU,
                              form.value.totalActCargU,
                              form.value.puestoActCargU
                              ).subscribe(correcto => {
        this.getActividadCargo();
         this.closebuttonupd.nativeElement.click();
         this.toastr.success('Modificado Correctamente', 'Correcto');
      });
    }

    
  eliminarActividadCargo(form:ActividadCargo){
    Swal.fire({icon: 'error',
    title: "¿Seguro desea eliminar a " + form.descripcion + "?",
    showCancelButton: true,
    confirmButtonColor: '#23CCEF',
    cancelButtonColor: '#d33',
    cancelButtonText: 'Cancelar',
    confirmButtonText: 'Confirmar',
    width: '450px',
    heightAuto: true,
    showClass: {
      popup: 'animated fadeInDown faster'
    },
    hideClass: {
      popup: 'animated fadeOutUp faster'
    }
    }).then((result) => {
      if (result.value) {
      this._activdadCargo.delActCarg(form._id).subscribe(resp =>{
       this.getActividadCargo();
       this.ContarActividadCargo();
       this.toastr.success('Eliminado Correctamente', 'Correcto');
     })
      } 
    })
    
    }
    
      
    habilitarActividadCargo(form: ActividadCargo){
      Swal.fire({
        icon: 'error',
        title: "¿Seguro desea habilitar",
        showCancelButton: true,
        confirmButtonColor: '#23CCEF',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Confirmar',
        width: '450px',
        heightAuto: true,
        showClass: {
          popup: 'animated fadeInDown faster'
        },
        hideClass: {
          popup: 'animated fadeOutUp faster'
        }
    }).then((result) => {
      if (result.value) {
        this._activdadCargo.habActCarg(form._id).subscribe(resp =>{
          this.getActividadCargo();
          this.ContarActividadCargo();
          this.toastr.success('Habilitado Correctamente', 'Correcto');
        })
      }
    })
    }

    
searchActCarg(buscar: NgForm){
  console.log("entrooo");
  if(buscar.value.buscarActCarg == "" ){
    this.coincidencia = true;
    this.getActividadCargo();
  }else{
    this._activdadCargo.searchActCarg(buscar.value.buscarActCarg).subscribe(correcto => {
      if(correcto.length === 0 ){
          this.coincidencia = false;
          return;
      }else{
        this.coincidencia = true;
        this.actividadesCargos = correcto;
      }
    });
  }
} 
}
