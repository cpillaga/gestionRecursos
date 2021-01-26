import { Component, OnInit } from '@angular/core';
import { Empresa } from 'src/app/models/empresa.models';
import { Usuario } from 'src/app/models/usuario.model';
import { EmpresaService } from 'src/app/services/empresa.service';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})

export class SidebarComponent implements OnInit {
  usuario: Usuario;
  empresa: Empresa;
  nombreEmp: string;
  // imgTemp: string;

  constructor(public _empresaService: EmpresaService) { }

  ngOnInit(): void {
    this.usuario = JSON.parse(localStorage.getItem('empFact'));
    this.getEmpresa();
  }

  getEmpresa(){
    let id_emp = localStorage.getItem('empresaFact');

    this._empresaService.getEmpresaID(id_emp).subscribe(correcto => {
    this.nombreEmp = correcto[0].razonSocial;
      // this.imgTemp = URL_SERVICE.url + '/imgEmpresa/empresa/' + correcto[0].img;
    });
  }
  
}
