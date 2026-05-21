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
  isMenuOpen = false;

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

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  goHome() {
    this.router.navigate(['/']);
    this.closeMenu();
  }

  goToTicketCheck() {
    this.router.navigate(['/ticket-check']);
    this.closeMenu();
  }

  goToHelp() {
    this.router.navigate(['/help']);
    this.closeMenu();
  }

  goToLogin() {
    this.router.navigate(['/login']);
    this.closeMenu();
  }

  goToRegister() {
    this.router.navigate(['/register']);
    this.closeMenu();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
    this.closeMenu();
  }
}
