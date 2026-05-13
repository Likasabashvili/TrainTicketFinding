import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { PassengerInfoComponent } from './passenger-info';
import { Service } from '../service';
import { Departure, SearchParams, Train } from '../models/interfaces';

describe('PassengerInfoComponent', () => {
  let component: PassengerInfoComponent;
  let fixture: ComponentFixture<PassengerInfoComponent>;
  let router: { getCurrentNavigation: ReturnType<typeof vi.fn>; navigate: ReturnType<typeof vi.fn> };

  const searchParams: SearchParams = {
    from: 'თბილისი',
    to: 'ბათუმი',
    date: '2026-05-13',
    passengers: 1,
  };

  const selectedTrain: Train = {
    id: 7,
    number: 812,
    name: 'თბილისი-ბათუმი',
    date: 'ოთხშაბათი',
    from: 'თბილისი',
    to: 'ბათუმი',
    departure: '00:35',
    arrive: '05:47',
    departureId: 3,
    vagons: [
      {
        id: 19,
        trainId: 7,
        number: 1,
        trainNumber: 812,
        name: 'I კლასი',
        seats: [
          {
            seatId: 'seat-1',
            number: '1A',
            price: 35,
            isOccupied: false,
            vagonId: 19,
          },
          {
            seatId: 'seat-2',
            number: '1B',
            price: 75,
            isOccupied: false,
            vagonId: 19,
          },
        ],
      },
    ],
  };

  const selectedDeparture: Departure = {
    id: 3,
    source: 'თბილისი',
    destination: 'ბათუმი',
    date: 'ოთხშაბათი',
    trains: [selectedTrain],
  };

  beforeEach(async () => {
    router = {
      getCurrentNavigation: vi.fn().mockReturnValue({
        extras: {
          state: {
            searchParams,
            selectedTrain,
            selectedDeparture,
          },
        },
      }),
      navigate: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [PassengerInfoComponent],
      providers: [
        { provide: Router, useValue: router },
        { provide: Service, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PassengerInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should initialize booking state and one passenger', () => {
    expect(component.searchParams).toEqual(searchParams);
    expect(component.selectedTrain).toEqual(selectedTrain);
    expect(component.passengers).toHaveLength(1);
    expect(component.isFormValid()).toBe(false);
  });

  it('should update passenger count from select values', () => {
    component.updatePassengerCount('3');

    expect(component.numberOfPassengers).toBe(3);
    expect(component.passengers).toHaveLength(3);
  });

  it('should select a seat and calculate total price', () => {
    component.openSeatSelection(0);
    component.selectSeat(selectedTrain.vagons[0].seats[1]);
    component.confirmSeatSelection();

    expect(component.passengers[0].seatId).toBe('seat-2');
    expect(component.passengers[0].seatNumber).toBe('1B');
    expect(component.totalPrice).toBe(75);
    expect(component.showSeatModal).toBe(false);
  });

  it('should require a selected seat before confirming', () => {
    component.openSeatSelection(0);
    component.confirmSeatSelection();

    expect(component.errorMessage).toContain('გთხოვთ აირჩიოთ ადგილი');
    expect(component.passengers[0].seatId).toBe('');
  });

  it('should navigate to payment when the form is valid', () => {
    component.email = 'test@example.com';
    component.phoneNumber = '+995555000000';
    component.passengers[0] = {
      name: 'ანა',
      surname: 'აბაშიძე',
      idNumber: '01001001001',
      seatId: 'seat-1',
      seatNumber: '1A',
    };
    component.calculateTotalPrice();

    component.proceedToPayment();

    expect(router.navigate).toHaveBeenCalledWith(['/payment'], {
      state: {
        searchParams,
        selectedTrain,
        selectedDeparture,
        email: 'test@example.com',
        phoneNumber: '+995555000000',
        passengers: component.passengers,
        totalPrice: 35,
      },
    });
  });
});
