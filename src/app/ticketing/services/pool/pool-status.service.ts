import { Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs';
import { BehaviorSubject, Observable } from 'rxjs';

export interface PoolStatus {
  currentTicketCount: number;
  isFull: boolean;
  isEmpty: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class PoolStatusService {
  private client: Client;
  private poolStatus = new BehaviorSubject<PoolStatus | null>(null);

  constructor() {
    this.client = new Client({
      brokerURL: 'ws://localhost:8080/ws/websocket',
      onConnect: () => {
        this.subscribeToPoolStatus();
      },
    });
    this.client.activate();
  }

  private subscribeToPoolStatus(): void {
    this.client.subscribe('/topic/pool-status', message => {
      const status: PoolStatus = JSON.parse(message.body);
      this.poolStatus.next(status);
    });
  }

  getPoolStatus(): Observable<PoolStatus | null> {
    return this.poolStatus.asObservable();
  }
}
