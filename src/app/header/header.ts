import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { Observable } from 'rxjs';
import { AuthResponse } from '../models/interfaces';

@Component({
  selector: 'app-header',
  imports: [RouterModule, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class HeaderComponent implements OnInit {
  isAuthenticated$ = false;
  currentUser: AuthResponse | null = null;

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe((isAuth) => {
      this.isAuthenticated$ = isAuth;
    });

    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
  }

  isHomePage(): boolean {
    return this.router.url === '/';
  }

  isTicketCheckPage(): boolean {
    return this.router.url === '/ticket-check';
  }

  isHelpPage(): boolean {
    return this.router.url === '/help';
  }

  goHome() {
    this.router.navigate(['/']);
  }

  goToTicketCheck() {
    this.router.navigate(['/ticket-check']);
  }

  goToHelp() {
    this.router.navigate(['/help']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
