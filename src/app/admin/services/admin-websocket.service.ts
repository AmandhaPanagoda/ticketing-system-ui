import { Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs';
import { BehaviorSubject } from 'rxjs';

export interface TransactionLog {
  type: string;
  timestamp: string;
  userId: number;
  userRole: string;
  ticketId: number;
  amount: number;
  status: string;
}

@Injectable({
  providedIn: 'root',
})
export class AdminWebsocketService {
  private client: Client;
  private transactionLogs = new BehaviorSubject<TransactionLog[]>([]);
  private logs: TransactionLog[] = [];

  constructor() {
    this.client = new Client({
      brokerURL: 'ws://localhost:8080/ws/websocket',
      onConnect: () => {
        console.log('Admin WebSocket Connected');
        this.subscribeToTransactions();
      },
    });
  }

  connect(): void {
    this.client.activate();
  }

  disconnect(): void {
    this.client.deactivate();
  }

  private subscribeToTransactions(): void {
    this.client.subscribe('/topic/transactions', message => {
      const newLog: TransactionLog = JSON.parse(message.body);
      this.logs = [...this.logs, newLog];
      this.transactionLogs.next(this.logs);
      console.log('New transaction received:', newLog);
    });
  }

  getTransactionLogs() {
    return this.transactionLogs.asObservable();
  }
}
