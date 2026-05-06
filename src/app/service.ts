import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Service {
  private apiUrl = 'https://railway.stepprojects.ge/api/stations';

  constructor(private http: HttpClient) {}

  getStations(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
