import { Routes } from '@angular/router';
import { Home } from './home/home';
import { TrainRoutesComponent } from './train-routes/train-routes';
import { PassengerInfoComponent } from './passenger-info/passenger-info';
import { PaymentComponent } from './payment/payment';
import { TicketCheckComponent } from './ticket-check/ticket-check';
import { TestHomeComponent } from './test-home';
import { LoginComponent } from './auth/login';
import { RegisterComponent } from './auth/register';
import { HelpComponent } from './chatbot/help.component';

export const routes: Routes = [
  {
    path: '',
    component: Home,
  },
  {
    path: 'test',
    component: TestHomeComponent,
  },
  {
    path: 'trains',
    component: TrainRoutesComponent,
  },
  {
    path: 'passenger-info',
    component: PassengerInfoComponent,
  },
  {
    path: 'payment',
    component: PaymentComponent,
  },
  {
    path: 'ticket-check',
    component: TicketCheckComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'help',
    component: HelpComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
