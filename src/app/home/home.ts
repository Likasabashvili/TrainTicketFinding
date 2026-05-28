import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Service } from '../service';
import { Station, SearchParams } from '../models/interfaces';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home implements OnInit {
  stations: Station[] = [];

  fromStation = '';
  toStation = '';
  travelDate = '';
  numberOfPassengers = 1;

  isLoading = false;
  errorMessage = '';

  constructor(
    private service: Service,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.fetchStations();
  }

  fetchStations() {
    this.service.getStations().subscribe({
      next: (data) => {
        this.stations = data;
      },

      error: () => {
        this.errorMessage = 'ტერმინალების ჩატვირთვაში შეცდომა';
      },
    });
  }

  isSearchFormValid(): boolean {
    return !!(
      this.fromStation &&
      this.toStation &&
      this.travelDate &&
      this.fromStation !== this.toStation &&
      !this.isPastDate(this.travelDate)
    );
  }

  searchTrains() {
    this.errorMessage = '';

    if (!this.fromStation || !this.toStation || !this.travelDate) {
      this.errorMessage = 'გთხოვთ შეავსოთ ყველა ველი';
      return;
    }

    if (this.fromStation === this.toStation) {
      this.errorMessage = 'საწყისი და დანიშნულების სადგური განსხვავებული უნდა იყოს';
      return;
    }

    if (this.isPastDate(this.travelDate)) {
      this.errorMessage = 'წარსულ თარიღზე ბილეთის დაჯავშნა შეუძლებელია';
      return;
    }

    if (!this.isSearchFormValid()) {
      this.errorMessage = 'გთხოვთ შეავსოთ ყველა ველი';
      return;
    }

    const searchParams: SearchParams = {
      from: this.fromStation,
      to: this.toStation,
      date: this.travelDate,
      passengers: this.numberOfPassengers,
    };

    this.router.navigate(['/trains'], {
      state: searchParams,
      queryParams: searchParams,
    });
  }

  openTicketCheck() {
    this.router.navigate(['/ticket-check']);
  }

  getToday(): string {
    return new Date().toISOString().split('T')[0];
  }

  private isPastDate(date: string): boolean {
    return date < this.getToday();
  }
}
