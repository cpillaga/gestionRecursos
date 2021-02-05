import { Component, OnInit, ViewChild } from '@angular/core';
import { ConocimientoAdicionalService } from 'src/app/services/conocimiento-adicional.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Usuario } from 'src/app/models/usuario.model';
import { ConocimientoAdicional } from '../../models/conocimientoAdicional.models';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-conocimiento-adicional',
  templateUrl: './conocimiento-adicional.component.html',
  styleUrls: ['./conocimiento-adicional.component.css']
})
export class ConocimientoAdicionalComponent implements OnInit {

  contCon : string = "";
  desCon : string = "";
  buscarCon: string = "";
  getDataCon : ConocimientoAdicional;
  desConU : string = "";
  dataUpdCon :Boolean= false;
  coincidencia:Boolean= true;
  conocimientos:ConocimientoAdicional[] = [];
  empRol: Usuario;
  @ViewChild('closebuttonadd',  {static: false}) closebuttonadd;
   @ViewChild('closebuttonupd',  {static: false}) closebuttonupd;
 
  constructor(

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
  this.getConocimiento();
  this.Contarconocimiento();
}
  
getConocimiento(){
  this._conocimiento.getConocimiento().subscribe(resp => {
    console.log(resp);
    this.conocimientos = resp.conocimiento;
  })
}


Contarconocimiento(){
  this._conocimiento.countCon().subscribe(resp=>{
    this.contCon = resp.total;
  })
}

addConocimientos(conocimiento:NgForm){
  for (let i = 0; i < this.conocimientos.length; i++) {
 if (conocimiento.value.desCon === this.conocimientos[i].descripcion) {
  Swal.fire({
    title: 'ya exise el Conocimiento Adicional!',
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
   return;
 }
}
this._conocimiento.agregarConocimiento(conocimiento.value.desCon).subscribe(resp => {
 console.log(resp);
 this.getConocimiento();
 this.Contarconocimiento();
 this.closebuttonadd.nativeElement.click();
 this.toastr.success('Agregado Correctamente', 'Correcto');
})
}

getDataConocimiento(conocimiento: ConocimientoAdicional){
  this.getDataCon = conocimiento;
  this.desConU = conocimiento.descripcion;
  this.dataUpdCon = true;
}


updConocimientos(form: NgForm){
  console.log(form.value);
      this._conocimiento.updConocimiento(form.value.desConU, this.getDataCon._id).subscribe(correcto => {
        this.getConocimiento();
         this.closebuttonupd.nativeElement.click();
         this.toastr.success('Modificado Correctamente', 'Correcto');
      });
    }
  
    eliminarConocimiento(form:ConocimientoAdicional){
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
        this._conocimiento.delCon(form._id).subscribe(resp =>{
         this.getConocimiento();
         this.Contarconocimiento();
         this.toastr.success('Eliminado Correctamente', 'Correcto');
       })
        } 
      })
      
      }
      
        
      habilitarConocimiento(form: ConocimientoAdicional){
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
          this._conocimiento.habCon(form._id).subscribe(resp =>{
            this.getConocimiento();
            this.Contarconocimiento();
            this.toastr.success('Habilitado Correctamente', 'Correcto');
          })
        }
      })
      }
   
      searchCon(buscar: NgForm){
        console.log("entrooo");
        if(buscar.value.buscarCon == "" ){
          this.coincidencia = true;
          this.getConocimiento();
        }else{
          this._conocimiento.searchCon(buscar.value.buscarCon).subscribe(correcto => {
            if(correcto.length === 0 ){
                this.coincidencia = false;
                return;
            }else{
              this.coincidencia = true;
              this.conocimientos = correcto;
            }
          });
        }
      }  

}
