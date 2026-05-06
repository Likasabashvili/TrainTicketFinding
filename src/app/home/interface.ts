export interface Istations {
  id: number;
  number: number;
  name: string;
  date: string;
  from: string;
  to: string;
  departure: string;
  arrive: string;
  departureId: number;
  vagons: [
    {
      id: number;
      trainId: number;
      trainNumber: number;
      name: string;
      seats: [
        {
          seatId: any;
          number: string;
          price: number;
          isOccupied: boolean;
          vagonId: number;
        },
      ];
    },
  ];
}

export interface ItrainsId {
  id: number;
  trainId: number;
  trainNumber: number;
  name: string;
  seats: [
    {
      seatId: any;
      number: string;
      price: number;
      isOccupied: boolean;
      vagonId: number;
    },
  ];
}
export interface Ideparture {
  id: number;
  source: string;
  destination: string;
  date: string;
  trains: [
    {
      id: number;
      number: number;
      name: string;
      date: string;
      from: string;
      to: string;
      departure: string;
      arrive: string;
      departureId: number;
      vagons: [
        {
          id: number;
          trainId: number;
          trainNumber: number;
          name: string;
          seats: [
            {
              seatId: any;
              number: string;
              price: number;
              isOccupied: boolean;
              vagonId: number;
            },
          ];
        },
      ];
    },
  ];
}

export interface Itickets {
  id: any;
  phone: string;
  email: string;
  date: string;
  ticketPrice: number;
  trainID: number;
  confirmed: boolean;
  train: {
    id: number;
    number: number;
    name: string;
    date: string;
    from: string;
    to: string;
    departure: string;
    arrive: string;
    departureId: number;
    vagons: [
      {
        id: number;
        trainId: number;
        trainNumber: number;
        name: string;
        seats: [
          {
            seatId: any;
            number: string;
            price: number;
            isOccupied: boolean;
            vagonId: number;
          },
        ];
      },
    ];
  };
  persons: [
    {
      id: number;
      ticketId: any;
      seat: {
        seatId: any;
        number: string;
        price: number;
        isOccupied: boolean;
        vagonId: number;
      };
      name: string;
      surname: string;
      idNumber: string;
      status: string;
      payoutCompleted: boolean;
    },
  ];
}
export interface IticketsRegister {
  trainId: number;
  date: any;
  email: string;
  phoneNumber: string;
  people: [
    {
      seatId: any;
      name: string;
      surname: string;
      idNumber: string;
      status: string;
      payoutCompleted: boolean;
    },
  ];
}

export interface IticketsCheck {
  id: any;
  phone: string;
  email: string;
  date: string;
  ticketPrice: number;
  trainID: number;
  confirmed: boolean;
  train: {
    id: number;
    number: number;
    name: string;
    date: string;
    from: string;
    to: string;
    departure: string;
    arrive: string;
    departureId: number;
    vagons: [
      {
        id: number;
        trainId: number;
        trainNumber: number;
        name: string;
        seats: [
          {
            seatId: any;
            number: string;
            price: number;
            isOccupied: boolean;
            vagonId: number;
          },
        ];
      },
    ];
  };
  persons: [
    {
      id: number;
      ticketId: any;
      seat: {
        seatId: any;
        number: string;
        price: number;
        isOccupied: boolean;
        vagonId: number;
      };
      name: string;
      surname: string;
      idNumber: string;
      status: string;
      payoutCompleted: boolean;
    },
  ];
}

export interface ISeatId {
  seatId: any;
  number: string;
  price: number;
  isOccupied: boolean;
  vagonId: number;
}
