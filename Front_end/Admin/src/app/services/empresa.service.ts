import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { URL_SERVICE } from '../config/config';
import 'rxjs/add/operator/map';
import { map } from 'rxjs/operators';
import { Empresa } from '../models/empresa.models';


@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  constructor(
    private http: HttpClient
  ) { }

  getEmpresa(){

    let token = localStorage.getItem('tokenFact');
    const headers = new HttpHeaders({
      token
    });

    const url = URL_SERVICE.url + '/empresa';

    return this.http.get( url, {headers} )
                .map( (resp: any) =>
                    resp.empresa
                );
  }

  agregarEmpresa(empresa:Empresa ) {

    const emp = {
      ruc: empresa.ruc,
      razonSocial: empresa.razonSocial,
      telefono: empresa.telefono,
      direccion: empresa.direccion,
      correo: empresa.correo,
      img: empresa.img,
      fechaIngreso: empresa.fechaIngreso,
      estado: empresa.estado,
      estadoPago: empresa.estadoPago
  
    }
    const token = localStorage.getItem('tokenFact');
    const headers = new HttpHeaders({
           token
    });
    

    const url = URL_SERVICE.url + '/empresa';
  
    return this.http.post( url, emp, {headers} )
            .map( (resp: any) =>
                resp
            );
  }
  
  updEmpresa(empresa:Empresa){
    let token = localStorage.getItem('tokenFact');
    const headers = new HttpHeaders({
      token
    });
  
    const url = URL_SERVICE.url + '/empresa/' + empresa._id;
  
    const emp = {
      ruc: empresa.ruc,
      razonSocial: empresa.razonSocial,
      telefono: empresa.telefono,
      direccion: empresa.direccion,
      correo: empresa.correo,
      img: empresa.img,
      fechaIngreso: empresa.fechaIngreso,
      estado: empresa.estado,
      estadoPago: empresa.estadoPago
  
    }
  
    return this.http.put( url, emp, { headers} )
      .map((resp: any) =>
          resp
      );
  }
  
delEmp(id: string){
  let token = localStorage.getItem('tokenFact');
  const headers = new HttpHeaders({
    token
  });

  const url = URL_SERVICE.url + '/empresa/' + id;


  return this.http.delete( url, { headers} )
    .map((resp: any) =>
        resp
    );
}


habEmp(id: string){
  let token = localStorage.getItem('tokenFact');
  const headers = new HttpHeaders({
    token
  });

  const url = URL_SERVICE.url + '/empresa/habilitar/' + id;


  return this.http.delete( url, { headers} )
    .map((resp: any) =>
        resp
    );
}


searchEmp(termino: string){
  let token = localStorage.getItem('tokenFact');
  const headers = new HttpHeaders({
    token
  });

  const url = URL_SERVICE.url + '/empresa/buscar/' + termino;

  return this.http.get( url, {headers} )
              .map( (resp: any) =>
                  resp.empresa
              );
}


}


