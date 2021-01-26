import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { URL_SERVICE } from '../config/config';
import 'rxjs/add/operator/map';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(
    private http: HttpClient
  ) { }
  login(usu, password) {
    const headers = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
    });

    const url = URL_SERVICE.url + '/usuario/login';

    const body = {
        usu,
        password
    };

    return this.http.post( url, this.getFormUrlEncoded(body), {headers} )
            .map( (resp: any) =>
                resp
            );
}

getFormUrlEncoded(toConvert) {
  const formBody = [];
  for (const property in toConvert) {
    if (toConvert) {
      const encodedKey = encodeURIComponent(property);
      const encodedValue = encodeURIComponent(toConvert[property]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
  }
  return formBody.join('&');
}
}
