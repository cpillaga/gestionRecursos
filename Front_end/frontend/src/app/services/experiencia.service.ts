import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_SERVICE } from '../config/config';
import { Experiencia } from '../models/experiencia.models';

@Injectable({
  providedIn: 'root'
})
export class ExperienciaService {
  idEmp = localStorage.getItem('empresaFact');
  constructor(
    private http: HttpClient
  ) { }

  
  getExperiencia(){
    const token = localStorage.getItem('tokenFact');
    const headers = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        token
    });

    const url = URL_SERVICE.url + '/experiencia/'+this.idEmp;


    return this.http.get( url, {headers} )
            .map( (resp: any) =>
                resp
            );
}



agregarExperiencia(
  desc: string,
  grad: string,
     ) {
  
    const exp = {
      descripcion: desc,
      grado:   grad,
      empresa: this.idEmp,
     estado:'true',
  
    }
    const token = localStorage.getItem('tokenFact');
    const headers = new HttpHeaders({
           token
    });
    
    const url = URL_SERVICE.url + '/experiencia';
  
    return this.http.post( url, exp, {headers} )
            .map( (resp: any) =>
                resp
            );
  }


  updExperiencia(
    desc: string,
    grad: string,
    id: string){
    let token = localStorage.getItem('tokenFact');
    const headers = new HttpHeaders({
      token
    });
  
    const url = URL_SERVICE.url + '/experiencia/' + id;
  
    const exp = {
      descripcion: desc,
      grado:   grad,
  
    }
  
    return this.http.put( url, exp, { headers} )
      .map((resp: any) =>
          resp
      );
  }



  delExp(id: string){
    let token = localStorage.getItem('tokenFact');
    const headers = new HttpHeaders({
      token
    });
  
    const url = URL_SERVICE.url + '/experiencia/' + id;
  
  
    return this.http.delete( url, { headers} )
      .map((resp: any) =>
          resp
      );
  }
  
  
  habExp(id: string){
    let token = localStorage.getItem('tokenFact');
    const headers = new HttpHeaders({
      token
    });
  
    const url = URL_SERVICE.url + '/experiencia/habilitar/' + id;
  
  
    return this.http.delete( url, { headers} )
      .map((resp: any) =>
          resp
      );
  }

  
searchExp(termino: string){
  let token = localStorage.getItem('tokenFact');
  const headers = new HttpHeaders({
    token
  });

  const url = URL_SERVICE.url + '/experiencia/buscar/' + termino + "/" + this.idEmp;

  return this.http.get( url, {headers} )
              .map( (resp: any) =>
                  resp.experiencia
              );
}


countExp(){
  const token = localStorage.getItem('tokenFact');
  const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      token
  });

  const url = URL_SERVICE.url + '/experiencia/contar/'+this.idEmp;


  return this.http.get( url, {headers} )
          .map( (resp: any) =>
              resp
          );
}

}
