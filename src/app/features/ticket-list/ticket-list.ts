import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TicketApi } from '../../core/ticket-api';
import { TicketSummary } from '../../core/ticket.model';

@Component({
  selector: 'app-ticket-list',
  imports: [],
  templateUrl: './ticket-list.html',
  styleUrl: './ticket-list.css',
})
export class TicketList {
  private readonly api = inject(TicketApi);
  readonly tickets = toSignal(this.api.list(), { initialValue: [] as TicketSummary[] });
}
