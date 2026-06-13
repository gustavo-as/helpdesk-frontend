import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { TicketApi } from '../../core/ticket-api';
import { TicketSummary, TicketStatus } from '../../core/ticket.model';

@Component({
  selector: 'app-ticket-list',
  imports: [],
  templateUrl: './ticket-list.html',
  styleUrl: './ticket-list.css',
})
export class TicketList {
private readonly api = inject(TicketApi);

  readonly statuses: TicketStatus[] = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
  readonly selectedStatus = signal<TicketStatus | null>(null);

  readonly tickets = toSignal(
    toObservable(this.selectedStatus).pipe(
      switchMap(status => this.api.list(status ?? undefined)),
    ),
    { initialValue: [] as TicketSummary[] },
  );

  select(status: TicketStatus | null): void {
    this.selectedStatus.set(status);
  }
}
