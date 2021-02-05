import { Component, OnInit, ViewChild } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CompetenciaConductualService } from '../../services/competencia-conductual.service';
import { CompetenciaConductual } from '../../models/competenciaConductual.models';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-competencia-conductual',
  templateUrl: './competencia-conductual.component.html',
  styleUrls: ['./competencia-conductual.component.css']
})
export class CompetenciaConductualComponent implements OnInit {

  numeroCond: string = "";
  denominacionCond: string = "";
  definicionCond: string = "";
  numeroCondU: string = "";
  denominacionCondU: string = "";
  definicionCondU: string = "";
  contComCond: string = "";
  buscarComCond : string = "";
  competenciasConductuales: CompetenciaConductual[] = [];
  getDataComCond : CompetenciaConductual;
  dataUpdComCond:Boolean= false;
  coincidencia:Boolean= true;
  empRol: Usuario;
  @ViewChild('closebuttonadd',  {static: false}) closebuttonadd;
  @ViewChild('closebuttonupd',  {static: false}) closebuttonupd;
 constructor(
   public _compCond: CompetenciaConductualService,
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
    this.getCompetenciaConductual();
    this.ContarCompetenciaConductual();
  }
  
  getCompetenciaConductual(){
    this._compCond.getCompetenciaConductual().subscribe(resp => {
      console.log(resp.actividadEsencial);
      this.competenciasConductuales = resp.competenciaConductual;
    })
  }
  
  ContarCompetenciaConductual(){
    this._compCond.countComCond().subscribe(resp=>{
      this.contComCond= resp.total;
    })
  }


  addCompetenciasConductuales(competenciaConductual:NgForm){
    for (let i = 0; i < this.competenciasConductuales.length; i++) {
   if (competenciaConductual.value.denominacionCond === this.competenciasConductuales[i].denominacion) {
    
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
 this._compCond.agregarCompetenciaConductual(

   competenciaConductual.value.numeroCond,
   competenciaConductual.value.denominacionCond,
   competenciaConductual.value.definicionCond)
                        .subscribe(resp => {
  
  console.log(resp);
   this.getCompetenciaConductual();
   this.ContarCompetenciaConductual();
   this.closebuttonadd.nativeElement.click();
   this.toastr.success('Agregado Correctamente', 'Correcto');
 })
}

getDataCompetenciaConductual(competenciaConductual: CompetenciaConductual){
 this.getDataComCond = competenciaConductual;

 this.numeroCondU = competenciaConductual.numero,
 this.denominacionCondU = competenciaConductual.denominacion
 this.definicionCondU = competenciaConductual.definicion
 this.dataUpdComCond = true;
}  
  

updCompetenciaConductual(form: NgForm){
  console.log(form.value);
      this._compCond.updComCond(
                                          form.value.denominacionCondU, 
                                          this.getDataComCond._id, 
                                          form.value.numeroCondU, 
                                          form.value.definicionCondU)
                                                    .subscribe(correcto => {
        this.getCompetenciaConductual();
         this.closebuttonupd.nativeElement.click();
         this.toastr.success('Modificado Correctamente', 'Correcto');
      });
    }

    
    eliminarCompetenciConductual(form:CompetenciaConductual){
      Swal.fire({icon: 'error',
      title: "¿Seguro desea eliminar a " + form.denominacion + "?",
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
        this._compCond.delComCond(form._id).subscribe(resp =>{
         this.getCompetenciaConductual();
         this.ContarCompetenciaConductual();
         this.toastr.success('Eliminado Correctamente', 'Correcto');
       })
        } 
      })
      
      }
      
        
      habilitarCompetenciaConductual(form: CompetenciaConductual){
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
          this._compCond.habComCond(form._id).subscribe(resp =>{
            this.getCompetenciaConductual();
            this.ContarCompetenciaConductual();
            this.toastr.success('Habilitado Correctamente', 'Correcto');
          })
        }
      })
      }

      searchComCond(buscar: NgForm){
        console.log("entrooo");
        if(buscar.value.buscarComCond == "" ){
          this.coincidencia = true;
          this.getCompetenciaConductual();
        }else{
          this._compCond.searchComCond(buscar.value.buscarComCond).subscribe(correcto => {
            console.log(correcto);
            if(correcto.length === 0 || correcto.length == null ){
                this.coincidencia = false;
                return;
            }else{
              this.coincidencia = true;
              this.competenciasConductuales = correcto;
            }
          });
        }
      }

}
