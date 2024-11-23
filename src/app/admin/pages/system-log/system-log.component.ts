import { Component, OnInit, OnDestroy } from '@angular/core';
import { SystemLogService } from '../../services/system-log.service';
import { Subscription } from 'rxjs';
import { SystemLog } from '../../models/system-log.model';

@Component({
  selector: 'app-system-log',
  templateUrl: './system-log.component.html',
  styleUrls: ['./system-log.component.scss'],
})
export class SystemLogComponent implements OnInit, OnDestroy {
  logs: SystemLog[] = [];
  private subscription?: Subscription;

  constructor(private systemLogService: SystemLogService) {}

  ngOnInit() {
    this.subscription = this.systemLogService.getSystemLogs().subscribe({
      next: logs => {
        this.logs = logs;
      },
      error: error => {
        console.error('Error receiving logs:', error);
      },
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  getSeverityClass(level: string): 'success' | 'info' | 'warning' | 'danger' | 'contrast' {
    switch (level.toLowerCase()) {
      case 'error':
        return 'danger';
      case 'warn':
        return 'warning';
      case 'info':
        return 'info';
      case 'debug':
        return 'contrast';
      default:
        return 'info';
    }
  }
}
