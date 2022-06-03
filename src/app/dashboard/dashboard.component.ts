import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, Subscription } from 'rxjs';
import { AppState } from '../app.reducer';

import { IngresoEgresoService } from '../services/ingreso-egreso.service';

import * as ingresosEgresosActions from '../ingreso-egreso/ingreso-egreso.actions';
import { IngresoEgreso } from '../models/ingreso-egreso.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
})
export class DashboardComponent implements OnInit, OnDestroy {

  authSubscription!:Subscription;
  ingresosEgresosSubscription!:Subscription;

  constructor(private store:Store<AppState>,
              private ingresoEgreso:IngresoEgresoService) { }

  ngOnInit(): void {
    this.authSubscription = this.store.select('auth')
                                      .pipe(
                                        filter(auth => auth.user != null)
                                      )
                                      .subscribe( ({user}) => {
                                        this.ingresosEgresosSubscription = this.ingresoEgreso.initIngresosEgresosListener(user?.uid!)
                                                                              .subscribe(items => {
                                                                                this.store.dispatch(ingresosEgresosActions.setItems({items}));
                                                                              });
                                      });
  }

  ngOnDestroy(): void {

    if (this.ingresosEgresosSubscription)
      this.ingresosEgresosSubscription.unsubscribe();

    if (this.authSubscription)
      this.authSubscription.unsubscribe();

  }

}
