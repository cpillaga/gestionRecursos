import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Usuario } from 'src/app/models/usuario.model';
import { ActividadEsencialService } from '../../services/actividad-esencial.service';
import { ActividadEsencial } from '../../models/actividadEsencial.models';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { Puesto } from '../../models/puesto.models';
import { PuestoService } from '../../services/puesto.service';
import { ConocimientoAdicionalService } from '../../services/conocimiento-adicional.service';
import { ConocimientoAdicional } from 'src/app/models/conocimientoAdicional.models';

@Component({
  selector: 'app-actividad-esencial',
  templateUrl: './actividad-esencial.component.html',
  styleUrls: ['./actividad-esencial.component.css']
})
export class ActividadEsencialComponent implements OnInit {
 
  contActvEs: string = "";
  desActEse: string = "";
  puestActEse: string = "";
  concimientoActEse: string = "";
  desActEseU: string = "";
  puestActEseU: string = "";
  concimientoActEseU: string = "";
  buscarActEsen: string = "";
  getDataActEsen: ActividadEsencial;
  dataUpdActEsen:Boolean= false;
  coincidencia:Boolean= true;
  actividadesEsenciales:ActividadEsencial[] = [];
  puestos: Puesto[] = [];
  conocimientos: ConocimientoAdicional[] = [];
  empRol: Usuario;
  @ViewChild('closebuttonadd',  {static: false}) closebuttonadd;
  @ViewChild('closebuttonupd',  {static: false}) closebuttonupd;
 constructor(
   public _actividadEsencial: ActividadEsencialService,
   public _puesto: PuestoService,
   public _conocimiento: ConocimientoAdicionalService,
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
    this.getActividadEsencial();
    this.getPuesto();
    this.getConocimiento();
    this.ContarActivdadEsencial();
  }
  
  
  getActividadEsencial(){
    this._actividadEsencial.getActividadEsencial().subscribe(resp => {
      console.log(resp.actividadEsencial);
      this.actividadesEsenciales = resp.actividadEsencial;
    })
  }

  getPuesto(){
    this._puesto.getPuesto().subscribe(resp =>{
this.puestos = resp.puesto;
console.log(resp);
    })
  }

  getConocimiento(){
    this._conocimiento.getConocimiento().subscribe(resp =>{
this.conocimientos = resp.conocimiento;
console.log(resp);
    })
  }

  ContarActivdadEsencial(){
    this._actividadEsencial.countActEsen().subscribe(resp=>{
      this.contActvEs = resp.total;
    })
  }



  addGruposActividadesEsenciales(actividadEsencial:NgForm){
    for (let i = 0; i < this.actividadesEsenciales.length; i++) {
   if (actividadEsencial.value.desActEse === this.actividadesEsenciales[i].descripcion) {
    
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
 this._actividadEsencial.agregarActividadEsencial(
   actividadEsencial.value.desActEse, 
   actividadEsencial.value.puestActEse, 
   actividadEsencial.value.concimientoActEse)
                        .subscribe(resp => {
  
  console.log(resp);
   this.getActividadEsencial();
   this.ContarActivdadEsencial();
   this.closebuttonadd.nativeElement.click();
   this.toastr.success('Agregado Correctamente', 'Correcto');
 })
}

getDataActividadEsencial(actividadEsencial: ActividadEsencial){
 this.getDataActEsen = actividadEsencial;
 this.desActEseU = actividadEsencial.descripcion;
 this.puestActEseU = actividadEsencial.puesto;
 this.concimientoActEseU = actividadEsencial.conocimientoAdicional;
 this.dataUpdActEsen = true;
}  


updActividadesEsenciales(form: NgForm){
  console.log(form.value);
      this._actividadEsencial.updActEsen(
                                          form.value.desActEseU, 
                                          this.getDataActEsen._id, 
                                          form.value.puestActEseU, 
                                          form.value.concimientoActEseU)
                                                    .subscribe(correcto => {
        this.getActividadEsencial();
         this.closebuttonupd.nativeElement.click();
         this.toastr.success('Modificado Correctamente', 'Correcto');
      });
    }


    eliminarActividadEsencial(form:ActividadEsencial){
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
        this._actividadEsencial.delActEsen(form._id).subscribe(resp =>{
         this.getActividadEsencial();
         this.ContarActivdadEsencial();
         this.toastr.success('Eliminado Correctamente', 'Correcto');
       })
        } 
      })
      
      }
      
        
      habilitarActividadEsencial(form: ActividadEsencial){
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
          this._actividadEsencial.habActEsen(form._id).subscribe(resp =>{
            this.getActividadEsencial();
            this.ContarActivdadEsencial();
            this.toastr.success('Habilitado Correctamente', 'Correcto');
          })
        }
      })
      }

      searchActEsen(buscar: NgForm){
        console.log("entrooo");
        if(buscar.value.buscarActEsen == "" ){
          this.coincidencia = true;
          this.getActividadEsencial();
        }else{
          this._actividadEsencial.searchActEsen(buscar.value.buscarActEsen).subscribe(correcto => {
            console.log(correcto);
            if(correcto.length === 0 || correcto.length == null ){
                this.coincidencia = false;
                return;
            }else{
              this.coincidencia = true;
              this.actividadesEsenciales = correcto;
            }
          });
        }
      }
}
