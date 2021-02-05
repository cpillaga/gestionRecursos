import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URL_SERVICE } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class CompetenciaConductualService {
  idEmp = localStorage.getItem('empresaFact');
  constructor(
    private http: HttpClient
  ) { }

  
  getCompetenciaConductual(){
    const token = localStorage.getItem('tokenFact');
    const headers = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        token
    });

    const url = URL_SERVICE.url + '/competenciaConductual/'+this.idEmp;


    return this.http.get( url, {headers} )
            .map( (resp: any) =>
                resp
            );
}


agregarCompetenciaConductual(numero: string, denominacion: string, definicion: string) {

  const grup = {
    numero : numero,
    denominacion : denominacion,
    definicion : definicion,
    empresa: this.idEmp,
    estado:'true'

  }
  const token = localStorage.getItem('tokenFact');
  const headers = new HttpHeaders({
         token
  });
  
  const url = URL_SERVICE.url + '/competenciaConductual';

  return this.http.post( url, grup, {headers} )
          .map( (resp: any) =>
              resp
          );
}


updComCond(denominacion: string, id: string, numero: string, definicion: string){
  let token = localStorage.getItem('tokenFact');
  const headers = new HttpHeaders({
    token
  });

  const url = URL_SERVICE.url + '/competenciaConductual/' + id;

  const grup = {
      
      denominacion : denominacion,
      empresa: this.idEmp,
      numero : numero,
      definicion : definicion,
  };

  return this.http.put( url, grup, { headers} )
    .map((resp: any) =>
        resp
    );
}

delComCond(id: string){
  let token = localStorage.getItem('tokenFact');
  const headers = new HttpHeaders({
    token
  });

  const url = URL_SERVICE.url + '/competenciaConductual/' + id;


  return this.http.delete( url, { headers} )
    .map((resp: any) =>
        resp
    );
}



habComCond(id: string){
  let token = localStorage.getItem('tokenFact');
  const headers = new HttpHeaders({
    token
  });

  const url = URL_SERVICE.url + '/competenciaConductual/habilitar/' + id;


  return this.http.delete( url, { headers} )
    .map((resp: any) =>
        resp
    );
}


 
searchComCond(termino: string){
  let token = localStorage.getItem('tokenFact');
  const headers = new HttpHeaders({
    token
  });

  const url = URL_SERVICE.url + '/competenciaConductual/buscar/' + termino + "/" + this.idEmp;

  return this.http.get( url, {headers} )
              .map( (resp: any) =>
                  resp.competenciaConductual
              );
}

countComCond(){
  const token = localStorage.getItem('tokenFact');
  const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      token
  });

  const url = URL_SERVICE.url + '/competenciaConductual/contar/'+this.idEmp;


  return this.http.get( url, {headers} )
          .map( (resp: any) =>
              resp
          );
}

}
