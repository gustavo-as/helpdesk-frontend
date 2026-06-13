import { Routes } from '@angular/router';
import { TicketList } from './features/ticket-list/ticket-list';
import { TicketDetail } from './features/ticket-detail/ticket-detail';
import { TicketCreate } from './features/ticket-create/ticket-create';

export const routes: Routes = [
    { path: 'tickets', component: TicketList },
    { path: 'tickets/new', component: TicketCreate },
    { path: 'tickets/:id', component: TicketDetail },
    { path: '', redirectTo: 'tickets', pathMatch: 'full' },
];
