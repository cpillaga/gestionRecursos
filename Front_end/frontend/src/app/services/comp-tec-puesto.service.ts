import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URL_SERVICE } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class CompTecPuestoService {

  idEmp = localStorage.getItem('empresaFact');
  constructor(
    private http: HttpClient
  ) { }

  
  getCompTecPuesto(){
    const token = localStorage.getItem('tokenFact');
    const headers = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        token
    });

    const url = URL_SERVICE.url + '/compTecPuesto/'+this.idEmp;


    return this.http.get( url, {headers} )
            .map( (resp: any) =>
                resp
            );
}


agregarCompTecPuesto(puesto: string, competenciaTecnica: string ) {

  console.log(puesto);
  const grup = {
    
    puesto: puesto,
    competenciaTecnica:competenciaTecnica,
    empresa: this.idEmp,
    estado:'true'

  }
  const token = localStorage.getItem('tokenFact');
  const headers = new HttpHeaders({
         token
  });
  
  const url = URL_SERVICE.url + '/compTecPuesto';

  return this.http.post( url, grup, {headers} )
          .map( (resp: any) =>
              resp
          );
}


updCompTecPuesto(id: string, puesto: string, competenciaTecnica: string){
  let token = localStorage.getItem('tokenFact');
  const headers = new HttpHeaders({
    token
  });

  const url = URL_SERVICE.url + '/compTecPuesto/' + id;

  const grup = {
      empresa: this.idEmp,
      puesto: puesto,
      competenciaTecnica: competenciaTecnica
  };

  return this.http.put( url, grup, { headers} )
    .map((resp: any) =>
        resp
    );
}

delCompTecPuesto(id: string){
  let token = localStorage.getItem('tokenFact');
  const headers = new HttpHeaders({
    token
  });

  const url = URL_SERVICE.url + '/compTecPuesto/' + id;


  return this.http.delete( url, { headers} )
    .map((resp: any) =>
        resp
    );
}


habCompTecPuesto(id: string){
  let token = localStorage.getItem('tokenFact');
  const headers = new HttpHeaders({
    token
  });

  const url = URL_SERVICE.url + '/compTecPuesto/habilitar/' + id;


  return this.http.delete( url, { headers} )
    .map((resp: any) =>
        resp
    );
}

 
searchCompTecPuesto(termino: string){
  let token = localStorage.getItem('tokenFact');
  const headers = new HttpHeaders({
    token
  });

  const url = URL_SERVICE.url + '/compTecPuesto/buscar/' + termino + "/" + this.idEmp;

  return this.http.get( url, {headers} )
              .map( (resp: any) =>
                  resp.compTecPuesto
              );
}


countCompTecPuesto(){
  const token = localStorage.getItem('tokenFact');
  const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      token
  });

  const url = URL_SERVICE.url + '/compTecPuesto/contar/'+this.idEmp;


  return this.http.get( url, {headers} )
          .map( (resp: any) =>
              resp
          );
}


}
