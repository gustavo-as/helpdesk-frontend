import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Ticket,
  TicketSummary,
  TicketStatus,
  CreateTicketRequest,
  CategorySuggestion
} from './ticket.model';

@Injectable({ providedIn: 'root' })
export class TicketApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8080/api/tickets';
  private readonly classifyUrl = 'http://localhost:8080/api/classification/category';


  list(status?: TicketStatus): Observable<TicketSummary[]> {
    const url = status ? `${this.baseUrl}?status=${status}` : this.baseUrl;
    return this.http.get<TicketSummary[]>(url);
  }

  get(id: number): Observable<Ticket> {
    return this.http.get<Ticket>(`${this.baseUrl}/${id}`);
  }

  create(req: CreateTicketRequest): Observable<Ticket> {
    return this.http.post<Ticket>(this.baseUrl, req);
  }

  assign(id: number, agent: string): Observable<Ticket> {
    return this.http.post<Ticket>(`${this.baseUrl}/${id}/assign`, { agent });
  }

  transition(id: number, target: TicketStatus): Observable<Ticket> {
    return this.http.post<Ticket>(`${this.baseUrl}/${id}/transition`, { target });
  }

  respond(id: number, body: string, author: string): Observable<Ticket> {
    return this.http.post<Ticket>(`${this.baseUrl}/${id}/responses`, { body, author });
  }

  suggestCategory(title: string, description: string): Observable<CategorySuggestion> {
    return this.http.post<CategorySuggestion>(this.classifyUrl, { title, description });
  }
}