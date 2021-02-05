import { Component, OnInit, ViewChild } from '@angular/core';
import { ExperienciaPuestoService } from '../../services/experiencia-puesto.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Usuario } from 'src/app/models/usuario.model';
import { ExperienciaPuesto } from '../../models/expPuesto.models';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import { Puesto } from '../../models/puesto.models';
import { Experiencia } from '../../models/experiencia.models';
import { PuestoService } from '../../services/puesto.service';
import { ExperienciaService } from '../../services/experiencia.service';

@Component({
  selector: 'app-experiencia-puesto',
  templateUrl: './experiencia-puesto.component.html',
  styleUrls: ['./experiencia-puesto.component.css']
})
export class ExperienciaPuestoComponent implements OnInit {

  experienciasPuestos:ExperienciaPuesto[] = [];
  puestos: Puesto[] = [];
  experiencias: Experiencia[] = [];
  empRol: Usuario;
  areaExp: String = "";
  tiempoExp: String = "";
  especificidadExp: String = "";
  experienciaExp: String = "";
  puestoExp: String = "";
  areaExpU: String = "";
  tiempoExpU: String = "";
  especificidadExpU: String = "";
  experienciaExpU: String = "";
  puestoExpU: String = "";
  buscarExpPuest: String = "";
  getDataExpPuest:ExperienciaPuesto;
  dataUpdExpPuest:Boolean= false;
  coincidencia:Boolean= true;
  countExpPuest: string = "";
  @ViewChild('closebuttonadd',  {static: false}) closebuttonadd;
  @ViewChild('closebuttonupd',  {static: false}) closebuttonupd;
 constructor(
   public _exepienciaPuesto: ExperienciaPuestoService,
   public _puesto: PuestoService,
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
    this.getExperienciaPuesto();
    this.ContarExperienciaPuesto();
    this.getPuesto();
    this.getExperiencia();
  }

  getExperienciaPuesto(){
    this._exepienciaPuesto.getExperienciaPuesto().subscribe(resp => {
      console.log(resp);
      this.experienciasPuestos = resp.expPuesto;
    })
  }

  getPuesto(){
    this._puesto.getPuesto().subscribe(resp =>{
this.puestos = resp.puesto;
console.log(resp);
    })
  }
  
  getExperiencia(){
    let cont = 0;
    this._experiencia.getExperiencia().subscribe(resp => {
      console.log(resp);
      for (let i = 0; i < resp.experiencia.length; i++) {
        if( resp.experiencia[i].estado === "true"){
          console.log("entro a condicion");
            this.experiencias[cont] = resp.experiencia[i];
            cont++;
          }
        
      }
      // this.experiencias = resp.experiencia;
       // if( resp.experiencia.estado === "true"){
      //   this.experiencias = resp.experiencia;
      // }
    })
  }
  
  ContarExperienciaPuesto(){
  this._exepienciaPuesto.countExpPuest().subscribe(resp=>{
    this.countExpPuest = resp.total;
  })
}


addExperienciasPuestos(exepienciaPuesto:NgForm){
  for (let i = 0; i < this.experienciasPuestos.length; i++) {
 if (exepienciaPuesto.value.desGrup === this.experienciasPuestos[i].area) {
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
this._exepienciaPuesto.agregarExperienciaPuesto(

              exepienciaPuesto.value.areaExp,
              exepienciaPuesto.value.tiempoExp,
              exepienciaPuesto.value.especificidadExp,
              exepienciaPuesto.value.experienciaExp,
              exepienciaPuesto.value.puestoExp)
                                                  .subscribe(resp => {
                                                  console.log(resp);
                                                  this.getExperienciaPuesto();
                                                  this.ContarExperienciaPuesto();
                                                  this.closebuttonadd.nativeElement.click();
                                                  this.toastr.success('Agregado Correctamente', 'Correcto');
})
}

getDataExperienciaPuesto(exepienciaPuesto: ExperienciaPuesto){
this.getDataExpPuest = exepienciaPuesto;

this.areaExpU = exepienciaPuesto.area;
this.tiempoExpU = exepienciaPuesto.tiempo;
this.especificidadExpU = exepienciaPuesto.especificidad;
this.experienciaExpU = exepienciaPuesto.experiencia;
this.puestoExpU = exepienciaPuesto.puesto;
this.dataUpdExpPuest = true;
}


updExperienciasPuestos(form: NgForm){
  console.log(form.value);
      this._exepienciaPuesto.updExpPuest(
                                          form.value.areaExpU, 
                                          this.getDataExpPuest._id, 
                                          form.value.tiempoExpU, 
                                          form.value.especificidadExpU,
                                          form.value.experienciaExpU, 
                                          form.value.puestoExpU)
                                                    .subscribe(correcto => {
        this.getExperienciaPuesto();
         this.closebuttonupd.nativeElement.click();
         this.toastr.success('Modificado Correctamente', 'Correcto');
      });
    }

 

    eliminarExperienciaPuesto(form:ExperienciaPuesto){
      Swal.fire({icon: 'error',
      title: "¿Seguro desea eliminar a " + form.area + "?",
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
        this._exepienciaPuesto.delExpPuest(form._id).subscribe(resp =>{
         this.getExperienciaPuesto();
         this.ContarExperienciaPuesto();
         this.toastr.success('Eliminado Correctamente', 'Correcto');
       })
        } 
      })
      
      }
      
        
      habilitarExperienciaPuesto(form: ExperienciaPuesto){
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
          this._exepienciaPuesto.habExpPuest(form._id).subscribe(resp =>{
            this.getExperienciaPuesto();
            this.ContarExperienciaPuesto();
            this.toastr.success('Habilitado Correctamente', 'Correcto');
          })
        }
      })
      }
   
      searchExpPuest(buscar: NgForm){
        console.log("entrooo");
        if(buscar.value.buscarExpPuest == "" ){
          this.coincidencia = true;
          this.getExperienciaPuesto();
        }else{
          this._exepienciaPuesto.searchExpPuest(buscar.value.buscarExpPuest).subscribe(correcto => {
            console.log(correcto);
            if(correcto.length === 0 || correcto.length == null ){
                this.coincidencia = false;
                return;
            }else{
              this.coincidencia = true;
              this.experienciasPuestos = correcto;
            }
          });
        }
      }
}
