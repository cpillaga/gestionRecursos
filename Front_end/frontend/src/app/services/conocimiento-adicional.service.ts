import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_SERVICE } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class ConocimientoAdicionalService {

  idEmp = localStorage.getItem('empresaFact');
  constructor(
    private http: HttpClient
    ) { }


    getConocimiento(){
      const token = localStorage.getItem('tokenFact');
      const headers = new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded',
          token
      });
  
      const url = URL_SERVICE.url + '/conocimiento/'+this.idEmp;
  
  
      return this.http.get( url, {headers} )
              .map( (resp: any) =>
                  resp
              );
  }

  
  agregarConocimiento(desc: string ) {

    const con = {
      descripcion: desc,
      empresa: this.idEmp,
      estado:'true',

    }
    const token = localStorage.getItem('tokenFact');
    const headers = new HttpHeaders({
           token
    });
    
    const url = URL_SERVICE.url + '/conocimiento';
  
    return this.http.post( url, con, {headers} )
            .map( (resp: any) =>
                resp
            );
  }
  
  updConocimiento(descripcion: string, id: string){
    let token = localStorage.getItem('tokenFact');
    const headers = new HttpHeaders({
      token
    });
  
    const url = URL_SERVICE.url + '/conocimiento/' + id;
  
    const amb = {
      descripcion: descripcion,
      empresa: this.idEmp,

    }
  
    return this.http.put( url, amb, { headers} )
      .map((resp: any) =>
          resp
      );
  }
 
  delCon(id: string){
    let token = localStorage.getItem('tokenFact');
    const headers = new HttpHeaders({
      token
    });
  
    const url = URL_SERVICE.url + '/conocimiento/' + id;
  
  
    return this.http.delete( url, { headers} )
      .map((resp: any) =>
          resp
      );
  }
  
  
  habCon(id: string){
    let token = localStorage.getItem('tokenFact');
    const headers = new HttpHeaders({
      token
    });
  
    const url = URL_SERVICE.url + '/conocimiento/habilitar/' + id;
  
  
    return this.http.delete( url, { headers} )
      .map((resp: any) =>
          resp
      );
  }


  searchCon(termino: string){
    let token = localStorage.getItem('tokenFact');
    const headers = new HttpHeaders({
      token
    });
  
    const url = URL_SERVICE.url + '/conocimiento/buscar/' + termino + "/" + this.idEmp;
  
    return this.http.get( url, {headers} )
                .map( (resp: any) =>
                    resp.conocimiento
                );
  }
  

  countCon(){
    const token = localStorage.getItem('tokenFact');
    const headers = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        token
    });
  
    const url = URL_SERVICE.url + '/conocimiento/contar/'+this.idEmp;
  
  
    return this.http.get( url, {headers} )
            .map( (resp: any) =>
                resp
            );
  }
}
