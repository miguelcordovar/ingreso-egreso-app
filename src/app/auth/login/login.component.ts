import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';



import Swal from 'sweetalert2'

import { Store } from '@ngrx/store';

import { AppState } from '../../app.reducer';

import { AuthService } from '../../services/auth.service';
import * as ui from '../../shared/ui.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm!: FormGroup;
  isLoading = false;

  uiSubscription!:Subscription;

  constructor(private fb:FormBuilder,
              private store:Store<AppState>,
              private authService:AuthService,
              private router:Router) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.uiSubscription = this.store.select('ui')
                              .subscribe(ui => {
                                this.isLoading = ui.isLoading;
                              });
  }

  ngOnDestroy(): void {
      this.uiSubscription.unsubscribe();
  }

  login() {
    if (this.loginForm.invalid) return;

    this.store.dispatch(ui.startLoading());

    Swal.fire({
      title: 'Espere por favor...',
      didOpen: () => {
        Swal.showLoading();
      }
    });

    const { email, password } = this.loginForm.value;

    this.authService.loginUser(email, password)
      .then(credentials => {
        Swal.close();
        this.store.dispatch(ui.stopLoading());
        this.router.navigate(['/']);
      })
      .catch(err => {
        Swal.close();
        this.store.dispatch(ui.stopLoading());
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.message
        })
      });

  }

}
