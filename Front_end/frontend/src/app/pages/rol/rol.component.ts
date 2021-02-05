import { Component, OnInit, ViewChild } from '@angular/core';
import { RolService } from '../../services/rol.service';
import { Router } from '@angular/router';
import { Rol } from '../../models/rol.models';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Usuario } from '../../models/usuario.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-rol',
  templateUrl: './rol.component.html',
  styleUrls: ['./rol.component.css']
})
export class RolComponent implements OnInit {

  roles:Rol[] = [];
  desRol: String = "";
  getDataRol: Rol;
  desRolU: string;
  dataUpd:Boolean= false;
  coincidencia:Boolean= true;
  buscarRol: string = "";
  empRol: Usuario;
  contRol: string = "";
  @ViewChild('closebuttonadd',  {static: false}) closebuttonadd;
   @ViewChild('closebuttonupd',  {static: false}) closebuttonupd;
  constructor(
    public _rol: RolService,
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
    this.getRol();
    this.ContarRol();
  }

  getRol(){
    this._rol.getRol().subscribe(resp => {
      console.log(resp);
      this.roles = resp.rol;
    })
  }
  addRoles(rol:NgForm){
    for (let i = 0; i < this.roles.length; i++) {
      if (rol.value.desRol === this.roles[i].descripcion) {
        Swal.fire({
          title: 'ya exise el Rol!',
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
    this._rol.agregarRol(rol.value.desRol).subscribe(resp => {
      console.log(resp);
      this.getRol();
      this.ContarRol();
      this.closebuttonadd.nativeElement.click();
      this.toastr.success('Agregado Correctamente', 'Correcto');

    })
  }
  
  getData(rol: Rol){
    this.getDataRol = rol;
    this.desRolU = rol.descripcion;
    this.dataUpd = true;
  }

  updRoles(form: NgForm){
    this._rol.updRol(form.value.desRolU, this.getDataRol._id).subscribe(correcto => {
      this.getRol();
       this.closebuttonupd.nativeElement.click();
       this.toastr.success('Modificado Correctamente', 'Correcto');
    });
  }
  
eliminarRol(form: Rol){
Swal.fire({
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
    this._rol.delRol(form._id).subscribe(resp =>{
      this.getRol();
      this.ContarRol();
      this.toastr.success('Eliminado Correctamente', 'Correcto');
   
    })
  }
})
}

  
habilitarRol(form: Rol){
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
    this._rol.habRol(form._id).subscribe(resp =>{
      this.getRol();
      this.ContarRol();
      this.toastr.success('Habilitado Correctamente', 'Correcto');
    })
  }
})
}

searchRol(buscar: NgForm){
  console.log("entrooo");
  if(buscar.value.buscarRol == "" ){
    this.coincidencia = true;
    this.getRol();
  }else{
    this._rol.searchRol(buscar.value.buscarRol).subscribe(correcto => {
      if(correcto.length === 0 ){
          this.coincidencia = false;
          return;
      }else{
        this.coincidencia = true;
        this.roles = correcto;
      }
    });
  }
}

ContarRol(){
  this._rol.countRol().subscribe(resp=>{
    this.contRol = resp.total;
  })
}
}
