import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URL_SERVICE } from '../config/config';


@Injectable({
  providedIn: 'root'
})
export class AmbitoService {

  idEmp = localStorage.getItem('empresaFact');
  constructor( 
    private http: HttpClient
    ) { }

    getAmbito(){
      const token = localStorage.getItem('tokenFact');
      const headers = new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded',
          token
      });
  
      const url = URL_SERVICE.url + '/ambito/'+this.idEmp;
  
  
      return this.http.get( url, {headers} )
              .map( (resp: any) =>
                  resp
              );
  }

  agregarAmbito(desc: string ) {

    const amb = {
      descripcion: desc,
      empresa: this.idEmp,
      estado:'true',

    }
    const token = localStorage.getItem('tokenFact');
    const headers = new HttpHeaders({
           token
    });
    
    const url = URL_SERVICE.url + '/ambito';
  
    return this.http.post( url, amb, {headers} )
            .map( (resp: any) =>
                resp
            );
  }
  
  updAmbito(descripcion: string, id: string){
    let token = localStorage.getItem('tokenFact');
    const headers = new HttpHeaders({
      token
    });
  
    const url = URL_SERVICE.url + '/ambito/' + id;
  
    const amb = {
      descripcion: descripcion,
      empresa: this.idEmp,

    }
  
    return this.http.put( url, amb, { headers} )
      .map((resp: any) =>
          resp
      );
  }
  
  
delAmb(id: string){
  let token = localStorage.getItem('tokenFact');
  const headers = new HttpHeaders({
    token
  });

  const url = URL_SERVICE.url + '/ambito/' + id;


  return this.http.delete( url, { headers} )
    .map((resp: any) =>
        resp
    );
}


habAmb(id: string){
  let token = localStorage.getItem('tokenFact');
  const headers = new HttpHeaders({
    token
  });

  const url = URL_SERVICE.url + '/ambito/habilitar/' + id;


  return this.http.delete( url, { headers} )
    .map((resp: any) =>
        resp
    );
}


searchAmb(termino: string){
  let token = localStorage.getItem('tokenFact');
  const headers = new HttpHeaders({
    token
  });

  const url = URL_SERVICE.url + '/ambito/buscar/' + termino + "/" + this.idEmp;

  return this.http.get( url, {headers} )
              .map( (resp: any) =>
                  resp.ambito
              );
}


countAmb(){
  const token = localStorage.getItem('tokenFact');
  const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      token
  });

  const url = URL_SERVICE.url + '/ambito/contar/'+this.idEmp;


  return this.http.get( url, {headers} )
          .map( (resp: any) =>
              resp
          );
}
  
}
