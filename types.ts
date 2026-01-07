
export type CategoryType = 'INTERNET' | 'IPTV' | 'COMBO' | 'CERTIFICADO';
export type BillingPeriod = 'MENSAL' | '2 MESES' | '3 MESES' | '4 MESES' | '5 MESES' | '6 MESES' | 'ANUAL' | 'ÚNICO';

export interface ServiceSpec {
  label: string;
  value: string;
}

export interface Plan {
  id: string;
  title: string;
  category: CategoryType;
  subCategory?: string;
  price: number;
  period: BillingPeriod;
  specs: ServiceSpec[];
  isPopular?: boolean;
  color: string;
}

export interface AppState {
  view: 'STORE' | 'ADMIN';
  activeCategory: CategoryType;
}

// Betting App Types
export type Outcome = 'HOME' | 'DRAW' | 'AWAY';
export type UserRole = 'ADMIN' | 'CLIENT' | 'CAMBISTA';

export interface Team {
  name: string;
  color: string;
  logoPlaceholder: string;
}

export interface Match {
  id: number;
  homeTeam: Team;
  awayTeam: Team;
  league: string;
  time: string;
}

export interface User {
  username: string;
  password?: string;
  role: UserRole;
  balance: number;
  createdBy: string;
  pixKey: string;
}

export interface Ticket {
  id: string;
  price: number;
  potentialWin: number;
  timestamp: string;
  status: 'PAID' | 'PENDING_PAYMENT';
  selections: Record<number, Outcome>;
  agent: string;
}

export interface Transaction {
  id: string;
  username: string;
  amount: number;
  type: 'DEPOSIT' | 'WITHDRAWAL';
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  timestamp: string;
  agent: string;
}
