import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { URL_SERVICE } from '../config/config';
import 'rxjs/add/operator/map';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  constructor(
    private http: HttpClient
  ) { }

  getEmpresaID(idEmp){

    let token = localStorage.getItem('tokenFact');
    const headers = new HttpHeaders({
      token
    });

    const url = URL_SERVICE.url + '/empresa/' + idEmp;

    return this.http.get( url, {headers} )
                .map( (resp: any) =>
                    resp.empresa
                );
  }
}


