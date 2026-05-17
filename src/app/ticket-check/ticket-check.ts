import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Service } from '../service';
import { Ticket } from '../models/interfaces';

@Component({
  selector: 'app-ticket-check',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ticket-check.html',
  styleUrls: ['./ticket-check.css'],
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

  // checkTicket() {
  //   if (!this.ticketId.trim()) {
  //     this.errorMessage = 'გთხოვთ შეიყვანოთ ბილეთის ID';

  //     return;
  //   }

  //   this.isLoading = true;

  //   this.errorMessage = '';

  //   this.service.checkTicketStatus(this.ticketId).subscribe({
  //     next: (response) => {
  //       this.ticket = response;

  //       this.isLoading = false;
  //     },

  //     error: () => {
  //       this.errorMessage = 'ბილეთი არ მოიძებნა. გთხოვთ შეამოწმეთ ბილეთის ID.';

  //       this.isLoading = false;
  //     },
  //   });
  // }
  checkTicket() {
    if (!this.ticketId.trim()) {
      this.errorMessage = 'გთხოვთ შეიყვანოთ ბილეთის ID';
      return;
    }

    this.isLoading = true;

    this.errorMessage = '';

    this.successMessage = '';

    this.service.checkTicketStatus(this.ticketId).subscribe({
      next: (response: any) => {
        console.log(response);

        // თუ backend string აბრუნებს
        if (typeof response === 'string') {
          try {
            this.ticket = JSON.parse(response);
          } catch {
            this.errorMessage = response;
          }
        } else {
          this.ticket = response;
        }

        this.isLoading = false;
      },

      error: (err) => {
        console.log(err);

        if (typeof err.error === 'string') {
          this.errorMessage = err.error;
        } else {
          this.errorMessage = 'ბილეთი არ მოიძებნა';
        }

        this.isLoading = false;
      },
    });
  }

  cancelTicket() {
    if (!this.ticket) return;

    const confirmed = confirm('დანამდვილებით გსურთ ბილეთის გაუქმება?');

    if (!confirmed) return;

    this.service.cancelTicket(this.ticket.id).subscribe({
      next: (response) => {
        this.ticket = response;

        this.successMessage = 'ბილეთი წარმატებით გაუქმდა';
      },

      error: () => {
        this.errorMessage = 'გაუქმება ვერ შესრულდა';
      },
    });
  }

  goHome() {
    this.router.navigate(['/']);
  }

  newSearch() {
    this.ticket = null;

    this.ticketId = '';

    this.errorMessage = '';

    this.successMessage = '';
  }
}
