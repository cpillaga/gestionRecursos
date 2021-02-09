import { Component, OnInit, ViewChild } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { PuestoService } from '../../services/puesto.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CompetenciaTecnicaService } from '../../services/competencia-tecnica.service';
import { Puesto } from '../../models/puesto.models';
import { CompetenciaTecnica } from '../../models/competenciaTecnica.models';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-competencia-tecnica',
  templateUrl: './competencia-tecnica.component.html',
  styleUrls: ['./competencia-tecnica.component.css']
})
export class CompetenciaTecnicaComponent implements OnInit {

  numeroTec: string = "";
  denominacionTec: string = "";
  definicionTec: string = "";
  numeroTecU: string = "";
  denominacionTecU: string = "";
  definicionTecU: string = "";
  contComTec: string = "";
  buscarComTec : string = "";
  competenciasTecnicas: CompetenciaTecnica[] = [];
  getDataComTec : CompetenciaTecnica;
  dataUpdComTec:Boolean= false;
  coincidencia:Boolean= true;
  empRol: Usuario;
  @ViewChild('closebuttonadd',  {static: false}) closebuttonadd;
  @ViewChild('closebuttonupd',  {static: false}) closebuttonupd;
 constructor(
   public _compTecn: CompetenciaTecnicaService,
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
    this.getCompetenciaTecnica();
    this.ContarCompetenciaTecnica();
  }
  
  getCompetenciaTecnica(){
    this._compTecn.getCompetenciaTecnica().subscribe(resp => {
      console.log(resp);
      this.competenciasTecnicas = resp.competenciaTecnica;
    })
  }
  
  ContarCompetenciaTecnica(){
    this._compTecn.countComTec().subscribe(resp=>{
      this.contComTec= resp.total;
    })
  }


  addCompetenciasTecnicas(competenciaTecnica:NgForm){
    for (let i = 0; i < this.competenciasTecnicas.length; i++) {
   if (competenciaTecnica.value.denominacionTec === this.competenciasTecnicas[i].denominacion) {
    
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
 this._compTecn.agregarCompetenciaTecnica(

   competenciaTecnica.value.numeroTec,
   competenciaTecnica.value.denominacionTec,
   competenciaTecnica.value.definicionTec)
                        .subscribe(resp => {
  
  console.log(resp);
   this.getCompetenciaTecnica();
   this.ContarCompetenciaTecnica();
   this.closebuttonadd.nativeElement.click();
   this.toastr.success('Agregado Correctamente', 'Correcto');
 })
}

getDataCompetenciaTecnica(competenciaTecnica: CompetenciaTecnica){
 this.getDataComTec = competenciaTecnica;

 this.numeroTecU = competenciaTecnica.numero,
 this.denominacionTecU = competenciaTecnica.denominacion
 this.definicionTecU = competenciaTecnica.definicion
 this.dataUpdComTec = true;
}  
  

updCompetenciaTecnica(form: NgForm){
  console.log(form.value);
      this._compTecn.updComTec(
                                          form.value.denominacionTecU, 
                                          this.getDataComTec._id, 
                                          form.value.numeroTecU, 
                                          form.value.definicionTecU)
                                                    .subscribe(correcto => {
        this.getCompetenciaTecnica();
         this.closebuttonupd.nativeElement.click();
         this.toastr.success('Modificado Correctamente', 'Correcto');
      });
    }

    
    eliminarCompetenciTecnica(form:CompetenciaTecnica){
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
        this._compTecn.delComTec(form._id).subscribe(resp =>{
         this.getCompetenciaTecnica();
         this.ContarCompetenciaTecnica();
         this.toastr.success('Eliminado Correctamente', 'Correcto');
       })
        } 
      })
      
      }
      
        
      habilitarCompetenciaTecnica(form: CompetenciaTecnica){
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
          this._compTecn.habComTec(form._id).subscribe(resp =>{
            this.getCompetenciaTecnica();
            this.ContarCompetenciaTecnica();
            this.toastr.success('Habilitado Correctamente', 'Correcto');
          })
        }
      })
      }

      searchComTec(buscar: NgForm){
        console.log("entrooo");
        if(buscar.value.buscarComTec == "" ){
          this.coincidencia = true;
          this.getCompetenciaTecnica();
        }else{
          this._compTecn.searchComTec(buscar.value.buscarComTec).subscribe(correcto => {
            console.log(correcto);
            if(correcto.length === 0 || correcto.length == null ){
                this.coincidencia = false;
                return;
            }else{
              this.coincidencia = true;
              this.competenciasTecnicas = correcto;
            }
          });
        }
      }

}
