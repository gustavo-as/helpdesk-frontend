import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TicketApi } from '../../core/ticket-api';
import { Priority, Category } from '../../core/ticket.model';

@Component({
  selector: 'app-ticket-create',
  imports: [FormsModule, RouterLink],
  templateUrl: './ticket-create.html',
  styleUrl: './ticket-create.css',
})
export class TicketCreate {
   private readonly api = inject(TicketApi);
  private readonly router = inject(Router);

  readonly priorities: Priority[] = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
  readonly categories: Category[] = ['TECHNICAL', 'BILLING', 'ACCOUNT', 'GENERAL'];

  title = '';
  description = '';
  priority: Priority = 'MEDIUM';
  category: Category = 'GENERAL';

  readonly saving = signal(false);
  readonly error = signal<string | null>(null);

  readonly suggesting = signal(false);
  readonly suggestionMsg = signal<string | null>(null);

  suggestCategory(): void {
    if (!this.title.trim() || !this.description.trim()) {
      this.suggestionMsg.set('Preencha título e descrição primeiro.');
      return;
    }
    this.suggesting.set(true);
    this.suggestionMsg.set(null);
    this.api.suggestCategory(this.title.trim(), this.description.trim()).subscribe({
      next: result => {
        this.suggesting.set(false);
        if (result.available && result.category) {
          this.category = result.category;
          this.suggestionMsg.set(`IA sugeriu: ${result.category} (aplicado — troque se discordar)`);
        } else {
          this.suggestionMsg.set('A IA não conseguiu sugerir. Escolha a categoria manualmente.');
        }
      },
      error: () => {
        this.suggesting.set(false);
        this.suggestionMsg.set('Não foi possível consultar a IA agora. Escolha manualmente.');
      },
    });
  }

  submit(): void {
    if (!this.title.trim() || !this.description.trim()) return;
    this.saving.set(true);
    this.error.set(null);
    this.api.create({
      title: this.title.trim(),
      description: this.description.trim(),
      priority: this.priority,
      category: this.category,
    }).subscribe({
      next: created => this.router.navigate(['/tickets', created.id]),
      error: () => {
        this.error.set('Could not create the ticket. Check the fields and try again.');
        this.saving.set(false);
      },
    });
  }
}
