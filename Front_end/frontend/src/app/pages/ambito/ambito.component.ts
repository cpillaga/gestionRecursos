import { Component, OnInit, ViewChild } from '@angular/core';
import { AmbitoService } from '../../services/ambito.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Usuario } from 'src/app/models/usuario.model';
import { Ambito } from 'src/app/models/ambito.models';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ambito',
  templateUrl: './ambito.component.html',
  styleUrls: ['./ambito.component.css']
})
export class AmbitoComponent implements OnInit {

  ambitos:Ambito[] = [];
  desAmb: String = "";
  desAmbU: String = "";
  empRol: Usuario;
  getDataAmb: Ambito;
  dataUpdAmb:Boolean= false;
  coincidencia:Boolean= true;
  buscarAmb: string = "";
  contAmb: string = "";

  @ViewChild('closebuttonadd',  {static: false}) closebuttonadd;
   @ViewChild('closebuttonupd',  {static: false}) closebuttonupd;
 
  constructor(
    public _ambito: AmbitoService,
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
  this.getAmbito();
  this.ContarAmbito();
}
getAmbito(){
  this._ambito.getAmbito().subscribe(resp => {
    console.log(resp);
    this.ambitos = resp.ambito;
  })
}

addAmbitos(ambito:NgForm){
  for (let i = 0; i < this.ambitos.length; i++) {
 if (ambito.value.desAmb === this.ambitos[i].descripcion) {
  Swal.fire({
    title: 'ya exise el Ambito!',
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
this._ambito.agregarAmbito(ambito.value.desAmb).subscribe(resp => {
 console.log(resp);
 this.getAmbito();
 this.ContarAmbito();
 this.closebuttonadd.nativeElement.click();
 this.toastr.success('Agregado Correctamente', 'Correcto');
})
}

getDataAmbito(ambito: Ambito){
  this.getDataAmb = ambito;
  this.desAmbU = ambito.descripcion;
  this.dataUpdAmb = true;
}


updAmbitos(form: NgForm){
  console.log(form.value);
      this._ambito.updAmbito(form.value.desAmbU, this.getDataAmb._id).subscribe(correcto => {
        this.getAmbito();
         this.closebuttonupd.nativeElement.click();
         this.toastr.success('Modificado Correctamente', 'Correcto');
      });
    }

    
  eliminarAmbito(form:Ambito){
    Swal.fire({
      title: 'Esta seguro?',
      text: 'desea elimniar el registro!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, Cancelar'
    }).then((result) => {
      if (result.value) {
      this._ambito.delAmb(form._id).subscribe(resp =>{
       this.getAmbito();
       this.ContarAmbito();
       this.toastr.success('Eliminado Correctamente', 'Correcto');
     })
      } 
    })
    
    }
    
      
    habilitarAmbito(form: Ambito){
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
        this._ambito.habAmb(form._id).subscribe(resp =>{
          this.getAmbito();
          this.ContarAmbito();
          this.toastr.success('Habilitado Correctamente', 'Correcto');
        })
      }
    })
    }

     
searchAmb(buscar: NgForm){
  console.log("entrooo");
  if(buscar.value.buscarAmb == "" ){
    this.coincidencia = true;
    this.getAmbito();
  }else{
    this._ambito.searchAmb(buscar.value.buscarAmb).subscribe(correcto => {
      if(correcto.length === 0 ){
          this.coincidencia = false;
          return;
      }else{
        this.coincidencia = true;
        this.ambitos = correcto;
      }
    });
  }
}

ContarAmbito(){
  this._ambito.countAmb().subscribe(resp=>{
    this.contAmb = resp.total;
  })
}
}
