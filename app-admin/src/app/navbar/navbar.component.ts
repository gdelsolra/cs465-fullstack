import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; //  needed for routerLink
import { AuthenticationService } from '../services/authentication.service';

@Component({
  standalone: true, //  This tells Angular it's a standalone component
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  imports: [CommonModule, RouterModule] //  Required for *ngIf, routerLink, etc.
})
export class NavbarComponent implements OnInit {

  constructor(
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {}

  public isLoggedIn(): boolean {
    return this.authenticationService.isLoggedIn();
  }

  public onLogout(): void {
    this.authenticationService.logout(); //  don't return a void function
  }
}
