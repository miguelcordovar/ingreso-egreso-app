import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from '../../app.reducer';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styles: [
  ]
})
export class NavbarComponent implements OnInit, OnDestroy {

  authSubscription!:Subscription;

  username!:string;

  constructor(private store:Store<AppState>) { }

  ngOnInit(): void {
    this.authSubscription = this.store.select('auth')
    .subscribe(state => {
        this.username = state.user?.username!;
    })
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

}
