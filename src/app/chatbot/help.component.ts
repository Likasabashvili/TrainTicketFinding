import { Component } from '@angular/core';
import { ChatbotComponent } from './chatbot.component';

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [ChatbotComponent],
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css'],
})
export class HelpComponent {}
