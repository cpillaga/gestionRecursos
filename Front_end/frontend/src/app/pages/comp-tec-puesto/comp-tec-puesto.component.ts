import { Component, OnInit, ViewChild } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { CompTecPuestoService } from '../../services/comp-tec-puesto.service';
import { PuestoService } from '../../services/puesto.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CTcomportamientoObsService } from '../../services/ctcomportamiento-obs.service';
import { Puesto } from '../../models/puesto.models';
import { CompTecObs } from '../../models/compTecObs.models';
import { CompTecPuesto } from '../../models/compTecPuesto';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { CompetenciaTecnica } from '../../models/competenciaTecnica.models';
import { CompetenciaTecnicaService } from '../../services/competencia-tecnica.service';

@Component({
  selector: 'app-comp-tec-puesto',
  templateUrl: './comp-tec-puesto.component.html',
  styleUrls: ['./comp-tec-puesto.component.css']
})
export class CompTecPuestoComponent implements OnInit {
 
  puestoCompTecP: string = "";
  competenciaTecnica: string = "";

  puestoCompTecPU: string = "";
  competenciaTecnicaU: string = "";

  buscarCompTecPuesto: string = "";
  contComTecPuesto: string = "";
  getDataCompTecPusto: CompTecPuesto;
  dataUpdCompTecPusto:Boolean= false;
  coincidencia:Boolean= true;
  compTecPuestos:CompTecPuesto[] = [];
  puestos:Puesto[] = [];
  competenciasTecnicas: CompetenciaTecnica[] = [];
  empRol: Usuario;
  @ViewChild('closebuttonadd',  {static: false}) closebuttonadd;
  @ViewChild('closebuttonupd',  {static: false}) closebuttonupd;
 constructor(
  public _puesto: PuestoService,
  public _compTecn: CompetenciaTecnicaService,
  public _compTecPuesto: CompTecPuestoService,
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
    this.getCompTecPuesto();
    this.getPuesto();
    this.getCompetenciaTecnica();
    this.ContarComTecPuesto();

  }

  ContarComTecPuesto(){
    this._compTecPuesto.countCompTecPuesto().subscribe(resp=>{
      this.contComTecPuesto = resp.total;
    })
  }

  getCompetenciaTecnica(){
    this._compTecn.getCompetenciaTecnica().subscribe(resp => {
      console.log(resp);
      this.competenciasTecnicas = resp.competenciaTecnica;
    })
  }
getPuesto(){
  this._puesto.getPuesto().subscribe(resp => {
    console.log(resp);
    this.puestos = resp.puesto;
  })
}

getCompTecPuesto(){
  this._compTecPuesto.getCompTecPuesto().subscribe(resp => {
    console.log(resp);
    this.compTecPuestos = resp.compTecPuesto;
  })
}



addCompTecPuestos(compTecPuesto:NgForm){
  for (let i = 0; i < this.compTecPuestos.length; i++) {
 if (compTecPuesto.value.puestoCompTecP === this.compTecPuestos[i].puesto) {
  
  Swal.fire({
    title: 'ya exise la actividad esencial!',
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
this._compTecPuesto.agregarCompTecPuesto(
  compTecPuesto.value.puestoCompTecP, 
  compTecPuesto.value.competenciaTecnica)
                      .subscribe(resp => {

console.log(resp);
 this.getCompTecPuesto();
 this.ContarComTecPuesto();
 this.closebuttonadd.nativeElement.click();
 this.toastr.success('Agregado Correctamente', 'Correcto');
})
}

getDataCompTecPuesto(compTecPuesto: CompTecPuesto){
this.getDataCompTecPusto = compTecPuesto;
this.puestoCompTecPU = compTecPuesto.puesto
this.competenciaTecnicaU = compTecPuesto.competecnicaTecnica
this.dataUpdCompTecPusto = true;
}  


updCompTecPuestos(form: NgForm){
  console.log(form.value);
      this._compTecPuesto.updCompTecPuesto(
                                          this.getDataCompTecPusto._id, 
                                          form.value.puestoCompTecPU, 
                                          form.value.competenciaTecnicaU)
                                                    .subscribe(correcto => {
        this.getCompTecPuesto();
         this.closebuttonupd.nativeElement.click();
         this.toastr.success('Modificado Correctamente', 'Correcto');
      });
    }

    
    eliminarCompTecPuesto(form:CompTecPuesto){
      Swal.fire({icon: 'error',
      title: "¿Seguro desea eliminar ? ",
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
        this._compTecPuesto.delCompTecPuesto(form._id).subscribe(resp =>{
         this.getCompTecPuesto();
         this.ContarComTecPuesto();
         this.toastr.success('Eliminado Correctamente', 'Correcto');
       })
        } 
      })
      
      }
      
        
      habilitarCompTecPuesto(form: CompTecPuesto){
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
          this._compTecPuesto.habCompTecPuesto(form._id).subscribe(resp =>{
            this.getCompTecPuesto();
            this.ContarComTecPuesto();
            this.toastr.success('Habilitado Correctamente', 'Correcto');
          })
        }
      })
      }

      searchCompTecPuesto(buscar: NgForm){
        console.log("entrooo");
        if(buscar.value.buscarCompTecPuesto == "" ){
          this.coincidencia = true;
          this.getCompTecPuesto();
        }else{
          this._compTecPuesto.searchCompTecPuesto(buscar.value.buscarCompTecPuesto).subscribe(correcto => {
            console.log(correcto);
            if(correcto.length === 0 || correcto.length == null ){
                this.coincidencia = false;
                return;
            }else{
              this.coincidencia = true;
              this.compTecPuestos = correcto;
            }
          });
        }
      }

}
