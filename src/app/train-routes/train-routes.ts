import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { CommonModule } from '@angular/common';

import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { finalize } from 'rxjs';

import { Service } from '../service';

import { Departure, Train, SearchParams } from '../models/interfaces';

@Component({
  selector: 'app-train-routes',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './train-routes.html',
  styleUrls: ['./train-routes.css'],
})
export class TrainRoutesComponent implements OnInit {
  departures: Departure[] = [];

  searchParams: SearchParams | null = null;

  isLoading = false;
  errorMessage = '';

  constructor(
    private service: Service,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
  ) {
    this.searchParams = this.getSearchParams();
  }

  ngOnInit(): void {
    console.log('Train routes ngOnInit, searchParams:', this.searchParams);
    if (this.searchParams) {
      this.searchTrains();
    } else {
      console.log('No searchParams found');
    }
  }

  searchTrains() {
    if (!this.searchParams) return;

    console.log('Starting searchTrains with params:', this.searchParams);

    this.isLoading = true;
    this.errorMessage = '';
    this.departures = [];

    console.log(
      '1. Initial state - isLoading:',
      this.isLoading,
      'departures.length:',
      this.departures.length,
    );

    this.service
      .searchDepartures(this.searchParams.from, this.searchParams.to, this.searchParams.date)
      .pipe(
        finalize(() => {
          console.log('FINALIZE BLOCK - isLoading before:', this.isLoading);
        }),
      )
      .subscribe({
        next: (data) => {
          console.log('2. API Response received:', data);
          console.log('   Response type:', typeof data);
          console.log('   Is array:', Array.isArray(data));

          this.departures = this.normalizeDepartures(data);
          console.log('3. After normalizeDepartures - departures:', this.departures);
          console.log('   departures.length:', this.departures.length);

          this.isLoading = false;
          console.log('4. isLoading set to FALSE');
          console.log(
            '   Current state - isLoading:',
            this.isLoading,
            'departures.length:',
            this.departures.length,
          );

          // Force change detection
          this.cdr.markForCheck();
          console.log('5. Change detection triggered');
        },

        error: (err) => {
          console.error('ERROR in searchTrains:', err);
          this.errorMessage = 'ძებნის შეცდომა. გთხოვთ კვლავ სცადოთ.';
          this.isLoading = false;
          this.cdr.markForCheck();
          console.log('ERROR handler - isLoading set to false, change detection triggered');
        },
      });
  }

  private normalizeDepartures(data: unknown): Departure[] {
    try {
      console.log('=== NORMALIZE DEPARTURES START ===');
      console.log('Raw input:', data);
      console.log('Type:', typeof data);
      console.log('Is array:', Array.isArray(data));

      if (!data) {
        console.log('Result: Data is empty, returning []');
        return [];
      }

      if (Array.isArray(data)) {
        console.log('Result: Data is array with', data.length, 'items');
        if (data.length > 0) {
          console.log('First item structure:', data[0]);
        }
        console.log('=== NORMALIZE DEPARTURES END - returning as-is ===');
        return data as Departure[];
      }

      if (typeof data === 'object') {
        const obj = data as any;
        console.log('Data is object with keys:', Object.keys(obj));

        if (Array.isArray(obj.data)) {
          console.log('Found data property, length:', obj.data.length);
          console.log('=== NORMALIZE DEPARTURES END - returning obj.data ===');
          return obj.data;
        }

        if (Array.isArray(obj.departures)) {
          console.log('Found departures property, length:', obj.departures.length);
          console.log('=== NORMALIZE DEPARTURES END - returning obj.departures ===');
          return obj.departures;
        }

        if (Array.isArray(obj.result)) {
          console.log('Found result property, length:', obj.result.length);
          console.log('=== NORMALIZE DEPARTURES END - returning obj.result ===');
          return obj.result;
        }
      }

      console.log('Result: Could not normalize, returning []');
      console.log('=== NORMALIZE DEPARTURES END - no match ===');
      return [];
    } catch (error) {
      console.error('Error in normalizeDepartures:', error);
      return [];
    }
  }

  private getSearchParams(): SearchParams | null {
    const navigationState = this.router.getCurrentNavigation()?.extras?.state;
    const historyState = history.state;
    const queryParams = this.route.snapshot.queryParamMap;

    console.log('getSearchParams - navigationState:', navigationState);
    console.log('getSearchParams - historyState:', historyState);
    console.log('getSearchParams - queryParams:', queryParams);

    const stateParams = this.toSearchParams(navigationState) ?? this.toSearchParams(historyState);
    if (stateParams) {
      console.log('Found stateParams:', stateParams);
      return stateParams;
    }

    const from = queryParams.get('from');
    const to = queryParams.get('to');
    const date = queryParams.get('date');
    const passengers = Number(queryParams.get('passengers') ?? 1);

    console.log('Query params - from:', from, 'to:', to, 'date:', date, 'passengers:', passengers);

    if (!from || !to || !date) {
      console.log('Missing required query params');
      return null;
    }

    return {
      from,
      to,
      date,
      passengers: Number.isFinite(passengers) && passengers > 0 ? passengers : 1,
    };
  }

  private toSearchParams(value: unknown): SearchParams | null {
    if (!value || typeof value !== 'object') {
      return null;
    }

    const params = value as Partial<SearchParams>;
    if (!params.from || !params.to || !params.date) {
      return null;
    }

    return {
      from: params.from,
      to: params.to,
      date: params.date,
      passengers: Number(params.passengers) || 1,
    };
  }

  bookTicket(train: Train, departure: Departure) {
    this.router.navigate(['/passenger-info'], {
      state: {
        searchParams: this.searchParams,
        selectedTrain: train,
        selectedDeparture: departure,
      },
    });
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
