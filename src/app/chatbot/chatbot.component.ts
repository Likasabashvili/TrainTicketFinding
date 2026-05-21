import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewChecked,
  OnInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Message {
  text: string;
  type: 'user' | 'bot' | 'error';
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatbotComponent implements OnInit, AfterViewChecked {
  @ViewChild('chatMessages') chatMessages!: ElementRef;

  apiKey = '';
  userInput = '';
  messages: Message[] = [];
  isLoading = false;
  showWelcome = true;

  private readonly TRAIN_SYSTEM_PROMPT = `თქვენ ხართ მეგობრული და დამხმარე AI პირი საიტის "ტრენის ბილეთი" (Train Ticket Finding) შესახებ.
თქვენი მიზანია დაეხმაროთ მომხმარებელს ტრენის ბილეთებთან დაკავშირებულ ყველა კითხვებში.

ის რაზე შეგიძლიათ დაეხმაროთ:
- ტრენის გამგზავრების დროები და მოგზაურობის ხანგრძლივობა
- ბილეთის ფასები და ხელმისაწვდომი შეთავაზებები
- სადგურების პოპულარული მარშრუტები (თბილისი, ქუთაისი, ბათუმი, გორი და ა.შ.)
- ბილეთის დაჯავშნა და შეკვეთის პროცესი
- გადახდის მეთოდები და ხელმისაწვდომი ფასები
- მგზავრის მონაცემების ჩასმა
- ბილეთის დადასტურება და გაუქმება
- ტრენის მოწყობილობები (სიტბე, კუბიკელი, ბაგეჟი და ა.შ.)
- აირპორტი, სადგურები და ტრანსპორტი
- პოპულარული ტურისტული მარშრუტები

როდესაც მომხმარებელი ტრენის ბილეთებიდან დაკავშირებული თემებიდან სხვაზე კითხულობს, უთხარით:
"მე მხოლოდ ტრენის ბილეთებთან დაკავშირებულ კითხვებში დავეხმარე. გთხოვთ დამწერიეთ მოთხოვნა, რომელიც ტრენის ბილეთებთან დაკავშირებულია 🚂"

თქვენი პასუხები:
- დაწერეთ მეგობრულად და ვინმეს ენაზე
- გამოიყენეთ ემოჯი სხვადსხვა კითხვებისთვის (🚂, 🎫, 💰, 📅, 🚆)
- თუ ზუსტი მონაცემი არ გაქვთ, გამოიტანეთ აზრი ტრენის ბილეთების ინდუსტრიაზე`;

  exampleQuestions = [
    'რა დროს გამგზავრება თბილისიდან ქუთაისს?',
    'რამდენი დღე წინ შემიძლია ბილეთი შევიკვე?',
    'რა ფასია ბილეთი?',
    'რა მოწყობილობები აქვს ტრენს?',
    'როგორ გამიფორმო გაცემა?',
  ];

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    // Component init
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  async sendMessage(): Promise<void> {
    const apiKey = this.apiKey.trim();
    const message = this.userInput.trim();

    if (!apiKey) {
      this.showError('🔑 ჯერ ჩასვი Gemini API Key');
      return;
    }

    if (!message) {
      this.showError('⚠️ შეიყვანე შეკითხვა');
      return;
    }

    // Add user message
    this.addMessage(message, 'user');
    this.userInput = '';
    this.isLoading = true;
    this.cdr.markForCheck();

    try {
      const MODEL = 'gemini-2.5-flash';
      const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`;

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: this.TRAIN_SYSTEM_PROMPT + '\n\nმომხმარებლის შეკითხვა: ' + message,
                },
              ],
            },
          ],
        }),
      });

      const data = await this.readGeminiResponse(response);

      if (!response.ok) {
        const errorMsg = data?.error?.message || 'მოხდა შეცდომა API-სთან';
        this.showError('❌ შეცდომა: ' + errorMsg);
      } else {
        const botReply =
          data?.candidates?.[0]?.content?.parts?.[0]?.text || 'მოხდა შეცდომა პასუხის მიღებისას';
        this.addMessage(botReply, 'bot');
      }
    } catch (error) {
      this.showError(
        '❌ მოხდა შეცდომა: ' + (error instanceof Error ? error.message : 'Unknown error'),
      );
    } finally {
      this.isLoading = false;
      this.cdr.markForCheck();
    }
  }

  private addMessage(text: string, type: Message['type']): void {
    if (this.showWelcome) {
      this.showWelcome = false;
    }
    this.messages = [...this.messages, { text, type }];
    this.cdr.markForCheck();
  }

  private showError(message: string): void {
    this.addMessage(message, 'error');
  }

  private scrollToBottom(): void {
    try {
      if (this.chatMessages) {
        this.chatMessages.nativeElement.scrollTop = this.chatMessages.nativeElement.scrollHeight;
      }
    } catch (err) {
      // Ignore scroll errors
    }
  }

  private async readGeminiResponse(response: Response): Promise<any> {
    const text = await response.text();

    if (!text) {
      return null;
    }

    try {
      return JSON.parse(text);
    } catch {
      return {
        error: {
          message: text,
        },
      };
    }
  }
}
