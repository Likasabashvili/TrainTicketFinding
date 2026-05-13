import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { Home } from './home';
import { Service } from '../service';

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;
  let service: { getStations: ReturnType<typeof vi.fn> };
  let router: { navigate: ReturnType<typeof vi.fn> };
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(async () => {
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    service = {
      getStations: vi.fn().mockReturnValue(of([{ id: 1, name: 'თბილისი', stationNumber: 1 }])),
    };
    router = { navigate: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [
        { provide: Service, useValue: service },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  it('should create and load stations', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(service.getStations).toHaveBeenCalled();
    expect(component.stations).toEqual([{ id: 1, name: 'თბილისი', stationNumber: 1 }]);
  });

  it('should show an error when stations fail to load', () => {
    service.getStations.mockReturnValue(throwError(() => new Error('network')));

    fixture.detectChanges();

    expect(component.errorMessage).toContain('ტერმინალების ჩატვირთვაში შეცდომა');
  });

  it('should validate search form fields', () => {
    expect(component.isSearchFormValid()).toBe(false);

    component.fromStation = 'თბილისი';
    component.toStation = 'ბათუმი';
    component.travelDate = '2026-05-13';

    expect(component.isSearchFormValid()).toBe(true);

    component.toStation = 'თბილისი';

    expect(component.isSearchFormValid()).toBe(false);
  });

  it('should navigate to trains with state and query params', () => {
    component.fromStation = 'თბილისი';
    component.toStation = 'ბათუმი';
    component.travelDate = '2026-05-13';
    component.numberOfPassengers = 2;

    component.searchTrains();

    const searchParams = {
      from: 'თბილისი',
      to: 'ბათუმი',
      date: '2026-05-13',
      passengers: 2,
    };
    expect(router.navigate).toHaveBeenCalledWith(['/trains'], {
      state: searchParams,
      queryParams: searchParams,
    });
  });

  it('should not navigate with an invalid form', () => {
    component.searchTrains();

    expect(router.navigate).not.toHaveBeenCalled();
    expect(component.errorMessage).toContain('გთხოვთ შეავსოთ ყველა ველი');
  });
});
