// import { Component, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { Router } from '@angular/router';
// import { Service } from '../service';

// import {
//   Departure,
//   PassengerData,
//   RegisterTicketConfig,
//   PersonDto,
//   SearchParams,
//   Ticket,
//   Train,
// } from '../models/interfaces';

// @Component({
//   selector: 'app-payment',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './payment.html',
//   styleUrls: ['./payment.css'],
// })
// export class PaymentComponent {
//   @ViewChild('ticketPdf')
//   ticketPdf!: ElementRef;

//   searchParams: SearchParams | null = null;

//   selectedTrain: Train | null = null;

//   selectedDeparture: Departure | null = null;

//   passengers: PassengerData[] = [];

//   totalPrice = 0;

//   email = '';
//   phoneNumber = '';

//   cardName = '';
//   cardNumber = '';
//   expiryDate = '';
//   cvv = '';

//   paymentSuccess = false;

//   isProcessing = false;

//   errorMessage = '';

//   ticket: Ticket | null = null;

//   constructor(
//     private service: Service,
//     private router: Router,
//     private cdr: ChangeDetectorRef,
//   ) {
//     const state = this.router.getCurrentNavigation()?.extras?.state ?? history.state;

//     this.searchParams = state.searchParams;

//     this.selectedTrain = state.selectedTrain;

//     this.selectedDeparture = state.selectedDeparture;

//     this.passengers = state.passengers || [];

//     this.totalPrice = state.totalPrice || 0;

//     this.email = state.email || '';

//     this.phoneNumber = state.phoneNumber || '';
//   }

//   isPaymentFormValid() {
//     return !!(
//       this.cardName &&
//       /^\d{16}$/.test(this.cardNumber) &&
//       /^\d{2}\/\d{2}$/.test(this.expiryDate) &&
//       /^\d{3}$/.test(this.cvv)
//     );
//   }

//   processPayment() {
//     if (!this.isPaymentFormValid()) {
//       this.errorMessage = 'გთხოვთ შეავსოთ საკრედიტო ბარათის ყველა აუცილებელი ველი';

//       return;
//     }

//     if (!this.selectedTrain) return;

//     this.isProcessing = true;

//     const people: PersonDto[] = this.passengers.map((p) => ({
//       seatId: p.seatId,
//       name: p.name,
//       surname: p.surname,
//       idNumber: p.idNumber,
//       status: 'confirmed',
//       payoutCompleted: true,
//     }));

//     const config: RegisterTicketConfig = {
//       trainId: this.selectedTrain.id,

//       date: new Date(this.searchParams?.date || ''),

//       email: this.email,

//       phoneNumber: this.phoneNumber,

//       people,
//     };

//     this.service.registerTicket(config).subscribe({
//       next: (response) => {
//         console.log('=== SUCCESS RESPONSE ===');
//         console.log('Full response:', response);
//         console.log('Response type:', typeof response);
//         console.log('Response keys:', Object.keys(response || {}));

//         // Handle the response - it might be the ticket object directly or wrapped
//         if (response && typeof response === 'object') {
//           this.ticket = response as Ticket;
//           console.log('Ticket ID from response:', this.ticket?.id);
//           console.log('Ticket structure:', this.ticket);
//         } else {
//           console.log('Response is not an object:', response);
//           this.ticket = { id: 'Unknown' } as any;
//         }

//         this.paymentSuccess = true;
//         this.isProcessing = false;
//         this.cdr.markForCheck();

//         if (this.ticket?.id) {
//           console.log('Confirming ticket with ID:', this.ticket.id);
//           this.service.confirmTicket(this.ticket.id).subscribe({
//             next: (confirmResponse) => {
//               console.log('Ticket confirmed:', confirmResponse);
//             },
//             error: (confirmError) => {
//               console.error('Error confirming ticket:', confirmError);
//             },
//           });
//         }
//       },

//       error: (error) => {
//         console.error('Payment error:', error);
//         console.log('Setting isProcessing to false');
//         this.isProcessing = false;

//         // Handle parsing errors with 200 status (server returned 200 but response body was malformed/empty)
//         // This is actually a success - the ticket was registered, just the response wasn't JSON
//         if (error.status === 200 && error.statusText === 'OK') {
//           console.log('Received 200 status with parsing error - treating as success');
//           console.log('Error details:', error);
//           console.log('Error body:', error.error);

//           this.paymentSuccess = true;

//           // Try to extract ticket ID from error message if it contains it
//           if (error.error && typeof error.error === 'string') {
//             const ticketIdMatch = error.error.match(/ticket[:\s]+([a-f0-9\-]+)/i);
//             const id = ticketIdMatch ? ticketIdMatch[1] : 'Ticket registered successfully';
//             console.log('Extracted ticket ID:', id);
//             this.ticket = { id } as any;
//           } else {
//             this.ticket = { id: 'Ticket registered successfully' } as any;
//           }

