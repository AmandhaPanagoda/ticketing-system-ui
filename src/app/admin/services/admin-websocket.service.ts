import { Injectable } from '@angular/core';
import { Client, IStompSocket } from '@stomp/stompjs';
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

  constructor() {
    this.client = new Client({
      brokerURL: 'ws://localhost:8080/ws/websocket', // Update this URL to match your backend WebSocket endpoint
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.log('Admin WebSocket Connected');
        this.subscribeToTransactions();
      },
      onDisconnect: () => {
        console.log('Admin WebSocket Disconnected');
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
      const currentLogs = this.transactionLogs.value;
      this.transactionLogs.next([...currentLogs, newLog]);
    });
  }

  getTransactionLogs() {
    return this.transactionLogs.asObservable();
  }
}
