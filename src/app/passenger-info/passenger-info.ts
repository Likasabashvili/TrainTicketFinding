import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Service } from '../service';
import { Train, Vagon, Seat, SearchParams, PassengerData, Departure } from '../models/interfaces';

@Component({
  selector: 'app-passenger-info',
  imports: [CommonModule, FormsModule],
  templateUrl: './passenger-info.html',
  styleUrl: './passenger-info.css',
})
export class PassengerInfoComponent implements OnInit {
  searchParams: SearchParams | null = null;
  selectedTrain: Train | null = null;
  selectedDeparture: Departure | null = null;

  email = '';
  phoneNumber = '';
  passengers: PassengerData[] = [];
  numberOfPassengers = 1;

  selectedVagon: Vagon | null = null;
  selectedSeat: Seat | null = null;
  showSeatModal = false;
  currentPassengerIndex = -1;

  errorMessage = '';
  isLoading = false;

  totalPrice = 0;

  constructor(
    private service: Service,
    private router: Router,
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.searchParams = navigation.extras.state['searchParams'];
      this.selectedTrain = navigation.extras.state['selectedTrain'];
      this.selectedDeparture = navigation.extras.state['selectedDeparture'];
    }
  }

  ngOnInit() {
    this.initializePassengers();
    this.calculateTotalPrice();
  }

  initializePassengers() {
    this.passengers = [];
    for (let i = 0; i < this.numberOfPassengers; i++) {
      this.passengers.push({
        name: '',
        surname: '',
        idNumber: '',
        seatId: '',
        seatNumber: '',
      });
    }
  }

  updatePassengerCount(count: number | string) {
    this.numberOfPassengers = Number(count);
    this.initializePassengers();
    this.calculateTotalPrice();
  }

  openSeatSelection(passengerIndex: number) {
    if (!this.selectedTrain) return;

    this.currentPassengerIndex = passengerIndex;

    // Load first vagon with seats
    if (this.selectedTrain.vagons && this.selectedTrain.vagons.length > 0) {
      this.selectedVagon = this.selectedTrain.vagons[0];
      this.showSeatModal = true;
      this.selectedSeat = null;
    }
  }

  selectVagon(vagon: Vagon) {
    this.selectedVagon = vagon;
    this.selectedSeat = null;
  }

  selectSeat(seat: Seat) {
    this.selectedSeat = seat;
  }

  confirmSeatSelection() {
    if (!this.selectedSeat) {
      this.errorMessage = 'გთხოვთ აირჩიოთ ადგილი';
      return;
    }

    if (this.currentPassengerIndex >= 0 && this.passengers[this.currentPassengerIndex]) {
      this.passengers[this.currentPassengerIndex].seatId = this.selectedSeat.seatId;
      this.passengers[this.currentPassengerIndex].seatNumber = this.selectedSeat.number;
    }

    this.closeSeatModal();
    this.calculateTotalPrice();
  }

  closeSeatModal() {
    this.showSeatModal = false;
    this.selectedVagon = null;
    this.selectedSeat = null;
    this.currentPassengerIndex = -1;
  }

  calculateTotalPrice() {
    this.totalPrice = 0;
    if (!this.selectedTrain?.vagons) return;

    this.passengers.forEach((passenger) => {
      if (passenger.seatId) {
        // Find seat in vagons
        for (const vagon of this.selectedTrain!.vagons!) {
          const seat = vagon.seats?.find((s) => s.seatId === passenger.seatId);
          if (seat) {
            this.totalPrice += seat.price;
            break;
          }
        }
      }
    });
  }

  isFormValid(): boolean {
    if (!this.email || !this.phoneNumber) {
      return false;
    }

    return this.passengers.every((p) => p.name && p.surname && p.idNumber && p.seatId);
  }

  proceedToPayment() {
    if (!this.isFormValid()) {
      this.errorMessage = 'გთხოვთ შეავსოთ ყველა აუცილებელი ველი';
      return;
    }

    // Navigate to payment page
    this.router.navigate(['/payment'], {
      state: {
        searchParams: this.searchParams,
        selectedTrain: this.selectedTrain,
        selectedDeparture: this.selectedDeparture,
        email: this.email,
        phoneNumber: this.phoneNumber,
        passengers: this.passengers,
        totalPrice: this.totalPrice,
      },
    });
  }

  calculateSeatPrice(seatId: string): number {
    if (!this.selectedTrain?.vagons) return 0;

    for (const vagon of this.selectedTrain.vagons) {
      const seat = vagon.seats?.find((s) => s.seatId === seatId);
      if (seat) {
        return seat.price;
      }
    }
    return 0;
  }

  goBack() {
    this.router.navigate(['/trains']);
  }
}
