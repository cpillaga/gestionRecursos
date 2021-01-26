import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';
import { UsuarioService } from '../services/usuario.service';
import Swal from 'sweetalert2';
import { EmpresaService } from '../services/empresa.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: []
})
export class LoginComponent implements OnInit {
  usuario = "";

  constructor(
    public router:Router,
    public _usuarioService: UsuarioService, 
    public _empresaService: EmpresaService, 
    
  ) { }

  ngOnInit(): void {
  }
  getEmpresaID(correcto){
    
    this._empresaService.getEmpresaID(correcto.usuario.empresa).subscribe(empresa => {
      if (empresa[0].estado === false) {
        Swal.fire({
          icon: 'error',
          text: 'Empresa inactiva',
          showClass: {
            popup: 'animated fadeInDown faster'
          },
          hideClass: {
            popup: 'animated fadeOutUp faster'
          }
        });
        localStorage.removeItem('tokenFact');
        return;
      }else{
        console.log(correcto);
        localStorage.setItem('tokenFact', correcto.token);
        localStorage.setItem('empFact', JSON.stringify(correcto.usuario));
        localStorage.setItem('empleadoFact', correcto.usuario._id);
        localStorage.setItem('empresaFact', correcto.usuario.empresa);
        localStorage.setItem('emprFact', JSON.stringify(empresa[0]));

         if(correcto.usuario.rol == "Administrador"){
          this.router.navigate(['/inicio']).then(() => {
            window.location.reload();
          });;
         }else{
         }
      }
    });
  }

  public login(forma: NgForm){
    if(forma.invalid) {
      return;
    }
    
  
    this._usuarioService.login(forma.value.usuario, forma.value.password)
      .subscribe(correcto =>
          {
            localStorage.setItem('tokenFact', correcto.token);
            this.getEmpresaID(correcto);
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
            console.log(error);
          }
      )
  }

}
