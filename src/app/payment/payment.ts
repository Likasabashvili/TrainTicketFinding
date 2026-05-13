import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Service } from '../service';
import {
  Train,
  SearchParams,
  PassengerData,
  Departure,
  RegisterTicketConfig,
  PersonDto,
  Ticket,
} from '../models/interfaces';

@Component({
  selector: 'app-payment',
  imports: [CommonModule, FormsModule],
  templateUrl: './payment.html',
  styleUrl: './payment.css',
})
export class PaymentComponent implements OnInit {
  searchParams: SearchParams | null = null;
  selectedTrain: Train | null = null;
  selectedDeparture: Departure | null = null;
  email = '';
  phoneNumber = '';
  passengers: PassengerData[] = [];
  totalPrice = 0;

  // Payment form
  cardName = '';
  cardNumber = '';
  expiryDate = '';
  cvv = '';

  isProcessing = false;
  errorMessage = '';
  ticket: Ticket | null = null;
  paymentSuccess = false;

  constructor(
    private service: Service,
    private router: Router,
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.searchParams = navigation.extras.state['searchParams'];
      this.selectedTrain = navigation.extras.state['selectedTrain'];
      this.selectedDeparture = navigation.extras.state['selectedDeparture'];
      this.email = navigation.extras.state['email'];
      this.phoneNumber = navigation.extras.state['phoneNumber'];
      this.passengers = navigation.extras.state['passengers'];
      this.totalPrice = navigation.extras.state['totalPrice'];
    }
  }

  ngOnInit() {}

  isPaymentFormValid(): boolean {
    return !!(
      this.cardName &&
      this.cardNumber &&
      this.expiryDate &&
      this.cvv &&
      this.cardNumber.length === 16
    );
  }

  processPayment() {
    if (!this.isPaymentFormValid()) {
      this.errorMessage = 'გთხოვთ შეავსოთ საკრედიტო ბარათის ყველა აუცილებელი ველი';
      return;
    }

    if (!this.selectedTrain) {
      this.errorMessage = 'მატარებელი არ არის არჩეული';
      return;
    }

    this.isProcessing = true;
    this.errorMessage = '';

    // Create ticket registration config
    const people: PersonDto[] = this.passengers.map((p) => ({
      seatId: p.seatId,
      name: p.name,
      surname: p.surname,
      idNumber: p.idNumber,
      status: 'confirmed',
      payoutCompleted: true,
    }));

    const ticketConfig: RegisterTicketConfig = {
      trainId: this.selectedTrain.id,
      date: new Date(this.searchParams?.date || new Date()),
      email: this.email,
      phoneNumber: this.phoneNumber,
      people: people,
    };

    this.service.registerTicket(ticketConfig).subscribe(
      (response) => {
        this.ticket = response;
        this.paymentSuccess = true;
        this.isProcessing = false;

        // Confirm ticket
        if (this.ticket.id) {
          this.service.confirmTicket(this.ticket.id).subscribe(
            () => {
              // Ticket confirmed successfully
            },
            (error) => {
              console.error('Error confirming ticket:', error);
            },
          );
        }
      },
      (error) => {
        this.errorMessage = 'გადახდის დროს შეცდომა. გთხოვთ კვლავ სცადოთ.';
        console.error('Payment error:', error);
        this.isProcessing = false;
      },
    );
  }

  downloadTicketPDF() {
    if (!this.ticket) return;
    // In a real application, you would generate and download a PDF
    // For now, we'll just log the ticket ID
    console.log('Download PDF for ticket:', this.ticket.id);
    alert('ბილეთი გაიჁოა! ტიკეტის ID: ' + this.ticket.id);
  }

  printTicket() {
    window.print();
  }

  goHome() {
    this.router.navigate(['/']);
  }

  goBack() {
    this.router.navigate(['/passenger-info']);
  }
}
