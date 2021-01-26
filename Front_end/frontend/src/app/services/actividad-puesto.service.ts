import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URL_SERVICE } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class ActividadPuestoService {

  idEmp = localStorage.getItem('empresaFact');
  constructor(
    private http: HttpClient

  ) { }

  
  getActividadPuesto(){
    const token = localStorage.getItem('tokenFact');
    const headers = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        token
    });

    const url = URL_SERVICE.url + '/actividadPuesto/'+this.idEmp;


    return this.http.get( url, {headers} )
            .map( (resp: any) =>
                resp
            );
}

agregarActividadPuesto(desc: string, tip: string, act: string, puest: string ) {

  const actPuest = {
    descripcion: desc,
    empresa: this.idEmp,
    estado:'true',
    tipo: tip,
    actividad: act,
    puesto: puest

  }
  const token = localStorage.getItem('tokenFact');
  const headers = new HttpHeaders({
         token
  });
  
  const url = URL_SERVICE.url + '/actividadPuesto';

  return this.http.post( url, actPuest, {headers} )
          .map( (resp: any) =>
              resp
          );
}

updActividadPuesto(descripcion: string, id: string, tip: string, act: string, puest: string ){
  let token = localStorage.getItem('tokenFact');
  const headers = new HttpHeaders({
    token
  });

  const url = URL_SERVICE.url + '/actividadPuesto/' + id;

  const actPuest = {
    descripcion: descripcion,
    empresa: this.idEmp,
    tipo: tip,
    actividad: act,
    puesto: puest

  }

  return this.http.put( url, actPuest, { headers} )
    .map((resp: any) =>
        resp
    );
}


delActPuest(id: string){
  let token = localStorage.getItem('tokenFact');
  const headers = new HttpHeaders({
    token
  });

  const url = URL_SERVICE.url + '/actividadPuesto/' + id;


  return this.http.delete( url, { headers} )
    .map((resp: any) =>
        resp
    );
}


habActPuest(id: string){
  let token = localStorage.getItem('tokenFact');
  const headers = new HttpHeaders({
    token
  });

  const url = URL_SERVICE.url + '/actividadPuesto/habilitar/' + id;


  return this.http.delete( url, { headers} )
    .map((resp: any) =>
        resp
    );
}

searchActPuest(termino: string){
  let token = localStorage.getItem('tokenFact');
  const headers = new HttpHeaders({
    token
  });

  const url = URL_SERVICE.url + '/actividadPuesto/buscar/' + termino + "/" + this.idEmp;

  return this.http.get( url, {headers} )
              .map( (resp: any) =>
                  resp.actividadPuesto
              );
}


countActPuest(){
  const token = localStorage.getItem('tokenFact');
  const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      token
  });

  const url = URL_SERVICE.url + '/actividadPuesto/contar/'+this.idEmp;


  return this.http.get( url, {headers} )
          .map( (resp: any) =>
              resp
          );
}

}
