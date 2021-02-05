import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URL_SERVICE } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class ActividadCargoService {

  idEmp = localStorage.getItem('empresaFact');
  constructor(
    private http: HttpClient
  ) { }

  getActividadCargo(){
    const token = localStorage.getItem('tokenFact');
    const headers = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        token
    });

    const url = URL_SERVICE.url + '/actividadCargo/'+this.idEmp;


    return this.http.get( url, {headers} )
            .map( (resp: any) =>
                resp
            );
}

agregarActividadCargo(desc: string, fr: string, co: string, cm: string , total: string, puesto: string   ) {

  const grup = {
    descripcion: desc,
    empresa: this.idEmp,
    estado:'true',
    fr: fr,
    co: co,
    cm: cm,
    total: total,
    puesto: puesto

  }
  const token = localStorage.getItem('tokenFact');
  const headers = new HttpHeaders({
         token
  });
  
  const url = URL_SERVICE.url + '/actividadCargo';

  return this.http.post( url, grup, {headers} )
          .map( (resp: any) =>
              resp
          );
}

updActividadCargo(descripcion: string, id: string, fr: string, co: string,  cm: string,  total: string,  puesto: string){
  let token = localStorage.getItem('tokenFact');
  const headers = new HttpHeaders({
    token
  });

  const url = URL_SERVICE.url + '/actividadCargo/' + id;

  const grup = {
      descripcion: descripcion,
      empresa: this.idEmp,
      fr: fr,
      co: co,
      cm: cm,
      total: total,
      puesto: puesto,
  };

  return this.http.put( url, grup, { headers} )
    .map((resp: any) =>
        resp
    );
}


delActCarg(id: string){
  let token = localStorage.getItem('tokenFact');
  const headers = new HttpHeaders({
    token
  });

  const url = URL_SERVICE.url + '/actividadCargo/' + id;


  return this.http.delete( url, { headers} )
    .map((resp: any) =>
        resp
    );
}


habActCarg(id: string){
  let token = localStorage.getItem('tokenFact');
  const headers = new HttpHeaders({
    token
  });

  const url = URL_SERVICE.url + '/actividadCargo/habilitar/' + id;


  return this.http.delete( url, { headers} )
    .map((resp: any) =>
        resp
    );
}


searchActCarg(termino: string){
  let token = localStorage.getItem('tokenFact');
  const headers = new HttpHeaders({
    token
  });

  const url = URL_SERVICE.url + '/actividadCargo/buscar/' + termino + "/" + this.idEmp;

  return this.http.get( url, {headers} )
              .map( (resp: any) =>
                  resp.actividadCargo
              );
}


countActCarg(){
  const token = localStorage.getItem('tokenFact');
  const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      token
  });

  const url = URL_SERVICE.url + '/actividadCargo/contar/'+this.idEmp;


  return this.http.get( url, {headers} )
          .map( (resp: any) =>
              resp
          );
}
}
