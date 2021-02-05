import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URL_SERVICE } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class ExperienciaPuestoService {

  idEmp = localStorage.getItem('empresaFact');

  constructor(
    private http: HttpClient
  ) { }

  
  getExperienciaPuesto(){
    const token = localStorage.getItem('tokenFact');
    const headers = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        token
    });

    const url = URL_SERVICE.url + '/expPuesto/'+this.idEmp;


    return this.http.get( url, {headers} )
            .map( (resp: any) =>
                resp
            );
}


agregarExperienciaPuesto(area: string, tiempo: string, especificidad: string, experiencia: string, puesto: string ) {

  const expP = {
    area: area,
    tiempo: tiempo,
    especificidad: especificidad,
    experiencia: experiencia,
    puesto: puesto,
    empresa: this.idEmp,
    estado:'true'

  }
  const token = localStorage.getItem('tokenFact');
  const headers = new HttpHeaders({
         token
  });
  
  const url = URL_SERVICE.url + '/expPuesto';

  return this.http.post( url, expP, {headers} )
          .map( (resp: any) =>
              resp
          );
}


updExpPuest(area: string, id: string, tiempo: string, especificidad: string, experiencia: string, puesto: string ){
  let token = localStorage.getItem('tokenFact');
  const headers = new HttpHeaders({
    token
  });

  const url = URL_SERVICE.url + '/expPuesto/' + id;

  const expP = {
      area: area,
      empresa: this.idEmp,
      tiempo: tiempo,
      especificidad: especificidad,
      experiencia: experiencia,
      puesto: puesto
  };

  return this.http.put( url, expP, { headers} )
    .map((resp: any) =>
        resp
    );
}

delExpPuest(id: string){
  let token = localStorage.getItem('tokenFact');
  const headers = new HttpHeaders({
    token
  });

  const url = URL_SERVICE.url + '/expPuesto/' + id;


  return this.http.delete( url, { headers} )
    .map((resp: any) =>
        resp
    );
}


habExpPuest(id: string){
  let token = localStorage.getItem('tokenFact');
  const headers = new HttpHeaders({
    token
  });

  const url = URL_SERVICE.url + '/expPuesto/habilitar/' + id;


  return this.http.delete( url, { headers} )
    .map((resp: any) =>
        resp
    );
}


searchExpPuest(termino: string){
  let token = localStorage.getItem('tokenFact');
  const headers = new HttpHeaders({
    token
  });

  const url = URL_SERVICE.url + '/expPuesto/buscar/' + termino + "/" + this.idEmp;

  return this.http.get( url, {headers} )
              .map( (resp: any) =>
                  resp.expPuesto
              );
}

countExpPuest(){
  const token = localStorage.getItem('tokenFact');
  const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      token
  });

  const url = URL_SERVICE.url + '/expPuesto/contar/'+this.idEmp;


  return this.http.get( url, {headers} )
          .map( (resp: any) =>
              resp
          );
}


}
