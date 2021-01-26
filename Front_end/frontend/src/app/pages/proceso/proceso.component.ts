import { Component, OnInit, ViewChild } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProcesoService } from '../../services/proceso.service';
import { Proceso } from '../../models/proceso.models';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-proceso',
  templateUrl: './proceso.component.html',
  styleUrls: ['./proceso.component.css']
})
export class ProcesoComponent implements OnInit {

  procesos:Proceso[] = [];
  empRol: Usuario;
  desPro: String = "";
  getDataPro: Proceso;
  desProU: string;
  buscarPro: string = "";
  dataUpdPro:Boolean= false;
  coincidencia:Boolean= false;
  contPro: string= "";
  @ViewChild('closebuttonadd',  {static: false}) closebuttonadd;
   @ViewChild('closebuttonupd',  {static: false}) closebuttonupd;
  constructor(
    public _proceso: ProcesoService,
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
    this.getProceso();
    this.ContarProceso();
  }
  
  getProceso(){
    this._proceso.getProceso().subscribe(resp => {
      console.log(resp);
      this.procesos = resp.proceso;
    })
  }

  
  addProcesos(proceso:NgForm){
    for (let i = 0; i < this.procesos.length; i++) {
   if (proceso.value.desPro === this.procesos[i].descripcion) {
     alert("ya Existe el Proceso");
     return;
   }
 }
 this._proceso.agregarProcesos(proceso.value.desPro).subscribe(resp => {
   console.log(resp);
   this.getProceso();
   this.ContarProceso();
   this.closebuttonadd.nativeElement.click();
   this.toastr.success('Agregado Correctamente', 'Correcto');
 })
}

getDataProceso(proceso: Proceso){
 this.getDataPro = proceso;
 this.desProU = proceso.descripcion;
 this.dataUpdPro = true;
}

updProcesos(form: NgForm){
  console.log(form.value);
      this._proceso.updProceso(form.value.desProU, this.getDataPro._id).subscribe(correcto => {
        this.getProceso();
         this.closebuttonupd.nativeElement.click();
         this.toastr.success('Modificado Correctamente', 'Correcto');
      });
    }
 

    eliminarProceso(form:Proceso){
      Swal.fire({
        title: 'Esta seguro?',
        text: 'desea elimniar el registro!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si, eliminar!',
        cancelButtonText: 'No, Cancelar'
      }).then((result) => {
        if (result.value) {
        this._proceso.delPro(form._id).subscribe(resp =>{
         this.getProceso();
         this.ContarProceso();
         this.toastr.success('Eliminado Correctamente', 'Correcto');
       })
        } 
      })
      
      }
      
        
      habilitarProceso(form: Proceso){
      Swal.fire({
        title: 'Esta seguro?',
        text: 'desea Habilitar el registro!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si, Habilitar!',
        cancelButtonText: 'No, Cancelar'
      }).then((result) => {
        if (result.value) {
          this._proceso.habPro(form._id).subscribe(resp =>{
            this.getProceso();
            this.ContarProceso();
            this.toastr.success('Habilitado Correctamente', 'Correcto');
          })
        }
      })
      }    
      searchPro(buscar: NgForm){
        console.log("entrooo");
        if(buscar.value.buscarPro == "" ){
          this.coincidencia = true;
          this.getProceso();
        }else{
          this._proceso.searchPro(buscar.value.buscarPro).subscribe(correcto => {
            if(correcto.length === 0 ){
                this.coincidencia = false;
                return;
            }else{
              this.coincidencia = true;
              this.procesos = correcto;
            }
          });
        }
      }

      
ContarProceso(){
  this._proceso.countPro().subscribe(resp=>{
    this.contPro = resp.total;
  })
}

}
