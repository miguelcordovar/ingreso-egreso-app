import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';

import Swal from 'sweetalert2'
import { AppState } from '../app.reducer';
import { Store } from '@ngrx/store';

import * as ui from '../shared/ui.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: [
  ]
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {

  ingresoEgresoForm!: FormGroup;
  type:string = 'ingreso';
  isLoading:boolean = false;

  uiSubscription!:Subscription;

  constructor(private fb:FormBuilder,
              private ingresoEgresoService:IngresoEgresoService,
              private store:Store<AppState>) { }

  ngOnInit(): void {
    this.ingresoEgresoForm = this.fb.group({
      description: ['', Validators.required],
      amount: ['', Validators.required],
    })

    this.uiSubscription = this.store.select('ui')
                            .subscribe(ui => {
                              this.isLoading = ui.isLoading;
                            });

  }

  ngOnDestroy(): void {
      this.uiSubscription.unsubscribe();
  }

  save() {

    if (this.ingresoEgresoForm.invalid) return;

    this.store.dispatch(ui.startLoading());

    const { description, amount } = this.ingresoEgresoForm.value;

    const ingresoEgreso = new IngresoEgreso(description, amount, this.type);

    this.ingresoEgresoService
      .createIngresoEgreso(ingresoEgreso)
      .then(() => {
        this.ingresoEgresoForm.reset();

        this.store.dispatch(ui.stopLoading());

        Swal.fire({
          icon: 'success',
          title: 'Registro Creado',
          text: description
        });
      })
      .catch(err => {
        this.store.dispatch(ui.stopLoading());
        Swal.fire({
          icon: 'error',
          title: 'Ocurrió un error',
          text: err.message
        });
      })

  }

}
