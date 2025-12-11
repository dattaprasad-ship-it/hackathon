import { EventType, ExpenseType, Currency } from './claims.types';

export interface ClaimsConfig {
  eventTypes: EventType[];
  expenseTypes: ExpenseType[];
  currencies: Currency[];
}

export interface CreateEventTypeRequest {
  name: string;
  description?: string;
}

export interface UpdateEventTypeRequest {
  name?: string;
  description?: string;
  isActive?: boolean;
}

export interface CreateExpenseTypeRequest {
  name: string;
  description?: string;
}

export interface UpdateExpenseTypeRequest {
  name?: string;
  description?: string;
  isActive?: boolean;
}

export interface CreateCurrencyRequest {
  code: string;
  name: string;
  symbol: string;
}

export interface UpdateCurrencyRequest {
  code?: string;
  name?: string;
  symbol?: string;
  isActive?: boolean;
}

