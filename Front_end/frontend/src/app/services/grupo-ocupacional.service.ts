import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URL_SERVICE } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class GrupoOcupacionalService {

  idEmp = localStorage.getItem('empresaFact');
  constructor(
    private http: HttpClient
  ) { }

  getGrupoOcupacional(){
    const token = localStorage.getItem('tokenFact');
    const headers = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        token
    });

    const url = URL_SERVICE.url + '/grupoOcp/'+this.idEmp;


    return this.http.get( url, {headers} )
            .map( (resp: any) =>
                resp
            );
}

// agregarGrupoOcupacional(desc: string ) {
  agregarGrupoOcupacional(desc: string, minval: string, maxval: string ) {

  const grup = {
    descripcion: desc,
    empresa: this.idEmp,
    estado:'true',
    minVal: minval,
    maxVal: maxval

  }
  const token = localStorage.getItem('tokenFact');
  const headers = new HttpHeaders({
         token
  });
  
  const url = URL_SERVICE.url + '/grupoOcp';

  return this.http.post( url, grup, {headers} )
          .map( (resp: any) =>
              resp
          );
}

// updGrupo(descripcion: string, id: string){
  updGrupo(descripcion: string, id: string, minval: string, maxval: string){
  let token = localStorage.getItem('tokenFact');
  const headers = new HttpHeaders({
    token
  });

  const url = URL_SERVICE.url + '/grupoOcp/' + id;

  const grup = {
      descripcion: descripcion,
      empresa: this.idEmp,
      minVal: minval,
      maxVal: maxval
  };

  return this.http.put( url, grup, { headers} )
    .map((resp: any) =>
        resp
    );
}


delGrup(id: string){
  let token = localStorage.getItem('tokenFact');
  const headers = new HttpHeaders({
    token
  });

  const url = URL_SERVICE.url + '/grupoOcp/' + id;


  return this.http.delete( url, { headers} )
    .map((resp: any) =>
        resp
    );
}


habGrup(id: string){
  let token = localStorage.getItem('tokenFact');
  const headers = new HttpHeaders({
    token
  });

  const url = URL_SERVICE.url + '/grupoOcp/habilitar/' + id;


  return this.http.delete( url, { headers} )
    .map((resp: any) =>
        resp
    );
}

 
searchGrup(termino: string){
  let token = localStorage.getItem('tokenFact');
  const headers = new HttpHeaders({
    token
  });

  const url = URL_SERVICE.url + '/grupoOcp/buscar/' + termino + "/" + this.idEmp;

  return this.http.get( url, {headers} )
              .map( (resp: any) =>
                  resp.grupoOcp
              );
}

countGrup(){
  const token = localStorage.getItem('tokenFact');
  const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      token
  });

  const url = URL_SERVICE.url + '/grupoOcp/contar/'+this.idEmp;


  return this.http.get( url, {headers} )
          .map( (resp: any) =>
              resp
          );
}

}



