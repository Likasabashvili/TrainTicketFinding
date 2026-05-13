import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [RouterModule, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class HeaderComponent {
  constructor(private router: Router) {}

  isHomePage(): boolean {
    return this.router.url === '/';
  }

  isTicketCheckPage(): boolean {
    return this.router.url === '/ticket-check';
  }

  goHome() {
    this.router.navigate(['/']);
  }

  goToTicketCheck() {
    this.router.navigate(['/ticket-check']);
  }
}
