import { Component, OnInit, OnDestroy } from '@angular/core';
import { AdminWebsocketService, TransactionLog } from '../../services/admin-websocket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-transaction-log',
  templateUrl: './transaction-log.component.html',
  styleUrls: ['./transaction-log.component.scss'],
})
export class TransactionLogComponent implements OnInit, OnDestroy {
  logs: TransactionLog[] = [];
  private subscription?: Subscription;

  constructor(private websocketService: AdminWebsocketService) {}

  ngOnInit() {
    console.log('Initializing transaction log component');
    this.websocketService.connect();
    this.subscription = this.websocketService.getTransactionLogs().subscribe({
      next: logs => {
        console.log('Received logs:', logs);
        this.logs = logs;
      },
      error: error => {
        console.error('Error receiving logs:', error);
      },
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
    this.websocketService.disconnect();
  }
}
