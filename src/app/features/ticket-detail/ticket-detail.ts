import { Component, effect, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TicketApi } from '../../core/ticket-api';
import { Ticket, TicketStatus } from '../../core/ticket.model';


@Component({
  selector: 'app-ticket-detail',
  imports: [RouterLink],
  templateUrl: './ticket-detail.html',
  styleUrl: './ticket-detail.css',
})
export class TicketDetail {
  private readonly api = inject(TicketApi);

  readonly id = input.required<string>();
  readonly ticket = signal<Ticket | null>(null);
  readonly error = signal<string | null>(null);

  constructor() {
    effect(() => {
      const id = Number(this.id());
      this.error.set(null);
      this.api.get(id).subscribe({
        next: t => this.ticket.set(t),
        error: () => this.error.set('Could not load this ticket.'),
      });
    });
  }

  transition(target: TicketStatus): void {
    const current = this.ticket();
    if (!current) return;
    this.api.transition(current.id, target).subscribe({
      next: updated => this.ticket.set(updated),
      error: () => this.error.set('Could not change status. Try reloading.'),
    });
  }
}
