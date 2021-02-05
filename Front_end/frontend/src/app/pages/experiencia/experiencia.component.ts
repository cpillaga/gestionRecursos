import { Component, OnInit, ViewChild } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ExperienciaService } from '../../services/experiencia.service';
import { Experiencia } from '../../models/experiencia.models';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-experiencia',
  templateUrl: './experiencia.component.html',
  styleUrls: ['./experiencia.component.css']
})
export class ExperienciaComponent implements OnInit {

  empRol: Usuario;
  contExp: string= "";
  desExp: string= "";
  gradExp: string= "";
  gradExpU: string= "";
  desExpU: string= "";
  getDataExp: Experiencia;
  dataUpdExp:Boolean= false;
  coincidencia:Boolean= true;
  buscarExp: string= "";
  experiencias:Experiencia[] = [];
  @ViewChild('closebuttonadd',  {static: false}) closebuttonadd;
   @ViewChild('closebuttonupd',  {static: false}) closebuttonupd;
  constructor(
    public _experiencia: ExperienciaService,
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
    this.getExperiencia();
    this.ContarExperiencia();
  }

  
  getExperiencia(){
    this._experiencia.getExperiencia().subscribe(resp => {
      console.log(resp);
      this.experiencias = resp.experiencia;
    })
  }

  ContarExperiencia(){
    this._experiencia.countExp().subscribe(resp=>{
      this.contExp = resp.total;
    })
  }

  
  addExperiencias(experiencia:NgForm){
    for (let i = 0; i < this.experiencias.length; i++) {
   if (experiencia.value.desExp === this.experiencias[i].descripcion) {
    Swal.fire({
      title: 'ya exise el Puesto!',
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
 this._experiencia.agregarExperiencia(
                  experiencia.value.desExp,
                  experiencia.value.gradExp)
                                .subscribe(resp => {
                                console.log(resp);
                                this.getExperiencia();
                                this.ContarExperiencia();
                                this.closebuttonadd.nativeElement.click();
                                this.toastr.success('Agregado Correctamente', 'Correcto');
})
}

getDataExperiencia(experiencia: Experiencia){
 this.getDataExp = experiencia;

 this.desExpU = experiencia.descripcion;
 this.gradExpU = experiencia.grado;
 this.dataUpdExp = true;
}
  

updExperiencias(form: NgForm){
  console.log(form.value);
      this._experiencia.updExperiencia(
                            form.value.desExpU,
                            form.value.gradExpU,
                            this.getDataExp._id).subscribe(correcto => {
        this.getExperiencia();
         this.closebuttonupd.nativeElement.click();
         this.toastr.success('Modificado Correctamente', 'Correcto');
      });
    }

    eliminarExperiencia(form:Experiencia){
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
        this._experiencia.delExp(form._id).subscribe(resp =>{
         this.getExperiencia();
         this.ContarExperiencia();
         this.toastr.success('Eliminado Correctamente', 'Correcto');
       })
        } 
      })
      
      }
      
        
      habilitarExperiencia(form: Experiencia){
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
          this._experiencia.habExp(form._id).subscribe(resp =>{
            this.getExperiencia();
            this.ContarExperiencia();
            this.toastr.success('Habilitado Correctamente', 'Correcto');
          })
        }
      })
      }
  
    
searchExp(buscar: NgForm){
  console.log("entrooo");
  if(buscar.value.buscarExp == "" ){
    this.coincidencia = true;
    this.getExperiencia();
  }else{
    this._experiencia.searchExp(buscar.value.buscarExp).subscribe(correcto => {
      if(correcto.length === 0 || correcto.length == null){
          this.coincidencia = false;
          return;
      }else{
        this.coincidencia = true;
        this.experiencias = correcto;
      }
    });
  }
}

}
