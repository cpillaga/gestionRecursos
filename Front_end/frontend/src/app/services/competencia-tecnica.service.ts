import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URL_SERVICE } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class CompetenciaTecnicaService {
  idEmp = localStorage.getItem('empresaFact');
  constructor(
    private http: HttpClient
  ) { }

  
  getCompetenciaTecnica(){
    const token = localStorage.getItem('tokenFact');
    const headers = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        token
    });

    const url = URL_SERVICE.url + '/competenciaTecnica/'+this.idEmp;


    return this.http.get( url, {headers} )
            .map( (resp: any) =>
                resp
            );
}


agregarCompetenciaTecnica(numero: string, denominacion: string, definicion: string) {

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
  
  const url = URL_SERVICE.url + '/competenciaTecnica';

  return this.http.post( url, grup, {headers} )
          .map( (resp: any) =>
              resp
          );
}


updComTec(denominacion: string, id: string, numero: string, definicion: string){
  let token = localStorage.getItem('tokenFact');
  const headers = new HttpHeaders({
    token
  });

  const url = URL_SERVICE.url + '/competenciaTecnica/' + id;

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

delComTec(id: string){
  let token = localStorage.getItem('tokenFact');
  const headers = new HttpHeaders({
    token
  });

  const url = URL_SERVICE.url + '/competenciaTecnica/' + id;


  return this.http.delete( url, { headers} )
    .map((resp: any) =>
        resp
    );
}



habComTec(id: string){
  let token = localStorage.getItem('tokenFact');
  const headers = new HttpHeaders({
    token
  });

  const url = URL_SERVICE.url + '/competenciaTecnica/habilitar/' + id;


  return this.http.delete( url, { headers} )
    .map((resp: any) =>
        resp
    );
}


 
searchComTec(termino: string){
  let token = localStorage.getItem('tokenFact');
  const headers = new HttpHeaders({
    token
  });

  const url = URL_SERVICE.url + '/competenciaTecnica/buscar/' + termino + "/" + this.idEmp;

  return this.http.get( url, {headers} )
              .map( (resp: any) =>
                  resp.competenciaTecnica
              );
}

countComTec(){
  const token = localStorage.getItem('tokenFact');
  const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      token
  });

  const url = URL_SERVICE.url + '/competenciaTecnica/contar/'+this.idEmp;


  return this.http.get( url, {headers} )
          .map( (resp: any) =>
              resp
          );
}

}
