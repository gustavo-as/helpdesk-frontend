import { Routes } from '@angular/router';
import { TicketList } from './features/ticket-list/ticket-list';
import { TicketDetail } from './features/ticket-detail/ticket-detail';


export const routes: Routes = [
    { path: 'tickets', component: TicketList },
    { path: 'tickets/:id', component: TicketDetail },
    { path: '', redirectTo: 'tickets', pathMatch: 'full' },
];
