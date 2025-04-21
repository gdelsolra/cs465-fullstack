import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';       
import { FormsModule } from '@angular/forms';         
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../models/user';

@Component({
  standalone: true,                                   
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, FormsModule]                
})
export class LoginComponent implements OnInit {
  public formError: string = '';
  public credentials = {
    name: '',
    email: '',
    password: ''
  };

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {}

  public onLoginSubmit(): void {
    this.formError = '';
    if (!this.credentials.email || !this.credentials.password) {
      this.formError = 'All fields are required, please try again';
    } else {
      this.doLogin();
    }
  }

  private doLogin(): void {
    this.authenticationService.login(this.credentials as User)
      .then(() => this.router.navigateByUrl('/list-trips'))  // ✅ Navigate to the correct route
      .catch((message) => this.formError = message || 'Login failed');
  }
}
