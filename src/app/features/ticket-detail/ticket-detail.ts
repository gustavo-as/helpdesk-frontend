import { Component, effect, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TicketApi } from '../../core/ticket-api';
import { Ticket, TicketStatus, ReplyDraft } from '../../core/ticket.model';


@Component({
  selector: 'app-ticket-detail',
  imports: [RouterLink, FormsModule],
  templateUrl: './ticket-detail.html',
  styleUrl: './ticket-detail.css',
})
export class TicketDetail {
  private readonly api = inject(TicketApi);

  readonly id = input.required<string>();
  readonly ticket = signal<Ticket | null>(null);
  readonly error = signal<string | null>(null);
  readonly drafting = signal(false);
  readonly draftMsg = signal<string | null>(null);

  agent = '';
  responseAuthor = '';
  responseBody = '';

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

  assign(): void {
    const current = this.ticket();
    const name = this.agent.trim();
    if (!current || !name) return;
    this.api.assign(current.id, name).subscribe({
      next: updated => { this.ticket.set(updated); this.agent = ''; },
      error: () => this.error.set('Could not assign. Try again.'),
    });
  }

  addResponse(): void {
    const current = this.ticket();
    const body = this.responseBody.trim();
    const author = this.responseAuthor.trim();
    if (!current || !body || !author) return;
    this.api.respond(current.id, body, author).subscribe({
      next: updated => {
        this.ticket.set(updated);
        this.responseBody = '';
        this.responseAuthor = '';
      },
      error: () => this.error.set('Could not add response. Try again.'),
    });
  }

  draftReply(): void {
    const current = this.ticket();
    if (!current) return;
    this.drafting.set(true);
    this.draftMsg.set(null);
    this.api.draftReply(current.id).subscribe({
      next: result => {
        this.drafting.set(false);
        this.responseBody = result.draft;
        this.draftMsg.set('Rascunho gerado pela IA — revise e edite antes de enviar.');
      },
      error: () => {
        this.drafting.set(false);
        this.draftMsg.set('Não foi possível gerar o rascunho agora. Escreva manualmente.');
      },
    });
  }
}
