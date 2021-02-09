import { Component, OnInit, ViewChild } from '@angular/core';
import { Usuario } from '../../../../../Admin/src/app/models/usuario.models';
import { CompetenciaConductual } from '../../models/competenciaConductual.models';
import { CompCondObs } from '../../models/compCondObs.models';
import { CompetenciaConductualService } from '../../services/competencia-conductual.service';
import { CccomportamientoObsService } from '../../services/cccomportamiento-obs.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cccomportamiento-obs',
  templateUrl: './cccomportamiento-obs.component.html',
  styleUrls: ['./cccomportamiento-obs.component.css']
})
export class CccomportamientoObsComponent implements OnInit {

 
  numeroCc: string = "";
  nivelCc: string = "";
  comportamientoCc: string = "";
  competenciaCc: string = "";
  numeroCcU: string = "";
  nivelCcU: string = "";
  comportamientoCcU: string = "";
  competenciaCcU: string = "";
  contCcComp: string = "";
  buscarCcComp: string = "";
  getDataCcComp: CompCondObs;
  dataUpdCcComp:Boolean= false;
  coincidencia:Boolean= true;
  cccomportamientos: CompCondObs[] = [];
  competenciasConductuals: CompetenciaConductual[] = [];
  empRol: Usuario;
  @ViewChild('closebuttonadd',  {static: false}) closebuttonadd;
   @ViewChild('closebuttonupd',  {static: false}) closebuttonupd;
 
  constructor(

  
    public _competenciaConductual: CompetenciaConductualService,
    public _cccomportamiento: CccomportamientoObsService,
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
  this.getCcComportamiento();
  this.ContarCcComportamiento();
  this.getCompetenciaConductual();

}


getCcComportamiento(){
  this._cccomportamiento.getCcComportamiento().subscribe(resp => {
    console.log(resp);
    this.cccomportamientos = resp.compCondObs;
  })
}

getCompetenciaConductual(){
  this._competenciaConductual.getCompetenciaConductual().subscribe(resp => {
    console.log(resp.competenciaConductual);
    this.competenciasConductuals = resp.competenciaConductual;
  })
}

ContarCcComportamiento(){
  this._cccomportamiento.countCcComportamiento().subscribe(resp=>{
    this.contCcComp = resp.total;
  })
}



addCcComportamientos(ccComportamiento:NgForm){
  for (let i = 0; i < this.cccomportamientos.length; i++) {
 if (ccComportamiento.value.competenciaCc === this.cccomportamientos[i].competenciaConductual) {
  
  Swal.fire({
    title: 'ya exise la competencia!',
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
this._cccomportamiento.agregarCcComportamiento(
  ccComportamiento.value.numeroCc,
  ccComportamiento.value.nivelCc,
  ccComportamiento.value.comportamientoCc,
  ccComportamiento.value.competenciaCc
  )
                      .subscribe(resp => {

console.log(resp);
 this.getCcComportamiento();
 this.ContarCcComportamiento();
 this.closebuttonadd.nativeElement.click();
 this.toastr.success('Agregado Correctamente', 'Correcto');
})
}

getDataCcComportamiento(ccComportamiento: CompCondObs){
this.getDataCcComp = ccComportamiento;

this.numeroCcU = ccComportamiento.numero;
this.nivelCcU = ccComportamiento.nivel;
this.comportamientoCcU = ccComportamiento.comportamiento;
this.competenciaCcU = ccComportamiento.competenciaConductual;
this.dataUpdCcComp  = true;
}  


updCcComportamientos(form: NgForm){
  console.log(form.value);
      this._cccomportamiento.updCcComportamiento(
                                          form.value.comportamientoCcU, 
                                          this.getDataCcComp._id, 
                                          form.value.numeroCcU,
                                          form.value.nivelCcU, 
                                          form.value.competenciaCcU)
                                                    .subscribe(correcto => {
        this.getCcComportamiento();
         this.closebuttonupd.nativeElement.click();
         this.toastr.success('Modificado Correctamente', 'Correcto');
      });
    }

    
    eliminarCcComportamiento(form:CompCondObs){
      Swal.fire({icon: 'error',
      title: "¿Seguro desea eliminar a " + form.comportamiento+ "?",
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
        this._cccomportamiento.delCcComportamiento(form._id).subscribe(resp =>{
         this.getCcComportamiento();
         this.ContarCcComportamiento();
         this.toastr.success('Eliminado Correctamente', 'Correcto');
       })
        } 
      })
      
      }
      
        
      habilitarCcComportamiento(form: CompCondObs){
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
          this._cccomportamiento.habCcComportamiento(form._id).subscribe(resp =>{
            this.getCcComportamiento();
            this.ContarCcComportamiento();
            this.toastr.success('Habilitado Correctamente', 'Correcto');
          })
        }
      })
      }

      
      searchCcComportamiento(buscar: NgForm){
        console.log("entrooo");
        if(buscar.value.buscarCcComp == "" ){
          this.coincidencia = true;
          this.getCcComportamiento();
        }else{
          this._cccomportamiento.searchCcComportamiento(buscar.value.buscarCcComp).subscribe(correcto => {
            console.log(correcto);
            if(correcto.length === 0 || correcto.length == null ){
                this.coincidencia = false;
                return;
            }else{
              this.coincidencia = true;
              this.cccomportamientos = correcto;
            }
          });
        }
      }

}
