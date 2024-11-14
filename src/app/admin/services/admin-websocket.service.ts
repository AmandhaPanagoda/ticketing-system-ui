import { Injectable, OnDestroy } from '@angular/core';
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
export class AdminWebsocketService implements OnDestroy {
  private client: Client;
  private transactionLogs = new BehaviorSubject<TransactionLog[]>([]);
  private logs: TransactionLog[] = [];
  private isConnected = false;

  constructor() {
    this.client = new Client({
      brokerURL: 'ws://localhost:8080/ws/websocket',
      onConnect: () => {
        console.log('Admin WebSocket Connected');
        this.isConnected = true;
        this.subscribeToTransactions();
      },
    });
    this.connect();
  }

  connect(): void {
    if (!this.isConnected) {
      this.client.activate();
    }
  }

  disconnect(): void {
    if (this.isConnected) {
      this.client.deactivate();
      this.isConnected = false;
    }
  }

  ngOnDestroy() {
    this.disconnect();
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
