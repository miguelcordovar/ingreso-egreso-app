import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ChartData, ChartType } from 'chart.js';
import { filter, Subscription } from 'rxjs';

import { IngresoEgreso } from 'src/app/models/ingreso-egreso.model';
import { AppStateWithIngresosEgresos } from '../ingreso-egreso.reducer';

@Component({
  selector: 'app-estadistica',
  templateUrl: './estadistica.component.html',
  styles: [
  ]
})
export class EstadisticaComponent implements OnInit, OnDestroy {

  ingresos: number = 0;
  egresos: number = 0;

  totalIngresos: number = 0;
  totalEgresos:  number = 0;

  ingresosEgresosSubscription!:Subscription

  // Doughnut
  public doughnutChartLabels: string[] = [ 'Ingresos', 'Egresos' ];

  public doughnutChartData: ChartData<'doughnut'> = {
    labels: this.doughnutChartLabels,
    datasets: []
  };
  public doughnutChartType: ChartType = 'doughnut';

  constructor(private store:Store<AppStateWithIngresosEgresos>) { }

  ngOnInit(): void {
    this.ingresosEgresosSubscription = this.store.select('ingresosEgresos')
      .subscribe(({items})=>this.calcularIngresosEgresos(items));
  }

  ngOnDestroy(): void {
      this.ingresosEgresosSubscription.unsubscribe();
  }

  calcularIngresosEgresos(items:IngresoEgreso[]) {

    this.totalIngresos = 0;
    this.totalEgresos = 0,
    this.ingresos = 0;
    this.egresos = 0;

    for (const item of items) {
      if (item.type=='ingreso') {
        this.totalIngresos += item.amount;
        this.ingresos ++;
      } else {
        this.totalEgresos += item.amount;
        this.egresos ++;
      }
    }

    this.doughnutChartData.datasets = [ { data: [ this.totalIngresos, this.totalEgresos ] } ];
  }

}
