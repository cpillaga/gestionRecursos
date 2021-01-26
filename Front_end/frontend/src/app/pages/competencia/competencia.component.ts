import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Usuario } from 'src/app/models/usuario.model';
import { CompetenciaService } from '../../services/competencia.service';
import { Competencia } from '../../models/competencia.models';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-competencia',
  templateUrl: './competencia.component.html',
  styleUrls: ['./competencia.component.css']
})
export class CompetenciaComponent implements OnInit {
  competencias:Competencia[] = [];
  empRol: Usuario;
  desComp: String = "";
  desCompU: string;
  getDataComp: Competencia;
  dataUpdComp:Boolean= false;
  coincidencia:Boolean= false;
  buscarComp: string = "";
  contComp: string = "";
  @ViewChild('closebuttonadd',  {static: false}) closebuttonadd;
   @ViewChild('closebuttonupd',  {static: false}) closebuttonupd;
  constructor(
    public _competencia: CompetenciaService,
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
    this.getCompetencia();
    this.ContarCompetencia();
  }
  
  getCompetencia(){
    this._competencia.getCompetencia().subscribe(resp => {
      console.log(resp);
      this.competencias = resp.competencia;
    })
  }

  addCompetencias(competencia:NgForm){
    for (let i = 0; i < this.competencias.length; i++) {
   if (competencia.value.desComp === this.competencias[i].descripcion) {
     alert("ya Existe el Competencia");
     return;
   }
 }
 this._competencia.agregarCompetencia(competencia.value.desComp).subscribe(resp => {
   console.log(resp);
   this.getCompetencia();
   this.ContarCompetencia();
   this.closebuttonadd.nativeElement.click();
   this.toastr.success('Agregado Correctamente', 'Correcto');
 })
}

getDataCompetencia(competencia: Competencia){
 this.getDataComp = competencia;
 this.desCompU = competencia.descripcion;

 this.dataUpdComp = true;
}

updCompetencias(form: NgForm){
  console.log(form.value);
      this._competencia.updCompetencia(form.value.desGrupU, this.getDataComp._id).subscribe(correcto => {
        this.getCompetencia();
         this.closebuttonupd.nativeElement.click();
         this.toastr.success('Modificado Correctamente', 'Correcto');
      });
    }

    eliminarCompetencia(form:Competencia){
      Swal.fire({
        title: 'Esta seguro?',
        text: 'desea elimniar el registro!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si, eliminar!',
        cancelButtonText: 'No, Cancelar'
      }).then((result) => {
        if (result.value) {
        this._competencia.delComp(form._id).subscribe(resp =>{
         this.getCompetencia();
         this.ContarCompetencia();
         this.toastr.success('Eliminado Correctamente', 'Correcto');
       })
        } 
      })
      
      }
      
        
      habilitarCompetencia(form: Competencia){
      Swal.fire({
        title: 'Esta seguro?',
        text: 'desea Habilitar el registro!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si, Habilitar!',
        cancelButtonText: 'No, Cancelar'
      }).then((result) => {
        if (result.value) {
          this._competencia.habComp(form._id).subscribe(resp =>{
            this.getCompetencia();
            this.ContarCompetencia();
            this.toastr.success('Habilitado Correctamente', 'Correcto');
          })
        }
      })
      }
      searchComp(buscar: NgForm){
        console.log("entrooo");
        if(buscar.value.buscarComp == "" ){
          this.coincidencia = true;
          this.getCompetencia();
        }else{
          this._competencia.searchComp(buscar.value.buscarComp).subscribe(correcto => {
            if(correcto.length === 0 ){
                this.coincidencia = false;
                return;
            }else{
              this.coincidencia = true;
              this.competencias = correcto;
            }
          });
        }
      }   
      ContarCompetencia(){
        this._competencia.countComp().subscribe(resp=>{
          this.contComp = resp.total;
        })
      }

  }

