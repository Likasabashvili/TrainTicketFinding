import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';
import { Service } from '../service';
import { Departure, Train, SearchParams } from '../models/interfaces';

@Component({
  selector: 'app-train-routes',
  imports: [CommonModule, RouterModule],
  templateUrl: './train-routes.html',
  styleUrl: './train-routes.css',
})
export class TrainRoutesComponent implements OnInit {
  departures: Departure[] = [];
  selectedDeparture: Departure | null = null;
  selectedTrain: Train | null = null;
  searchParams: SearchParams | null = null;
  isLoading = false;
  errorMessage = '';

  constructor(
    private service: Service,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.searchParams = this.getSearchParams();
  }

  ngOnInit() {
    if (this.searchParams) {
      this.searchTrains();
    }
  }

  searchTrains() {
    if (!this.searchParams) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.service
      .searchDepartures(this.searchParams.from, this.searchParams.to, this.searchParams.date)
      .subscribe(
        (data) => {
          this.departures = Array.isArray(data) ? data : [];
          this.isLoading = false;
        },
        (error) => {
          this.errorMessage = 'ძებნის დაშეცდომა. გთხოვთ კვლავ სცადოთ.';
          console.error('Search error:', error);
          this.isLoading = false;
        },
      );
  }

  private getSearchParams(): SearchParams | null {
    const navigationState = this.router.getCurrentNavigation()?.extras?.state;
    const historyState = history.state;
    const queryParams = this.route.snapshot.queryParamMap;

    const stateParams = this.toSearchParams(navigationState) ?? this.toSearchParams(historyState);
    if (stateParams) {
      return stateParams;
    }

    const from = queryParams.get('from');
    const to = queryParams.get('to');
    const date = queryParams.get('date');
    const passengers = Number(queryParams.get('passengers') ?? 1);

    if (!from || !to || !date) {
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

  selectTrain(train: Train) {
    this.selectedTrain = train;
  }

  bookTicket(train: Train) {
    if (!this.searchParams) return;

    // Navigate to passenger info page with selected train data
    this.router.navigate(['/passenger-info'], {
      state: {
        searchParams: this.searchParams,
        selectedTrain: train,
        selectedDeparture: this.departures[0], // Use first departure as reference
      },
    });
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
