import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { Service } from './service';
import { RegisterTicketConfig } from './models/interfaces';

describe('Service', () => {
  let service: Service;
  let http: HttpTestingController;
  const apiUrl = 'https://railway.stepprojects.ge/api';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Service, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(Service);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load stations', () => {
    service.getStations().subscribe((stations) => {
      expect(stations).toEqual([{ id: 1, name: 'თბილისი', stationNumber: 1 }]);
    });

    const req = http.expectOne(`${apiUrl}/stations`);
    expect(req.request.method).toBe('GET');
    req.flush([{ id: 1, name: 'თბილისი', stationNumber: 1 }]);
  });

  it('should search departures with query params', () => {
    service.searchDepartures('თბილისი', 'ბათუმი', '2026-05-13').subscribe((departures) => {
      expect(departures).toEqual([]);
    });

    const req = http.expectOne((request) => request.url === `${apiUrl}/getdeparture`);
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('from')).toBe('თბილისი');
    expect(req.request.params.get('to')).toBe('ბათუმი');
    expect(req.request.params.get('date')).toBe('2026-05-13');
    req.flush([]);
  });

  it('should call read-only train and departure endpoints', () => {
    service.getTrains().subscribe();
    let req = http.expectOne(`${apiUrl}/trains`);
    expect(req.request.method).toBe('GET');
    req.flush([]);

    service.getTrainById(7).subscribe();
    req = http.expectOne(`${apiUrl}/trains/7`);
    expect(req.request.method).toBe('GET');
    req.flush({ id: 7 });

    service.getVagons().subscribe();
    req = http.expectOne(`${apiUrl}/vagons`);
    expect(req.request.method).toBe('GET');
    req.flush([]);

    service.getVagonById(19).subscribe();
    req = http.expectOne(`${apiUrl}/getvagon/19`);
    expect(req.request.method).toBe('GET');
    req.flush({ id: 19 });

    service.getDepartures().subscribe();
    req = http.expectOne(`${apiUrl}/departures`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should register, confirm, cancel, and check tickets through the API', () => {
    const config: RegisterTicketConfig = {
      trainId: 7,
      date: new Date('2026-05-13'),
      email: 'test@example.com',
      phoneNumber: '+995555000000',
      people: [],
    };

    service.registerTicket(config).subscribe();
    let req = http.expectOne(`${apiUrl}/tickets/register`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(config);
    req.flush({ id: 'T-1' });

    service.checkTicketStatus('T-1').subscribe();
    req = http.expectOne(`${apiUrl}/tickets/checkstatus/T-1`);
    expect(req.request.method).toBe('GET');
    req.flush({ id: 'T-1' });

    service.confirmTicket('T-1').subscribe();
    req = http.expectOne(`${apiUrl}/tickets/confirm/T-1`);
    expect(req.request.method).toBe('GET');
    req.flush({ id: 'T-1' });

    service.cancelTicket('T-1').subscribe();
    req = http.expectOne(`${apiUrl}/tickets/cancel/T-1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({ id: 'T-1' });
  });

  it('should call remaining ticket and seat endpoints', () => {
    service.getTickets().subscribe();
    let req = http.expectOne(`${apiUrl}/tickets`);
    expect(req.request.method).toBe('GET');
    req.flush([]);

    service.cancelAllTickets().subscribe();
    req = http.expectOne(`${apiUrl}/tickets/cancelAll`);
    expect(req.request.method).toBe('DELETE');
    req.flush({ seatId: 'seat-1' });

    service.getSeat('seat-1').subscribe();
    req = http.expectOne(`${apiUrl}/seat/seat-1`);
    expect(req.request.method).toBe('GET');
    req.flush({ seatId: 'seat-1' });
  });
});
