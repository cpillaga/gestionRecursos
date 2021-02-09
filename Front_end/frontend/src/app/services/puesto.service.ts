import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URL_SERVICE } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class PuestoService {
  
  idEmp = localStorage.getItem('empresaFact');
  constructor(
    private http: HttpClient
  ) { }
  
  getPuesto(){
    const token = localStorage.getItem('tokenFact');
    const headers = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        token
    });

    const url = URL_SERVICE.url + '/puesto/'+this.idEmp;


    return this.http.get( url, {headers} )
            .map( (resp: any) =>
                resp
            );
}

agregarPuesto(
codigoPuest: string,
denominacionPuest: string,
misionPuest: string,
nivelPuest: string,
unidadAdminPuest: string,
RIEPuest: string,
grado:string,
// compeTecObs:string,
// compeCondObs:string,
capacitacionPuest: string,
rolPuest: string,
grupoOcupacionalPuest: string,
ambitoPuest: string,
   ) {

  const puest = {
    codigo: codigoPuest,
    denominacion: denominacionPuest,
    mision: misionPuest,
    nivel: nivelPuest,
    unidadAdmin: unidadAdminPuest,
    RIE: RIEPuest,
    capacitacion: capacitacionPuest,
    rol: rolPuest,
    grado:grado,
    // compeTecObs:compeTecObs,
    // compeCondObs:compeCondObs,
    grupoOcupacional: grupoOcupacionalPuest,
    ambito: ambitoPuest,
    empresa: this.idEmp,
    estado:'true',

  }
  const token = localStorage.getItem('tokenFact');
  const headers = new HttpHeaders({
         token
  });
  
  const url = URL_SERVICE.url + '/puesto';

  return this.http.post( url, puest, {headers} )
          .map( (resp: any) =>
              resp
          );
}

updPuesto(
  codigoPuest: string,
  denominacionPuest: string,
  misionPuest: string,
  nivelPuest: string,
  unidadAdminPuest: string,
  RIEPuest: string,
  grado: string,
  // compeTecObs: string,
  // compeCondObs: string,
  capacitacionPuest: string,
  rolPuest: string,
  grupoOcupacionalPuest: string,
  ambitoPuest: string,
  id: string){
  let token = localStorage.getItem('tokenFact');
  const headers = new HttpHeaders({
    token
  });

  const url = URL_SERVICE.url + '/puesto/' + id;

  const puest = {
    codigo: codigoPuest,
    denominacion: denominacionPuest,
    mision: misionPuest,
    nivel: nivelPuest,
    unidadAdmin: unidadAdminPuest,
    RIE: RIEPuest,
    capacitacion: capacitacionPuest,
    rol: rolPuest,
    grado:grado,
    // compeTecObs:compeTecObs,
    // compeCondObs:compeCondObs,
    grupoOcupacional: grupoOcupacionalPuest,
    ambito: ambitoPuest

  }

  return this.http.put( url, puest, { headers} )
    .map((resp: any) =>
        resp
    );
}

delPuest(id: string){
  let token = localStorage.getItem('tokenFact');
  const headers = new HttpHeaders({
    token
  });

  const url = URL_SERVICE.url + '/puesto/' + id;


  return this.http.delete( url, { headers} )
    .map((resp: any) =>
        resp
    );
}


habPuest(id: string){
  let token = localStorage.getItem('tokenFact');
  const headers = new HttpHeaders({
    token
  });

  const url = URL_SERVICE.url + '/puesto/habilitar/' + id;


  return this.http.delete( url, { headers} )
    .map((resp: any) =>
        resp
    );
}


searchPuest(termino: string){
  let token = localStorage.getItem('tokenFact');
  const headers = new HttpHeaders({
    token
  });

  const url = URL_SERVICE.url + '/puesto/buscar/' + termino + "/" + this.idEmp;

  return this.http.get( url, {headers} )
              .map( (resp: any) =>
                  resp.puesto
              );
}


countPuest(){
  const token = localStorage.getItem('tokenFact');
  const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      token
  });

  const url = URL_SERVICE.url + '/puesto/contar/'+this.idEmp;


  return this.http.get( url, {headers} )
          .map( (resp: any) =>
              resp
          );
}


}
