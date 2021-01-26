import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: []
})
export class HeaderComponent implements OnInit {

  constructor(
    public router: Router
  ) { }

  ngOnInit(): void {
  }
  logOUt(){
    localStorage.removeItem('empresaFact');
    localStorage.removeItem('emprFact');
    localStorage.removeItem('empleadoFact');
    localStorage.removeItem('tokenFact');
    localStorage.removeItem('empFact');
    this.router.navigate(['/login'])
    .then(() => {
      window.location.reload();
    });
  }

}
