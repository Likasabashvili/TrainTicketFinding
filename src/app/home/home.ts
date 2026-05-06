import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Service } from '../service';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  stations: any[] = [];

  constructor(private service: Service) {}

  ngOnInit() {
    this.fetchStations();
  }

  fetchStations() {
    this.service.getStations().subscribe((data) => {
      console.log(data);
      this.stations = data;
    });
  }
}