//           this.cdr.markForCheck();
//           return;
//         }

//         // Check if error is about occupied seat
//         if (error.error && typeof error.error === 'string' && error.error.includes('occupied')) {
//           this.errorMessage =
//             'არჩეული ადგილი უკვე დაჯავშნულია. გთხოვთ უკან დაბრუნდეთ და სხვა ადგილი აირჩიოთ.';
//           console.log('Occupied seat error detected');
//         } else if (error.error && error.error.message) {
//           this.errorMessage = error.error.message;
//         } else if (error.message) {
//           this.errorMessage = error.message;
//         } else {
//           this.errorMessage = 'გადახდის დროს შეცდომა. გთხოვთ კვლავ სცადოთ.';
//         }

//         console.log('Error message set to:', this.errorMessage);
//         console.log(
//           'Current state - isProcessing:',
//           this.isProcessing,
//           'errorMessage:',
//           !!this.errorMessage,
//         );

//         // Force change detection to update the UI immediately
//         this.cdr.markForCheck();
//         console.log('Change detection triggered');
//       },
//     });
//   }

//   downloadTicketPDF() {
//     if (!this.ticket) return;

//     const ticketHtml = this.ticketPdf?.nativeElement?.innerHTML || `Ticket ID: ${this.ticket.id}`;
//     const blob = new Blob([ticketHtml], { type: 'text/html;charset=utf-8' });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement('a');

//     link.href = url;
//     link.download = `ticket-${this.ticket.id}.html`;
//     link.click();
//     URL.revokeObjectURL(url);
//   }

//   printTicket() {
//     window.print();
//   }

//   copyTicketId() {
//     if (this.ticket?.id) {
//       navigator.clipboard.writeText(this.ticket.id).then(() => {
//         console.log('Ticket ID copied to clipboard:', this.ticket?.id);
//       });
//     }
//   }

//   goHome() {
//     this.router.navigate(['/']);
//   }

//   goBack() {
//     this.router.navigate(['/passenger-info']);
//   }
// }
// import { Component, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';

// import { CommonModule } from '@angular/common';

// import { FormsModule } from '@angular/forms';

// import { Router } from '@angular/router';

// import { Service } from '../service';

// import {
//   Departure,
//   PassengerData,
//   RegisterTicketConfig,
//   PersonDto,
//   SearchParams,
//   Ticket,
//   Train,
// } from '../models/interfaces';

// @Component({
//   selector: 'app-payment',

//   standalone: true,

//   imports: [CommonModule, FormsModule],

//   templateUrl: './payment.html',

//   styleUrls: ['./payment.css'],
// })
// export class PaymentComponent {
//   @ViewChild('ticketPdf')
//   ticketPdf!: ElementRef;

//   searchParams: SearchParams | null = null;

//   selectedTrain: Train | null = null;

//   selectedDeparture: Departure | null = null;

//   passengers: PassengerData[] = [];

//   totalPrice = 0;

//   email = '';
//   phoneNumber = '';

//   cardName = '';
//   cardNumber = '';
//   expiryDate = '';
//   cvv = '';

//   paymentSuccess = false;

//   isProcessing = false;

//   errorMessage = '';

//   ticket: Ticket | null = null;

//   constructor(
//     private service: Service,
//     private router: Router,
//     private cdr: ChangeDetectorRef,
//   ) {
//     const state = this.router.getCurrentNavigation()?.extras?.state ?? history.state;

//     this.searchParams = state.searchParams;

//     this.selectedTrain = state.selectedTrain;

//     this.selectedDeparture = state.selectedDeparture;

//     this.passengers = state.passengers || [];

//     this.totalPrice = state.totalPrice || 0;

//     this.email = state.email || '';

//     this.phoneNumber = state.phoneNumber || '';
//   }

//   isPaymentFormValid() {
//     return !!(
//       this.cardName &&
//       /^\d{16}$/.test(this.cardNumber) &&
//       /^\d{2}\/\d{2}$/.test(this.expiryDate) &&
//       /^\d{3}$/.test(this.cvv)
//     );
//   }

//   processPayment() {
//     if (!this.isPaymentFormValid()) {
//       this.errorMessage = 'გთხოვთ შეავსოთ საკრედიტო ბარათის ყველა აუცილებელი ველი';

//       return;
//     }

//     if (!this.selectedTrain) return;

//     this.isProcessing = true;

//     this.errorMessage = '';

//     const people: PersonDto[] = this.passengers.map((p) => ({
//       seatId: p.seatId,
//       name: p.name,
//       surname: p.surname,
//       idNumber: p.idNumber,
//       status: 'confirmed',
//       payoutCompleted: true,
//     }));

