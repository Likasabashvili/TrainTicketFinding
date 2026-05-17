import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { convertToParamMap } from '@angular/router';
import { of, throwError } from 'rxjs';

import { TrainRoutesComponent } from './train-routes';
import { Service } from '../service';
import { Departure } from '../models/interfaces';

describe('TrainRoutesComponent', () => {
  let component: TrainRoutesComponent;
  let fixture: ComponentFixture<TrainRoutesComponent>;
  let service: { searchDepartures: ReturnType<typeof vi.fn> };
  let router: { getCurrentNavigation: ReturnType<typeof vi.fn>; navigate: ReturnType<typeof vi.fn> };
  let activatedRoute: { snapshot: { queryParamMap: ReturnType<typeof convertToParamMap> } };
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  const departures: Departure[] = [
    {
      id: 3,
      source: 'თბილისი',
      destination: 'ბათუმი',
      date: 'ოთხშაბათი',
      trains: [
        {
          id: 7,
          number: 812,
          name: 'თბილისი-ბათუმი',
          date: 'ოთხშაბათი',
          from: 'თბილისი',
          to: 'ბათუმი',
          departure: '00:35',
          arrive: '05:47',
          departureId: 3,
          vagons: [],
        },
      ],
    },
  ];

  async function createComponent(options?: {
    state?: Record<string, unknown>;
    query?: Record<string, string>;
  }) {
    service = { searchDepartures: vi.fn().mockReturnValue(of(departures)) };
    router = {
      getCurrentNavigation: vi.fn().mockReturnValue(
        options?.state
          ? {
              extras: { state: options.state },
            }
          : null,
      ),
      navigate: vi.fn(),
    };
    activatedRoute = {
      snapshot: {
        queryParamMap: convertToParamMap(options?.query ?? {}),
      },
    };

    await TestBed.configureTestingModule({
      imports: [TrainRoutesComponent],
      providers: [
        { provide: Service, useValue: service },
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: activatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TrainRoutesComponent);
    component = fixture.componentInstance;
  }

  afterEach(() => {
    consoleErrorSpy?.mockRestore();
    TestBed.resetTestingModule();
  });

  it('should search departures from navigation state', async () => {
    await createComponent({
      state: { from: 'თბილისი', to: 'ბათუმი', date: '2026-05-13', passengers: 2 },
    });

    fixture.detectChanges();

    expect(service.searchDepartures).toHaveBeenCalledWith('თბილისი', 'ბათუმი', '2026-05-13');
    expect(component.departures).toEqual(departures);
    expect(component.isLoading).toBe(false);
  });

  it('should read search params from query params when navigation state is missing', async () => {
    await createComponent({
      query: { from: 'თბილისი', to: 'ფოთი', date: '2026-05-14', passengers: '3' },
    });

    fixture.detectChanges();

    expect(component.searchParams).toEqual({
      from: 'თბილისი',
      to: 'ფოთი',
      date: '2026-05-14',
      passengers: 3,
    });
    expect(service.searchDepartures).toHaveBeenCalledWith('თბილისი', 'ფოთი', '2026-05-14');
  });

  it('should show an error when search fails', async () => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    await createComponent({
      state: { from: 'თბილისი', to: 'ბათუმი', date: '2026-05-13', passengers: 1 },
    });
    service.searchDepartures.mockReturnValue(throwError(() => new Error('network')));

    fixture.detectChanges();

    expect(component.errorMessage).toContain('ძებნის');
    expect(component.isLoading).toBe(false);
  });

  it('should navigate to passenger info with selected train data', async () => {
    await createComponent({
      state: { from: 'თბილისი', to: 'ბათუმი', date: '2026-05-13', passengers: 1 },
    });
    fixture.detectChanges();

    component.bookTicket(departures[0].trains[0], departures[0]);

    expect(router.navigate).toHaveBeenCalledWith(['/passenger-info'], {
      state: {
        searchParams: component.searchParams,
        selectedTrain: departures[0].trains[0],
        selectedDeparture: departures[0],
      },
    });
  });
});
