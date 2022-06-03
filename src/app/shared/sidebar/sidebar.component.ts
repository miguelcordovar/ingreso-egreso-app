import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from '../../app.reducer';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit, OnDestroy {

  authSubscription!:Subscription

  username!:string;

  constructor(private authService:AuthService,
              private router:Router,
              private store:Store<AppState>) { }

  ngOnInit(): void {
    this.authSubscription = this.store.select('auth')
      .subscribe(state => {
          this.username = state.user?.username!;
      })
  }

  ngOnDestroy(): void {
      this.authSubscription.unsubscribe();
  }

  logout() {
    this.authService.logout()
      .then(() => {
        this.router.navigate(['/login']);
      })
      .catch(err => console.error(err));
  }
}
