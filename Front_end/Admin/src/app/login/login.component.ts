import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.models';
import { UsuarioService } from '../services/usuario.service';
import Swal from 'sweetalert2';
import { EmpresaService } from '../services/empresa.service';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: []
})
export class LoginComponent implements OnInit {
  correo = "";

  constructor(
    public router:Router,
    public _adminService: AdminService, 
    public _empresaService: EmpresaService, 
    
  ) { }

  ngOnInit(): void {
  }
  
  public login(forma: NgForm){
    if(forma.invalid) {
      return;
    }
    
  
    this._adminService.login(forma.value.correo, forma.value.password)
      .subscribe(correcto =>
          {
            localStorage.setItem('tokenAdmin', correcto.token);
             this.router.navigate(['/inicio']);
          },
          error => {
              Swal.fire({
              icon: 'error',
              text:'Credenciales Incorrectas',
              showClass: {
                popup: 'animated fadeInDown faster'
              },
              hideClass: {
                popup: 'animated fadeOutUp faster'
              }
            });
          }
      )
  }

}
