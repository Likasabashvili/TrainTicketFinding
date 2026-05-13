import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Service } from '../service';
import { Station, SearchParams } from '../models/interfaces';

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  stations: Station[] = [];

  // Search form fields
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

  ngOnInit() {
    this.fetchStations();
  }

  fetchStations() {
    this.service.getStations().subscribe(
      (data) => {
        console.log('Stations loaded:', data);
        this.stations = data;
      },
      (error) => {
        this.errorMessage = 'ტერმინალების ჩატვირთვაში შეცდომა';
        console.error('Error fetching stations:', error);
      },
    );
  }

  isSearchFormValid(): boolean {
    return !!(
      this.fromStation &&
      this.toStation &&
      this.travelDate &&
      this.fromStation !== this.toStation
    );
  }

  searchTrains() {
    if (!this.isSearchFormValid()) {
      this.errorMessage = 'გთხოვთ შეავსოთ ყველა ველი და აირჩიოთ სხვადსხვა ტერმინალი';
      return;
    }

    if (this.fromStation === this.toStation) {
      this.errorMessage = 'საწყისი და საბოლოო სადგური ვერ შეიძლება იყოს ერთი და იგივე';
      return;
    }

    this.errorMessage = '';
    this.isLoading = true;

    const searchParams: SearchParams = {
      from: this.fromStation,
      to: this.toStation,
      date: this.travelDate,
      passengers: this.numberOfPassengers,
    };

    // Keep params in both state and URL so the results page still works after refresh.
    this.router.navigate(['/trains'], { state: searchParams, queryParams: searchParams });
  }

  openTicketCheck() {
    this.router.navigate(['/ticket-check']);
  }

  getToday(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }
}
