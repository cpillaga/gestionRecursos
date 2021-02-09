import { Component, OnInit, ViewChild } from '@angular/core';
import { Usuario } from '../../../../../Admin/src/app/models/usuario.models';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CTcomportamientoObsService } from 'src/app/services/ctcomportamiento-obs.service';
import { CompetenciaTecnica } from '../../models/competenciaTecnica.models';
import { CompTecObs } from '../../models/compTecObs.models';
import { CompetenciaTecnicaService } from '../../services/competencia-tecnica.service';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ctcomportamiento-obs',
  templateUrl: './ctcomportamiento-obs.component.html',
  styleUrls: ['./ctcomportamiento-obs.component.css']
})
export class CTcomportamientoObsComponent implements OnInit {

  numeroCt: string = "";
  nivelCt: string = "";
  comportamientoCt: string = "";
  competenciaCt: string = "";
  numeroCtU: string = "";
  nivelCtU: string = "";
  comportamientoCtU: string = "";
  competenciaCtU: string = "";
  contCtComp: string = "";
  buscarCtComp: string = "";
  getDataCtComp: CompTecObs;
  dataUpdCtComp:Boolean= false;
  coincidencia:Boolean= true;
  ctcomportamientos: CompTecObs[] = [];
  competenciasTecnicas: CompetenciaTecnica[] = [];
  empRol: Usuario;
  @ViewChild('closebuttonadd',  {static: false}) closebuttonadd;
   @ViewChild('closebuttonupd',  {static: false}) closebuttonupd;
 
  constructor(

    
    public _competenciaTecnica: CompetenciaTecnicaService,
    public _ctcomportamiento: CTcomportamientoObsService,
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
  this.getCtComportamiento();
  this.ContarCtComportamiento();
  this.getCompetenciaTecnica();

}


getCtComportamiento(){
  this._ctcomportamiento.getCtComportamiento().subscribe(resp => {
    console.log(resp);
    this.ctcomportamientos = resp.compTecObs;
  })
}

getCompetenciaTecnica(){
  this._competenciaTecnica.getCompetenciaTecnica().subscribe(resp => {
    console.log(resp.actividadEsencial);
    this.competenciasTecnicas = resp.competenciaTecnica;
  })
}

ContarCtComportamiento(){
  this._ctcomportamiento.countCtComportamiento().subscribe(resp=>{
    this.contCtComp = resp.total;
  })
}



addCtComportamientos(ctComportamiento:NgForm){
  for (let i = 0; i < this.ctcomportamientos.length; i++) {
 if (ctComportamiento.value.desActEse === this.ctcomportamientos[i].competenciaTecnica) {
  
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
this._ctcomportamiento.agregarCtComportamiento(
  ctComportamiento.value.numeroCt,
  ctComportamiento.value.nivelCt,
  ctComportamiento.value.comportamientoCt,
  ctComportamiento.value.competenciaCt
  )
                      .subscribe(resp => {

console.log(resp);
 this.getCtComportamiento();
 this.ContarCtComportamiento();
 this.closebuttonadd.nativeElement.click();
 this.toastr.success('Agregado Correctamente', 'Correcto');
})
}

getDataCtComportamiento(ctComportamiento: CompTecObs){
this.getDataCtComp = ctComportamiento;

this.numeroCtU = ctComportamiento.numero;
this.nivelCtU = ctComportamiento.nivel;
this.comportamientoCtU = ctComportamiento.comportamiento;
this.competenciaCtU = ctComportamiento.competenciaTecnica;
this.dataUpdCtComp  = true;
}  


updCtComportamientos(form: NgForm){
  console.log(form.value);
      this._ctcomportamiento.updCtComportamiento(
                                          form.value.comportamientoCtU, 
                                          this.getDataCtComp._id, 
                                          form.value.numeroCtU,
                                          form.value.nivelCtU, 
                                          form.value.competenciaCtU)
                                                    .subscribe(correcto => {
        this.getCtComportamiento();
         this.closebuttonupd.nativeElement.click();
         this.toastr.success('Modificado Correctamente', 'Correcto');
      });
    }

    
    eliminarCtComportamiento(form:CompTecObs){
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
        this._ctcomportamiento.delCtComportamiento(form._id).subscribe(resp =>{
         this.getCtComportamiento();
         this.ContarCtComportamiento();
         this.toastr.success('Eliminado Correctamente', 'Correcto');
       })
        } 
      })
      
      }
      
        
      habilitarCtComportamiento(form: CompTecObs){
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
          this._ctcomportamiento.habCtComportamiento(form._id).subscribe(resp =>{
            this.getCtComportamiento();
            this.ContarCtComportamiento();
            this.toastr.success('Habilitado Correctamente', 'Correcto');
          })
        }
      })
      }

      
      searchCtComportamiento(buscar: NgForm){
        console.log("entrooo");
        if(buscar.value.buscarCtComp == "" ){
          this.coincidencia = true;
          this.getCtComportamiento();
        }else{
          this._ctcomportamiento.searchCtComportamiento(buscar.value.buscarCtComp).subscribe(correcto => {
            console.log(correcto);
            if(correcto.length === 0 || correcto.length == null ){
                this.coincidencia = false;
                return;
            }else{
              this.coincidencia = true;
              this.ctcomportamientos = correcto;
            }
          });
        }
      }

}
