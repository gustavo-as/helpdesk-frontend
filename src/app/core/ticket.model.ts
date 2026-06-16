export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type Category = 'TECHNICAL' | 'BILLING' | 'ACCOUNT' | 'GENERAL';

export interface ResponseView {
  id: number;
  body: string;
  author: string;
  createdAt: string;
}

export interface TicketSummary {
  id: number;
  title: string;
  status: TicketStatus;
  priority: Priority;
  category: Category;
  assignee: string | null;
  slaDueAt: string;
  slaBreached: boolean;
}

export interface Ticket {
  id: number;
  title: string;
  description: string;
  status: TicketStatus;
  allowedNext: TicketStatus[];
  priority: Priority;
  category: Category;
  assignee: string | null;
  createdAt: string;
  updatedAt: string;
  slaDueAt: string;
  slaBreached: boolean;
  responses: ResponseView[];
}

export interface CreateTicketRequest {
  title: string;
  description: string;
  priority: Priority;
  category: Category;
}

export interface CategorySuggestion {
  category: Category | null;
  available: boolean;
}

export interface ReplyDraft {
  draft: string;
}

export interface AgentOutcome {
  result: 'RESOLVED' | 'ESCALATED';
  message: string;
  status: TicketStatus;
}