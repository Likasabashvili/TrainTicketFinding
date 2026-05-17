import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Service } from './service';
import { Station } from './models/interfaces';

const MOCK_STATIONS: Station[] = [
  { id: 1, name: 'თბილისი', stationNumber: 1 },
  { id: 2, name: 'ბათუმი', stationNumber: 2 },
  { id: 3, name: 'ფოთი', stationNumber: 3 },
];

@Component({
  selector: 'app-test-home',
  imports: [CommonModule, FormsModule],
  template: `
    <div style="padding: 20px; font-family: Arial;">
      <h1>Test: Stations Loading</h1>

      <p><strong>Stations Array Count:</strong> {{ stations.length }}</p>

      <p><strong>Station Names:</strong></p>
      <ul>
        <li *ngFor="let s of stations">{{ s.name }} (id: {{ s.id }})</li>
      </ul>

      <p><strong>Select with Stations:</strong></p>
      <select>
        <option>-- Select --</option>
        <option *ngFor="let station of stations" [value]="station.name">
          {{ station.name }}
        </option>
      </select>

      <p>
        <button (click)="testFetch()">Test Fetch</button>
        <span *ngIf="fetchResult">Result: {{ fetchResult }}</span>
      </p>
    </div>
  `,
})
export class TestHomeComponent implements OnInit {
  stations: Station[] = MOCK_STATIONS;
  fetchResult = '';

  constructor(private service: Service) {}

  ngOnInit() {
    console.log('📍 TestHome initialized with stations:', this.stations);
  }

  testFetch() {
    console.log('🔍 Testing API fetch...');
    this.service.getStations().subscribe(
      (data) => {
        this.fetchResult = `✅ API returned ${Array.isArray(data) ? data.length : 0} stations`;
        console.log('API Success:', data);
      },
      (error) => {
        this.fetchResult = `❌ API Error: ${error.message || 'Unknown error'}`;
        console.error('API Error:', error);
      },
    );
  }
}
