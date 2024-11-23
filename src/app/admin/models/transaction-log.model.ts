export interface TransactionLog {
  type: string;
  timestamp: string;
  userId: number;
  username: string;
  userRole: string;
  ticketId: number;
  amount: number;
  status: string;
}