//     const config: RegisterTicketConfig = {
//       trainId: this.selectedTrain.id,

//       date: new Date(this.searchParams?.date || ''),

//       email: this.email,

//       phoneNumber: this.phoneNumber,

//       people,
//     };

//     this.service.registerTicket(config).subscribe({
//       next: (response: any) => {
//         console.log('SUCCESS RESPONSE:', response);

//         let ticketId = 'Unknown';

//         // თუ backend აბრუნებს სრულ ticket object-ს
//         if (response && typeof response === 'object') {
//           ticketId = response.id || 'Unknown';
//         }

//         // თუ backend აბრუნებს string-ს
//         if (typeof response === 'string') {
//           const match = response.match(/([a-f0-9\-]{6,})/i);

//           ticketId = match ? match[1] : response;
//         }

//         // ticket object-ის შექმნა frontend-ში
//         this.ticket = {
//           id: ticketId,

//           train: this.selectedTrain,

//           ticketPrice: this.totalPrice,

//           persons: this.passengers.map((p: any) => ({
//             name: p.name,

//             surname: p.surname,

//             seat: {
//               number: p.seatNumber || p.seatId,
//             },
//           })),
//         } as any;

//         this.paymentSuccess = true;

//         this.isProcessing = false;

//         this.cdr.markForCheck();

//         // ticket confirm
//         if (ticketId && ticketId !== 'Unknown') {
//           this.service.confirmTicket(ticketId).subscribe({
//             next: (confirmResponse) => {
//               console.log('Ticket confirmed:', confirmResponse);
//             },

//             error: (confirmError) => {
//               console.error('Confirm error:', confirmError);
//             },
//           });
//         }
//       },

//       error: (error) => {
//         console.error('PAYMENT ERROR:', error);

//         this.isProcessing = false;

//         // Angular parse error მაგრამ რეალურად 200 OK
//         if (error.status === 200 && error.statusText === 'OK') {
//           console.log('200 OK parse error -> success');

//           let ticketId = 'Unknown';

//           if (error.error && typeof error.error === 'string') {
//             const match = error.error.match(/([a-f0-9\-]{6,})/i);

//             ticketId = match ? match[1] : 'Ticket registered successfully';
//           }

//           this.ticket = {
//             id: ticketId,

//             train: this.selectedTrain,

//             ticketPrice: this.totalPrice,

//             persons: this.passengers.map((p: any) => ({
//               name: p.name,

//               surname: p.surname,

//               seat: {
//                 number: p.seatNumber || p.seatId,
//               },
//             })),
//           } as any;

//           this.paymentSuccess = true;

//           this.cdr.markForCheck();

//           return;
//         }

//         // occupied ადგილი
//         if (error.error && typeof error.error === 'string' && error.error.includes('occupied')) {
//           this.errorMessage = 'არჩეული ადგილი უკვე დაჯავშნულია. გთხოვთ აირჩიოთ სხვა ადგილი.';
//         } else if (error.error?.message) {
//           this.errorMessage = error.error.message;
//         } else if (error.message) {
//           this.errorMessage = error.message;
//         } else {
//           this.errorMessage = 'გადახდის დროს დაფიქსირდა შეცდომა. სცადეთ თავიდან.';
//         }

//         this.cdr.markForCheck();
//       },
//     });
//   }

//   downloadTicketPDF() {
//     if (!this.ticket) return;

//     const ticketHtml = this.ticketPdf?.nativeElement?.innerHTML || `Ticket ID: ${this.ticket.id}`;

//     const blob = new Blob([ticketHtml], {
//       type: 'text/html;charset=utf-8',
//     });

//     const url = URL.createObjectURL(blob);

//     const link = document.createElement('a');

//     link.href = url;

//     link.download = `ticket-${this.ticket.id}.html`;

//     link.click();

//     URL.revokeObjectURL(url);
//   }

//   printTicket() {
//     window.print();
//   }

//   copyTicketId() {
//     if (this.ticket?.id) {
//       navigator.clipboard.writeText(this.ticket.id).then(() => {
//         console.log('Copied:', this.ticket?.id);
//       });
//     }
//   }

//   goHome() {
//     this.router.navigate(['/']);
//   }

