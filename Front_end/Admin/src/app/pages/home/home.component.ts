import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EmpresaService } from '../../services/empresa.service';
import { Empresa } from '../../models/empresa.models';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  
  empresas:Empresa[] = [];
  dataUpdEmp:boolean= false;
  coincidencia:boolean= false; 
  buscarEmpresa: string = "";
  ruc: string = "";
  
  @ViewChild('closebuttonadd',  {static: false}) closebuttonadd;
   @ViewChild('closebuttonupd',  {static: false}) closebuttonupd;

  constructor(
    public router:Router,
    public _empresa: EmpresaService,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    if(localStorage.getItem('tokenAdmin') == null){
      this.router.navigate(['/login'])
      .then(() => {
        window.location.reload();
      });
    }

    this.getEmpresa();

  }

  getEmpresa(){
    this._empresa.getEmpresa().subscribe(resp => {
      this.empresas = resp;
      console.log(this.empresas);
    })
  }

  
  addEmpresa(empresa:NgForm){
    for (let i = 0; i < this.empresas.length; i++) {
   if (empresa.value.razonSocial === this.empresas[i].razonSocial) {
     alert("ya Existe la empresa");
     return;
   }
 }
 this._empresa.agregarEmpresa(empresa.value).subscribe(resp => {
   console.log(resp);
   this.getEmpresa();
   this.closebuttonadd.nativeElement.click();
   this.toastr.success('Agregado Correctamente', 'Correcto');
 })
}
// getDataEmpresa(empresa: Empresa){
//   this.empresa1 = empresa;
//   this.dataUpdEmp = true;
// }

updEmpresa(form: NgForm){
console.log(form.value);
  this._empresa.updEmpresa(form.value).subscribe(correcto => {
    this.getEmpresa();
     this.closebuttonupd.nativeElement.click();
     this.toastr.success('Modificado Correctamente', 'Correcto');
  });
}


eliminarEmpresa(form:Empresa){
  Swal.fire({
    title: 'Esta seguro?',
    text: 'desea elimniar el registro!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Si, eliminar!',
    cancelButtonText: 'No, Cancelar'
  }).then((result) => {
    if (result.value) {
    this._empresa.delEmp(form._id).subscribe(resp =>{
     this.getEmpresa();
     this.toastr.success('Eliminado Correctamente', 'Correcto');
   })
    } 
  })
  
  }
  
    
  habilitarEmpresa(form: Empresa){
  Swal.fire({
    title: 'Esta seguro?',
    text: 'desea Habilitar el registro!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Si, Habilitar!',
    cancelButtonText: 'No, Cancelar'
  }).then((result) => {
    if (result.value) {
      this._empresa.habEmp(form._id).subscribe(resp =>{
        this.getEmpresa();
        this.toastr.success('Habilitado Correctamente', 'Correcto');
      })
    }
  })
  }

searchEmpresa(buscar: NgForm){
  console.log("entrooo");
  if(buscar.value.buscarEmpresa == "" ){
    this.coincidencia = true;
    this.getEmpresa();
  }else{
    this._empresa.searchEmp(buscar.value.buscarEmpresa).subscribe(correcto => {
      if(correcto.length === 0 ){
          this.coincidencia = false;
          return;
      }else{
        this.coincidencia = true;
        this.empresas = correcto;
      }
    });
  }
}
}
