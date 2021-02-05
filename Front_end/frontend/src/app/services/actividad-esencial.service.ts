import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URL_SERVICE } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class ActividadEsencialService {
  

  idEmp = localStorage.getItem('empresaFact');

  constructor(
    private http: HttpClient
  ) { }

  
  getActividadEsencial(){
    const token = localStorage.getItem('tokenFact');
    const headers = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        token
    });

    const url = URL_SERVICE.url + '/actividadEsencial/'+this.idEmp;


    return this.http.get( url, {headers} )
            .map( (resp: any) =>
                resp
            );
}

agregarActividadEsencial(desc: string, puesto: string, conocimientoAdicional: string ) {

  const grup = {
    descripcion: desc,
    empresa: this.idEmp,
    estado:'true',
    puesto: puesto,
    conocimientoAdicional: conocimientoAdicional

  }
  const token = localStorage.getItem('tokenFact');
  const headers = new HttpHeaders({
         token
  });
  
  const url = URL_SERVICE.url + '/actividadEsencial';

  return this.http.post( url, grup, {headers} )
          .map( (resp: any) =>
              resp
          );
}
updActEsen(descripcion: string, id: string, puesto: string, conocimientoAdicional: string){
  let token = localStorage.getItem('tokenFact');
  const headers = new HttpHeaders({
    token
  });

  const url = URL_SERVICE.url + '/actividadEsencial/' + id;

  const grup = {
      descripcion: descripcion,
      empresa: this.idEmp,
      puesto: puesto,
      conocimientoAdicional: conocimientoAdicional
  };

  return this.http.put( url, grup, { headers} )
    .map((resp: any) =>
        resp
    );
}

delActEsen(id: string){
  let token = localStorage.getItem('tokenFact');
  const headers = new HttpHeaders({
    token
  });

  const url = URL_SERVICE.url + '/actividadEsencial/' + id;


  return this.http.delete( url, { headers} )
    .map((resp: any) =>
        resp
    );
}


habActEsen(id: string){
  let token = localStorage.getItem('tokenFact');
  const headers = new HttpHeaders({
    token
  });

  const url = URL_SERVICE.url + '/actividadEsencial/habilitar/' + id;


  return this.http.delete( url, { headers} )
    .map((resp: any) =>
        resp
    );
}

 
searchActEsen(termino: string){
  let token = localStorage.getItem('tokenFact');
  const headers = new HttpHeaders({
    token
  });

  const url = URL_SERVICE.url + '/actividadEsencial/buscar/' + termino + "/" + this.idEmp;

  return this.http.get( url, {headers} )
              .map( (resp: any) =>
                  resp.actividadEsencial
              );
}


countActEsen(){
  const token = localStorage.getItem('tokenFact');
  const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      token
  });

  const url = URL_SERVICE.url + '/actividadEsencial/contar/'+this.idEmp;


  return this.http.get( url, {headers} )
          .map( (resp: any) =>
              resp
          );
}

}
