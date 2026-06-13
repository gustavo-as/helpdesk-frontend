import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TicketApi } from './core/ticket-api';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('helpdesk-frontend');
  private readonly ticketApi = inject(TicketApi);

  constructor() {
    this.ticketApi.list().subscribe(tickets => console.log('tickets:', tickets));
  }
}
