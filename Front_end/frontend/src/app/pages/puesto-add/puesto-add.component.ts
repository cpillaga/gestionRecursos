import { Component, OnInit, ViewChild } from '@angular/core';
import { PuestoService } from '../../services/puesto.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Usuario } from '../../../../../Admin/src/app/models/usuario.models';
import { Puesto } from '../../models/puesto.models';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { Rol } from '../../models/rol.models';
import { Ambito } from '../../models/ambito.models';
import { CompTecObs } from '../../models/compTecObs.models';
import { CompCondObs } from '../../models/compCondObs.models';
import { RolService } from '../../services/rol.service';
import { AmbitoService } from '../../services/ambito.service';
import { CccomportamientoObsService } from '../../services/cccomportamiento-obs.service';
import { CTcomportamientoObsService } from '../../services/ctcomportamiento-obs.service';

@Component({
  selector: 'app-puesto-add',
  templateUrl: './puesto-add.component.html',
  styleUrls: ['./puesto-add.component.css']
})
export class PuestoAddComponent implements OnInit {

  empRol: Usuario;
  codigoPuest: String = "";
  denominacionPuest: String = "";
  misionPuest: String = "";
  nivelPuest: String = "";
  unidadAdminPuest: String = "";
  RIEPuest: String = "";
  capacitacionPuest: String = "";
  rolPuest: String = "";
  grupoOcupacionalPuest: String = "";
  ambitoPuest: String = ""
  gradoPuest: String = "";
  puestos:Puesto[] = []; 
  roles:Rol[] = [];
  ambitos:Ambito[] = [];
  // ctcomportamientos: CompTecObs[] = [];
  // cccomportamientos: CompCondObs[] = [];
  @ViewChild('closebuttonadd',  {static: false}) closebuttonadd;
   @ViewChild('closebuttonupd',  {static: false}) closebuttonupd;
  constructor(
    public _puesto: PuestoService,
    public _rol: RolService,
    public _ambito: AmbitoService,
    // public _cccomportamiento: CccomportamientoObsService,
    // public _ctcomportamiento: CTcomportamientoObsService,
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

    
    this.getPuesto();
    this.getRol();
    this.getAmbito();
    // this.getCcComportamiento()
    // this.getCtComportamiento();
  }

  
  getPuesto(){
    this._puesto.getPuesto().subscribe(resp => {
      console.log(resp);
      this.puestos = resp.puesto;
    })
  }

  getRol(){
    this._rol.getRol().subscribe(resp => {
      console.log(resp);
      this.roles = resp.rol;
    })
  }
  getAmbito(){
    this._ambito.getAmbito().subscribe(resp => {
      console.log(resp);
      this.ambitos = resp.ambito;
    })
  }
  // getCcComportamiento(){
  //   this._cccomportamiento.getCcComportamiento().subscribe(resp => {
  //     console.log(resp);
  //     this.cccomportamientos = resp.compCondObs;
  //   })
  // }
  // getCtComportamiento(){
  //   this._ctcomportamiento.getCtComportamiento().subscribe(resp => {
  //     console.log(resp);
  //     this.ctcomportamientos = resp.compTecObs;
  //   })
  // }

  
  addPuestos(puesto:NgForm){
    for (let i = 0; i < this.puestos.length; i++) {
   if (puesto.value.desGrup === this.puestos[i].denominacion) {
    Swal.fire({
      title: 'ya exise el Puesto!',
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
 this._puesto.agregarPuesto(
                            puesto.value.codigoPuest,
                            puesto.value.denominacionPuest,
                            puesto.value.misionPuest,
                            puesto.value.nivelPuest,
                            puesto.value.unidadAdminPuest,
                            puesto.value.RIEPuest,
                            puesto.value.capacitacionPuest,
                            puesto.value.rolPuest,

                            puesto.value.gradoPuest,
                            puesto.value.compeCondObs,
                            puesto.value.compeTecObs
                            
                            // puesto.value.grupoOcupacionalPuest,
                            // puesto.value.ambitoPuest
                            )
                                                    .subscribe(resp => {
                                                    console.log(resp);
                                                    this.getPuesto();
                                                    this.closebuttonadd.nativeElement.click();
                                                    this.toastr.success('Agregado Correctamente', 'Correcto');
 })
}

}