//   goBack() {
//     this.router.navigate(['/passenger-info']);
//   }
// }
import { Component, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { Router } from '@angular/router';

import { Service } from '../service';

import {
  Departure,
  PassengerData,
  RegisterTicketConfig,
  PersonDto,
  SearchParams,
  Ticket,
  Train,
} from '../models/interfaces';

@Component({
  selector: 'app-payment',

  standalone: true,

  imports: [CommonModule, FormsModule],

  templateUrl: './payment.html',

  styleUrls: ['./payment.css'],
})
export class PaymentComponent {
  @ViewChild('ticketPdf')
  ticketPdf!: ElementRef;

  searchParams: SearchParams | null = null;

  selectedTrain: Train | null = null;

  selectedDeparture: Departure | null = null;

  passengers: PassengerData[] = [];

  totalPrice = 0;

  email = '';

  phoneNumber = '';

  cardName = '';

  cardNumber = '';

  expiryDate = '';

  cvv = '';

  paymentSuccess = false;

  isProcessing = false;

  errorMessage = '';

  ticket: Ticket | null = null;

  constructor(
    private service: Service,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {
    const state = this.router.getCurrentNavigation()?.extras?.state ?? history.state;

    this.searchParams = state.searchParams;

    this.selectedTrain = state.selectedTrain;

    this.selectedDeparture = state.selectedDeparture;

    this.passengers = state.passengers || [];

    this.totalPrice = state.totalPrice || 0;

    this.email = state.email || '';

    this.phoneNumber = state.phoneNumber || '';
  }

  isPaymentFormValid() {
    return !!(
      this.cardName &&
      /^\d{16}$/.test(this.cardNumber) &&
      /^\d{2}\/\d{2}$/.test(this.expiryDate) &&
      /^\d{3}$/.test(this.cvv)
    );
  }

  onCardNumberChange(value: string): void {
    this.cardNumber = value.replace(/\D/g, '').slice(0, 16);
  }

  processPayment() {
    if (!this.isPaymentFormValid()) {
      this.errorMessage = 'გთხოვთ შეავსოთ საკრედიტო ბარათის ყველა აუცილებელი ველი';

      return;
    }

    if (!this.selectedTrain) return;

    this.isProcessing = true;

    this.errorMessage = '';

    const people: PersonDto[] = this.passengers.map((p) => ({
      seatId: p.seatId,
      name: p.name,
      surname: p.surname,
      idNumber: p.idNumber,
      status: 'confirmed',
      payoutCompleted: true,
    }));

    const config: RegisterTicketConfig = {
      trainId: this.selectedTrain.id,

      date: new Date(this.searchParams?.date || ''),

      email: this.email,

      phoneNumber: this.phoneNumber,

      people,
    };

    this.service.registerTicket(config).subscribe({
      next: (response: string) => {
        console.log('SUCCESS RESPONSE:', response);

        const match = response.match(
          /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i,
        );

        const ticketId = match ? match[0] : '';

        if (!ticketId) {
          this.errorMessage = 'ბილეთის ID ვერ მოიძებნა';

          this.isProcessing = false;

          return;
        }

        this.ticket = {
          id: ticketId,

          train: this.selectedTrain,

          ticketPrice: this.totalPrice,

          persons: this.passengers.map((p: any) => ({
            name: p.name,

            surname: p.surname,

            seat: {
              number: p.seatNumber || p.seatId,
            },
          })),
        } as any;

        this.paymentSuccess = true;

        this.isProcessing = false;

        this.cdr.markForCheck();

        if (ticketId !== 'Unknown') {
          this.service.confirmTicket(ticketId).subscribe({
            next: (confirmResponse) => {
              console.log('Ticket confirmed:', confirmResponse);
            },

            error: (confirmError) => {
              console.error('Confirm error:', confirmError);
            },
          });
        }
      },

      error: (error) => {
        console.error('PAYMENT ERROR:', error);

        this.isProcessing = false;

        if (error.error && typeof error.error === 'string' && error.error.includes('occupied')) {
          this.errorMessage = 'არჩეული ადგილი უკვე დაჯავშნულია. გთხოვთ აირჩიოთ სხვა ადგილი.';
        } else if (error.error?.message) {
          this.errorMessage = error.error.message;
        } else if (error.message) {
          this.errorMessage = error.message;
        } else {
          this.errorMessage = 'გადახდის დროს დაფიქსირდა შეცდომა. სცადეთ თავიდან.';
        }

        this.cdr.markForCheck();
      },
    });
  }

  downloadTicketPDF() {
    if (!this.ticket) return;

    const ticketHtml = this.ticketPdf?.nativeElement?.innerHTML || `Ticket ID: ${this.ticket.id}`;

    const blob = new Blob([ticketHtml], {
      type: 'text/html;charset=utf-8',
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');

    link.href = url;

    link.download = `ticket-${this.ticket.id}.html`;

    link.click();

    URL.revokeObjectURL(url);
  }

  printTicket() {
    window.print();
  }

  copyTicketId() {
    if (this.ticket?.id) {
      navigator.clipboard.writeText(this.ticket.id).then(() => {
        console.log('Copied:', this.ticket?.id);
      });
    }
  }

  goHome() {
    this.router.navigate(['/']);
  }

  goBack() {
    this.router.navigate(['/passenger-info']);
  }
}
