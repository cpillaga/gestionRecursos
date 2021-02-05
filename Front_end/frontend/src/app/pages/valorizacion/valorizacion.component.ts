import { Component, OnInit, ViewChild } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { ValorizacionService } from '../../services/valorizacion.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Valorizacion } from '../../models/valorizacion.models';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-valorizacion',
  templateUrl: './valorizacion.component.html',
  styleUrls: ['./valorizacion.component.css']
})
export class ValorizacionComponent implements OnInit {
  valorizaciones: Valorizacion[] = [];
  contVal: String = "";
  desVal: String = "";
  actPuestVal: String = "";
  desValU: String = "";
  actPuestValU: String = "";
  getDataVal : Valorizacion;
  dataUpdVal:Boolean= false;
  coincidencia:Boolean= false;
  buscarVal: String = "";
  empRol: Usuario;
  @ViewChild('closebuttonadd',  {static: false}) closebuttonadd;
  @ViewChild('closebuttonupd',  {static: false}) closebuttonupd;

  constructor(
    public _valorizacion: ValorizacionService,
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
    this.getValorizacion();
    this.ContarValoriacion();
  }
  getValorizacion(){
    this._valorizacion.getValorizacion().subscribe(resp => {
      console.log(resp);
      this.valorizaciones = resp.valorizacion;
    })
  }

  ContarValoriacion(){
    this._valorizacion.countVal().subscribe(resp=>{
      this.contVal = resp.total;
    })
  }

   
  addValorizacion(valorizacion:NgForm){
    for (let i = 0; i < this.valorizaciones.length; i++) {
   if (valorizacion.value.desVal === this.valorizaciones[i].descripcion) {
    Swal.fire({
      title: 'ya exise la valorizacion!',
       icon: 'warning'
     });
return;
     return;
   }
 }
 this._valorizacion.agregarValorizacion(valorizacion.value.desVal, valorizacion.value.actPuestVal).subscribe(resp => {
   console.log(resp);
   this.getValorizacion();
   this.ContarValoriacion();
   this.closebuttonadd.nativeElement.click();
   this.toastr.success('Agregado Correctamente', 'Correcto');
 })
}

getDataActividadPuesto(valorizacion: Valorizacion){
 this.getDataVal = valorizacion;

 this.desValU = valorizacion.descripcion;
 this.actPuestValU = valorizacion.actividadPuesto;
 this.dataUpdVal = true;
}

updValorizacion(form: NgForm){
  console.log(form.value);
      this._valorizacion.updValorizacion(form.value.desValU, this.getDataVal._id, form.value.actPuestValU).subscribe(correcto => {
        this.getValorizacion();
         this.closebuttonupd.nativeElement.click();
         this.toastr.success('Modificado Correctamente', 'Correcto');
      });
    }

    
    eliminarValorizacion(form:Valorizacion){
      Swal.fire({
        title: 'Esta seguro?',
        text: 'desea elimniar el registro!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si, eliminar!',
        cancelButtonText: 'No, Cancelar'
      }).then((result) => {
        if (result.value) {
        this._valorizacion.delVal(form._id).subscribe(resp =>{
         this.getValorizacion();
         this.ContarValoriacion();
         this.toastr.success('Eliminado Correctamente', 'Correcto');
       })
        } 
      })
      
      }
      
        
      habilitarValorizacion(form: Valorizacion){
      Swal.fire({
        title: 'Esta seguro?',
        text: 'desea Habilitar el registro!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si, Habilitar!',
        cancelButtonText: 'No, Cancelar'
      }).then((result) => {
        if (result.value) {
          this._valorizacion.habVal(form._id).subscribe(resp =>{
            this.getValorizacion();
            this.ContarValoriacion();
            this.toastr.success('Habilitado Correctamente', 'Correcto');
          })
        }
      })
      }

          
searchVal(buscar: NgForm){
  console.log("entrooo");
  if(buscar.value.buscarVal == "" ){
    this.coincidencia = true;
    this.getValorizacion();
  }else{
    this._valorizacion.searchVal(buscar.value.buscarVal).subscribe(correcto => {
      if(correcto.length === 0 ){
          this.coincidencia = false;
          return;
      }else{
        this.coincidencia = true;
        this.valorizaciones = correcto;
      }
    });
  }
}  
}
