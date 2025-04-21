import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'], // fixed typo
  imports: [CommonModule, RouterOutlet, NavbarComponent] // use only needed components
})
export class AppComponent {
  title = 'Travel Getaway Admin!';
}
