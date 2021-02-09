import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URL_SERVICE } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class CccomportamientoObsService {

  idEmp = localStorage.getItem('empresaFact');
  constructor(
    private http: HttpClient
  ) { }

  
  getCcComportamiento(){
    const token = localStorage.getItem('tokenFact');
    const headers = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        token
    });

    const url = URL_SERVICE.url + '/compCondObs/'+this.idEmp;


    return this.http.get( url, {headers} )
            .map( (resp: any) =>
                resp
            );
}


agregarCcComportamiento(numero: string, nivel: string, comportamiento: string,competenciaConductual: string ) {

  const grup = {
    comportamiento:comportamiento,
    empresa: this.idEmp,
    estado:'true',
    numero:numero,
    nivel:nivel,
    competenciaConductual:competenciaConductual

  
  }
  const token = localStorage.getItem('tokenFact');
  const headers = new HttpHeaders({
         token
  });
  
  const url = URL_SERVICE.url + '/compCondObs';

  return this.http.post( url, grup, {headers} )
          .map( (resp: any) =>
              resp
          );
}


updCcComportamiento(comportamiento: string, id: string, numero: string, nivel: string, competenciaConductual: string){
  let token = localStorage.getItem('tokenFact');
  const headers = new HttpHeaders({
    token
  });

  const url = URL_SERVICE.url + '/compCondObs/' + id;

  const grup = {
      descripcomportamientocion: comportamiento,
      empresa: this.idEmp,
      numero: numero,
      nivel: nivel,
      competenciaConductual: competenciaConductual
  };

  return this.http.put( url, grup, { headers} )
    .map((resp: any) =>
        resp
    );
}


delCcComportamiento(id: string){
  let token = localStorage.getItem('tokenFact');
  const headers = new HttpHeaders({
    token
  });

  const url = URL_SERVICE.url + '/compCondObs/' + id;


  return this.http.delete( url, { headers} )
    .map((resp: any) =>
        resp
    );
}

habCcComportamiento(id: string){
  let token = localStorage.getItem('tokenFact');
  const headers = new HttpHeaders({
    token
  });

  const url = URL_SERVICE.url + '/compCondObs/habilitar/' + id;


  return this.http.delete( url, { headers} )
    .map((resp: any) =>
        resp
    );
}
 
searchCcComportamiento(termino: string){
  let token = localStorage.getItem('tokenFact');
  const headers = new HttpHeaders({
    token
  });

  const url = URL_SERVICE.url + '/compCondObs/buscar/' + termino + "/" + this.idEmp;

  return this.http.get( url, {headers} )
              .map( (resp: any) =>
                  resp.compCondObs
              );
}


countCcComportamiento(){
  const token = localStorage.getItem('tokenFact');
  const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      token
  });

  const url = URL_SERVICE.url + '/compCondObs/contar/'+this.idEmp;


  return this.http.get( url, {headers} )
          .map( (resp: any) =>
              resp
          );
}


}

