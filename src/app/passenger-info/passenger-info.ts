import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Departure, PassengerData, SearchParams, Seat, Train, Vagon } from '../models/interfaces';

@Component({
  selector: 'app-passenger-info',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './passenger-info.html',
  styleUrls: ['./passenger-info.css'],
})
export class PassengerInfoComponent implements OnInit {
  searchParams: SearchParams | null = null;
  selectedTrain: Train | null = null;
  selectedDeparture: Departure | null = null;
  passengers: PassengerData[] = [];
  numberOfPassengers = 1;
  email = '';
  phoneNumber = '';
  selectedVagon: Vagon | null = null;
  selectedSeat: Seat | null = null;
  showSeatModal = false;
  currentPassengerIndex = -1;
  totalPrice = 0;
  errorMessage = '';

  constructor(private router: Router) {
    const state = this.router.getCurrentNavigation()?.extras?.state ?? history.state;

    this.searchParams = state.searchParams;

    this.selectedTrain = state.selectedTrain;

    this.selectedDeparture = state.selectedDeparture;

    this.numberOfPassengers = this.searchParams?.passengers || 1;
  }

  ngOnInit(): void {
    this.initializePassengers();
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
    this.numberOfPassengers = Number(count) || 1;
    this.initializePassengers();
    this.calculateTotalPrice();
  }

  openSeatSelection(index: number) {
    this.currentPassengerIndex = index;

    this.selectedVagon = this.selectedTrain?.vagons[0] || null;

    this.showSeatModal = true;
  }

  selectVagon(vagon: Vagon) {
    this.selectedVagon = vagon;
  }

  selectSeat(seat: Seat) {
    if (seat.isOccupied) return;

    const alreadySelected = this.passengers.some(
      (p, index) => p.seatId === seat.seatId && index !== this.currentPassengerIndex,
    );

    if (alreadySelected) {
      this.errorMessage = 'ადგილი უკვე არჩეულია';

      return;
    }

    this.selectedSeat = seat;
  }

  confirmSeatSelection() {
    if (!this.selectedSeat) {
      this.errorMessage = 'გთხოვთ აირჩიოთ ადგილი';
      return;
    }

    this.passengers[this.currentPassengerIndex].seatId = this.selectedSeat.seatId;

    this.passengers[this.currentPassengerIndex].seatNumber = this.selectedSeat.number;

    this.calculateTotal();

    this.closeModal();
  }

  closeSeatModal() {
    this.closeModal();
  }

  closeModal() {
    this.showSeatModal = false;

    this.selectedSeat = null;
  }

  calculateTotal() {
    this.totalPrice = 0;

    this.passengers.forEach((p) => {
      this.selectedTrain?.vagons.forEach((v) => {
        const seat = v.seats.find((s) => s.seatId === p.seatId);

        if (seat) {
          this.totalPrice += seat.price;
        }
      });
    });
  }

  calculateTotalPrice() {
    this.calculateTotal();
  }

  calculateSeatPrice(seatId: string): number {
    for (const vagon of this.selectedTrain?.vagons || []) {
      const seat = vagon.seats.find((s) => s.seatId === seatId);

      if (seat) {
        return seat.price;
      }
    }

    return 0;
  }

  isFormValid() {
    return !!(
      this.email &&
      this.phoneNumber &&
      this.passengers.every((p) => p.name && p.surname && p.idNumber && p.seatId)
    );
  }

  proceedToPayment() {
    if (!this.isFormValid()) {
      this.errorMessage = 'შეავსეთ ყველა ველი';

      return;
    }

    this.router.navigate(['/payment'], {
      state: {
        searchParams: this.searchParams,
        selectedTrain: this.selectedTrain,
        selectedDeparture: this.selectedDeparture,
        passengers: this.passengers,
        totalPrice: this.totalPrice,
        email: this.email,
        phoneNumber: this.phoneNumber,
      },
    });
  }

  goBack() {
    this.router.navigate(['/trains']);
  }
}
