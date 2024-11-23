import { Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs';
import { BehaviorSubject } from 'rxjs';

export interface SystemLog {
  level: string;
  source: string;
  message: string;
  userId: string;
  action: string;
  timestamp: string;
}

@Injectable({
  providedIn: 'root',
})
export class SystemLogService {
  private client: Client;
  private systemLogs = new BehaviorSubject<SystemLog[]>([]);
  private logs: SystemLog[] = [];

  constructor() {
    this.client = new Client({
      brokerURL: 'ws://localhost:8080/ws/websocket',
      onConnect: () => {
        console.log('System Log WebSocket Connected');
        this.subscribeToLogs();
      },
    });
    this.connect();
  }

  connect(): void {
    this.client.activate();
  }

  disconnect(): void {
    this.client.deactivate();
  }

  private subscribeToLogs(): void {
    this.client.subscribe('/topic/logs', message => {
      const newLog: SystemLog = JSON.parse(message.body);
      this.logs = [newLog, ...this.logs].slice(0, 1000); // last 1000 logs
      this.systemLogs.next(this.logs);
    });
  }

  getSystemLogs() {
    return this.systemLogs.asObservable();
  }
}
