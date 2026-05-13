import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Service } from '../service';
import { Ticket } from '../models/interfaces';

@Component({
  selector: 'app-ticket-check',
  imports: [CommonModule, FormsModule],
  templateUrl: './ticket-check.html',
  styleUrl: './ticket-check.css',
})
export class TicketCheckComponent {
  ticketId = '';
  ticket: Ticket | null = null;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private service: Service,
    private router: Router,
  ) {}

  checkTicket() {
    if (!this.ticketId.trim()) {
      this.errorMessage = 'გთხოვთ შეიყვანოთ ბილეთის ID';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.ticket = null;

    this.service.checkTicketStatus(this.ticketId).subscribe(
      (data) => {
        this.ticket = data;
        this.isLoading = false;
      },
      (error) => {
        this.errorMessage = 'ბილეთი არ მოიძებნა. გთხოვთ შეამოწმეთ ბილეთის ID.';
        console.error('Error checking ticket:', error);
        this.isLoading = false;
      },
    );
  }

  cancelTicket() {
    if (!this.ticket) return;

    const confirmed = confirm('დანამდვილებით გსურთ ბილეთის გაუქმება? აღმოჩნდება გადახდილი თანხა.');

    if (!confirmed) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.service.cancelTicket(this.ticket.id).subscribe(
      (data) => {
        this.ticket = data;
        this.successMessage = 'ბილეთი წარმატებით გაუქმდა';
        this.isLoading = false;
      },
      (error) => {
        this.errorMessage = 'ბილეთის გაუქმებაში შეცდომა. გთხოვთ კვლავ სცადოთ.';
        console.error('Error canceling ticket:', error);
        this.isLoading = false;
      },
    );
  }

  goHome() {
    this.router.navigate(['/']);
  }

  newSearch() {
    this.ticketId = '';
    this.ticket = null;
    this.errorMessage = '';
    this.successMessage = '';
  }
}
