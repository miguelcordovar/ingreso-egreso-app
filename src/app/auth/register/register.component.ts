import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../../services/auth.service';

import Swal from 'sweetalert2'
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';

import { Store } from '@ngrx/store';
import * as ui from '../../shared/ui.actions';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit, OnDestroy {

  registerForm!: FormGroup;
  uiSubscription!:Subscription;
  isLoading = false;

  constructor(private fb:FormBuilder,
              private store:Store<AppState>,
              private authService:AuthService,
              private router:Router) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.required],
    });

    this.uiSubscription = this.store.select('ui')
                            .subscribe(ui => {
                              this.isLoading = ui.isLoading;
                            });
  }

  ngOnDestroy(): void {
      this.uiSubscription.unsubscribe();
  }

  createUser(): void {

    if (this.registerForm.invalid) return;

    this.store.dispatch(ui.startLoading());

    Swal.fire({
      title: 'Espere por favor...',
      didOpen: () => {
        Swal.showLoading()
      }
    });

    const { username, email, password } = this.registerForm.value;

    this.authService.createUser(username, email, password)
      .then(() => {
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
