import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { IngresoEgreso } from 'src/app/models/ingreso-egreso.model';
import { IngresoEgresoService } from 'src/app/services/ingreso-egreso.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: [
  ]
})
export class DetalleComponent implements OnInit, OnDestroy {

  ingresosEgresos:IngresoEgreso[] = [];
  ingresosEgresosSubscription!:Subscription;

  constructor(private store:Store<AppState>,
              private ingresoEgresoService:IngresoEgresoService) {

  }

  ngOnInit(): void {
    this.ingresosEgresosSubscription =
        this.store.select('ingresosEgresos')
          .subscribe(({items}) => {
            this.ingresosEgresos = items;
          });
      }

  ngOnDestroy(): void {
      this.ingresosEgresosSubscription.unsubscribe();
  }

  delete(uid:string) {
    this.ingresoEgresoService.deleteIngresoEgreso(uid)
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Registro Borrado',
          text: 'Item borrado'
        });
      })
      .catch((err) => {
        Swal.fire({
          icon: 'error',
          title: 'Registro Borrado',
          text: err.message
        });
      });

  }

}
