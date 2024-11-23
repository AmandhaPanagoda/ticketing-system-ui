import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { AdminWebsocketService } from '../../services/admin-websocket.service';
import { Subscription } from 'rxjs';
import { Chart, ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { TransactionLog } from '../../models/transaction-log.model';

import {
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

@Component({
  selector: 'app-transaction-log',
  templateUrl: './transaction-log.component.html',
  styleUrls: ['./transaction-log.component.scss'],
})
export class TransactionLogComponent implements OnInit, OnDestroy {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  logs: TransactionLog[] = [];
  private subscription?: Subscription;

  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [],
        label: 'Ticket Sales',
        backgroundColor: 'rgba(0,123,255,0.3)',
        borderColor: 'rgba(0,123,255,1)',
        fill: true,
        tension: 0.4,
      },
      {
        data: [],
        label: 'Ticket Purchases',
        backgroundColor: 'rgba(40,167,69,0.3)',
        borderColor: 'rgba(40,167,69,1)',
        fill: true,
        tension: 0.4,
      },
    ],
    labels: [],
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 750,
      easing: 'easeInOutQuart',
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
      x: {
        reverse: true,
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: true,
        text: 'Ticket Activity Timeline (Last 10 Minutes)',
      },
    },
  };

  constructor(private websocketService: AdminWebsocketService) {
    Chart.register(
      CategoryScale,
      LinearScale,
      PointElement,
      LineElement,
      Title,
      Tooltip,
      Legend,
      Filler
    );
  }

  ngOnInit() {
    this.subscription = this.websocketService.getTransactionLogs().subscribe({
      next: logs => {
        console.log('Received logs update:', logs);
        this.logs = logs;
        this.updateChart(logs);
      },
      error: error => {
        console.error('Error receiving logs:', error);
      },
    });
  }

  private updateChart(logs: TransactionLog[]) {
    console.log('Starting updateChart with logs:', logs);

    // Group logs by minute
    const minuteGroups = new Map<string, { sales: number; purchases: number }>();

    logs.forEach(log => {
      const minute = new Date(log.timestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });

      if (!minuteGroups.has(minute)) {
        minuteGroups.set(minute, { sales: 0, purchases: 0 });
      }

      const group = minuteGroups.get(minute)!;
      if (log.type === 'SALE') {
        group.sales++;
      } else if (log.type === 'PURCHASE') {
        group.purchases++;
      }
    });

    // Convert to arrays and keep last 10 minutes
    const timeLabels = Array.from(minuteGroups.keys()).slice(-10);
    const salesData = Array.from(minuteGroups.values())
      .slice(-10)
      .map(g => g.sales);
    const purchaseData = Array.from(minuteGroups.values())
      .slice(-10)
      .map(g => g.purchases);

    console.log('Time groups:', {
      labels: timeLabels,
      sales: salesData,
      purchases: purchaseData,
    });

    // Update chart data
    this.lineChartData = {
      ...this.lineChartData,
      labels: timeLabels,
      datasets: [
        {
          ...this.lineChartData.datasets[0],
          label: 'Ticket Sales',
          data: salesData,
        },
        {
          ...this.lineChartData.datasets[1],
          label: 'Ticket Purchases',
          data: purchaseData,
        },
      ],
    };

    if (this.chart?.chart) {
      this.chart.chart.update();
    }
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
